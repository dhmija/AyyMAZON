import { prisma } from "../lib/prisma";
import { NotFoundError, BadRequestError } from "../utils/errors";
import { sendOrderConfirmationEmail } from "../utils/email";

const orderInclude = {
  items: {
    include: {
      product: {
        select: {
          id: true,
          title: true,
          images: { take: 1, select: { imageUrl: true } },
        },
      },
    },
  },
};

export const orderService = {
  async create(userId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestError("Cart is empty. Add items before placing an order.");
    }

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new BadRequestError(
          `Insufficient stock for "${item.product.title}". Available: ${item.product.stock}`
        );
      }
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: "PENDING",
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: orderInclude,
      });

      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    const formattedOrder = this.formatOrder(order);

    // Fetch user email to send confirmation (in a real app, users would be fully authenticated. Here we just try to get it, or fallback)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user && user.email) {
      // Fire and forget email
      sendOrderConfirmationEmail(formattedOrder.id, user.email, formattedOrder.totalAmount).catch(console.error);
    }

    return formattedOrder;
  },

  async findById(id: string, userId?: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: orderInclude,
    });
    if (!order) throw new NotFoundError("Order", id);
    if (userId && order.userId !== userId) {
      throw new NotFoundError("Order", id);
    }
    return this.formatOrder(order);
  },

  async findByUserId(userId: string, params: { page?: number; limit?: number }) {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        include: orderInclude,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    return {
      data: orders.map((o) => this.formatOrder(o)),
      total,
      page,
      limit,
    };
  },

  formatOrder(order: {
    id: string;
    userId: string;
    totalAmount: { toString(): string };
    status: string;
    createdAt: Date;
    items: Array<{
      id: string;
      productId: string;
      quantity: number;
      price: { toString(): string };
      product: {
        id: string;
        title: string;
        images: Array<{ imageUrl: string }>;
      };
    }>;
  }) {
    return {
      id: order.id,
      userId: order.userId,
      totalAmount: order.totalAmount.toString(),
      status: order.status,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price.toString(),
        product: {
          id: item.product.id,
          title: item.product.title,
          image: item.product.images[0]?.imageUrl ?? null,
        },
      })),
    };
  },
};
