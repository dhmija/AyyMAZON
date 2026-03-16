import { prisma } from "../lib/prisma";
import { NotFoundError, BadRequestError } from "../utils/errors";

const cartItemInclude = {
  product: {
    include: {
      images: { take: 1, select: { imageUrl: true } },
      category: { select: { id: true, name: true, slug: true } },
    },
  },
};

export const cartService = {
  async getOrCreateCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: cartItemInclude,
        },
      },
    });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: cartItemInclude,
          },
        },
      });
    }
    return this.formatCart(cart);
  },

  async addItem(userId: string, productId: string, quantity: number) {
    if (quantity < 1) throw new BadRequestError("Quantity must be at least 1");

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundError("Product", productId);
    if (product.stock < quantity) {
      throw new BadRequestError(`Insufficient stock. Available: ${product.stock}`);
    }

    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    await prisma.cartItem.upsert({
      where: {
        cartId_productId: { cartId: cart.id, productId },
      },
      create: { cartId: cart.id, productId, quantity },
      update: { quantity: { increment: quantity } },
    });

    return this.getOrCreateCart(userId);
  },

  async updateItem(userId: string, productId: string, quantity: number) {
    if (quantity < 0) throw new BadRequestError("Quantity cannot be negative");
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundError("Cart");

    if (quantity === 0) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id, productId },
      });
      return this.getOrCreateCart(userId);
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundError("Product", productId);
    if (product.stock < quantity) {
      throw new BadRequestError(`Insufficient stock. Available: ${product.stock}`);
    }

    await prisma.cartItem.upsert({
      where: {
        cartId_productId: { cartId: cart.id, productId },
      },
      create: { cartId: cart.id, productId, quantity },
      update: { quantity },
    });

    return this.getOrCreateCart(userId);
  },

  async removeItem(userId: string, productId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundError("Cart");

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id, productId },
    });

    return this.getOrCreateCart(userId);
  },

  formatCart(cart: {
    id: string;
    userId: string;
    items: Array<{
      id: string;
      productId: string;
      quantity: number;
      product: {
        id: string;
        title: string;
        description: string | null;
        price: { toString(): string };
        stock: number;
        category: { id: string; name: string; slug: string };
        images: Array<{ imageUrl: string }>;
      };
    }>;
  }) {
    const items = cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        title: item.product.title,
        description: item.product.description,
        price: item.product.price.toString(),
        stock: item.product.stock,
        category: item.product.category,
        image: item.product.images[0]?.imageUrl ?? null,
      },
    }));

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    return {
      id: cart.id,
      userId: cart.userId,
      items,
      totalAmount: totalAmount.toFixed(2),
    };
  },
};
