import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
type RequestWithUserId = Request & { userId: string };

export const getWishlist = async (req: Request, res: Response) => {
  try {
    const userId = (req as RequestWithUserId).userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const wishlist = await prisma.wishlist.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
          orderBy: { addedAt: 'desc' }
        },
      },
    });

    res.json(wishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addItemToWishlist = async (req: Request, res: Response) => {
  try {
    const userId = (req as RequestWithUserId).userId;
    const { productId } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!productId) return res.status(400).json({ error: "Product ID is required" });

    const wishlist = await prisma.wishlist.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    const item = await prisma.wishlistItem.upsert({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
      update: {},
      create: {
        wishlistId: wishlist.id,
        productId,
      },
      include: {
        product: {
          include: { images: true }
        }
      }
    });

    res.json(item);
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeItemFromWishlist = async (req: Request, res: Response) => {
  try {
    const userId = (req as RequestWithUserId).userId;
    const productId = req.params.productId;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    try {
      await prisma.wishlistItem.delete({
        where: {
          wishlistId_productId: {
            wishlistId: wishlist.id,
            productId,
          },
        },
      });
    } catch (e) {
      // ignore if not found
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
