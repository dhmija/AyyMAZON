import { prisma } from "../lib/prisma";
import { NotFoundError } from "../utils/errors";

const productInclude = {
  category: { select: { id: true, name: true, slug: true } },
  images: { select: { id: true, imageUrl: true } },
};

function serializeProduct<T extends { price: { toString(): string }; originalPrice?: { toString(): string } | null; discountPercentage?: { toString(): string } | null; rating?: { toString(): string } | null }>(p: T) {
  return {
    ...p,
    price: p.price.toString(),
    originalPrice: p.originalPrice?.toString() ?? null,
    discountPercentage: p.discountPercentage?.toString() ?? null,
    rating: p.rating?.toString() ?? null,
  };
}

export const productService = {
  async findAll(params: { page?: number; limit?: number }) {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        include: productInclude,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count(),
    ]);

    const data = products.map(serializeProduct);

    return { data, total, page, limit };
  },

  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });
    if (!product) throw new NotFoundError("Product", id);
    return serializeProduct(product);
  },

  async search(query: string, params: { page?: number; limit?: number; category?: string }) {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const skip = (page - 1) * limit;
    const term = query.trim();
    
    let categoryFilter = {};
    if (params.category) {
      const category = await prisma.category.findUnique({ where: { slug: params.category } });
      if (category) categoryFilter = { categoryId: category.id };
    }

    const whereClause = {
      ...categoryFilter,
      ...(term ? {
        OR: [
          { title: { contains: term } as any },
          { description: { contains: term } as any },
        ],
      } : {})
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: productInclude,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({
        where: whereClause,
      }),
    ]);

    return {
      data: products.map(serializeProduct),
      total,
      page,
      limit,
    };
  },

  async findByCategorySlug(categorySlug: string, params: { page?: number; limit?: number }) {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const skip = (page - 1) * limit;

    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });
    if (!category) throw new NotFoundError("Category", categorySlug);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { categoryId: category.id },
        skip,
        take: limit,
        include: productInclude,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where: { categoryId: category.id } }),
    ]);

    return {
      data: products.map(serializeProduct),
      total,
      page,
      limit,
    };
  },
};
