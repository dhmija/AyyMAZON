import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Interfaces for external APIs
interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

interface DummyJsonProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  category: string;
  thumbnail: string;
  images: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Format a category string nicely, e.g. "mens-watches" -> "Men's Watches"
function formatCategoryName(slug: string): string {
  if (slug === "men's clothing") return "Men's Clothing";
  if (slug === "women's clothing") return "Women's Clothing";
  
  return slug
    .split(/[-_&]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace(" And ", " & ");
}

// Create a safe slug for the URL
function createSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("🌱 Fetching authentic products for database seed...\n");

  // Clear existing data
  console.log("🧹 Clearing old database entries...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log("   ✓ Old data cleared.\n");

  const categoryMap = new Map<string, string>(); // slug -> ID
  let productCount = 0;

  // Helper to get or create category
  const getOrCreateCategory = async (apiCategory: string) => {
    const slug = createSlug(apiCategory);
    if (!categoryMap.has(slug)) {
      const name = formatCategoryName(apiCategory);
      const category = await prisma.category.upsert({
        where: { slug },
        create: { name, slug },
        update: { name },
      });
      categoryMap.set(slug, category.id);
      console.log(`   📁 Category: ${name}`);
    }
    return categoryMap.get(slug)!;
  };

  // 1. Fetch from FakeStore API
  console.log("\n📦 Fetching from FakeStore API...");
  try {
    const fakeStoreRes = await fetch("https://fakestoreapi.com/products");
    const fakeStoreProducts: FakeStoreProduct[] = await fakeStoreRes.json();
    
    for (const p of fakeStoreProducts) {
      const catId = await getOrCreateCategory(p.category);
      
      const hasDiscount = Math.random() > 0.5;
      const discountPct = hasDiscount ? randomInt(5, 30) : 0;
      const originalPrice = p.price;
      const price = hasDiscount ? Number((originalPrice * (1 - discountPct / 100)).toFixed(2)) : originalPrice;

      // Ensure price is an integer resembling INR mapping for electronics (multiplying by 80)
      const adjustedPrice = Math.round(price * 80);
      const adjustedOriginal = Math.round(originalPrice * 80);

      await prisma.product.create({
        data: {
          title: p.title,
          description: p.description,
          price: adjustedPrice,
          originalPrice: hasDiscount ? adjustedOriginal : null,
          discountPercentage: hasDiscount ? discountPct : null,
          rating: p.rating.rate,
          reviewCount: p.rating.count,
          stock: randomInt(10, 150),
          categoryId: catId,
          images: {
            create: [{ imageUrl: p.image }] // FakeStore only gives 1 image
          }
        }
      });
      productCount++;
    }
    console.log(`   ✓ Imported ${fakeStoreProducts.length} FakeStore products`);
  } catch (e) {
    console.error("   ❌ Failed to fetch from FakeStore API:", e);
  }

  // 2. Fetch from DummyJSON (194 products limit)
  console.log("\n📦 Fetching from DummyJSON API...");
  try {
    const dummyJsonRes = await fetch("https://dummyjson.com/products?limit=194");
    const data = await dummyJsonRes.json();
    const dummyJsonProducts: DummyJsonProduct[] = data.products;

    for (const p of dummyJsonProducts) {
      const catId = await getOrCreateCategory(p.category);

      const price = p.price;
      const originalPrice = p.discountPercentage > 0 
        ? Number((price / (1 - p.discountPercentage / 100)).toFixed(2))
        : price;
      const hasDiscount = p.discountPercentage > 0;

      // Filter out thumbnail and get unique high-res images
      const allImages = [p.thumbnail, ...p.images].filter((v, i, a) => a.indexOf(v) === i);
      const imagesToStore = allImages.slice(0, 5);

      const adjustedPrice = Math.round(price * 80);
      const adjustedOriginal = Math.round(originalPrice * 80);

      await prisma.product.create({
        data: {
          title: p.title,
          description: p.description,
          price: adjustedPrice,
          originalPrice: hasDiscount ? adjustedOriginal : null,
          discountPercentage: hasDiscount ? Math.round(p.discountPercentage) : null,
          rating: p.rating,
          reviewCount: randomInt(15, 800),
          stock: p.stock,
          categoryId: catId,
          images: {
             create: imagesToStore.map(url => ({ imageUrl: url }))
          }
        }
      });
      productCount++;
    }
    console.log(`   ✓ Imported ${dummyJsonProducts.length} DummyJSON products`);
  } catch (e) {
    console.error("   ❌ Failed to fetch from DummyJSON API:", e);
  }

  const finalCount = await prisma.product.count();
  const finalCatCount = await prisma.category.count();
  console.log(`\n✅ Seed complete!`);
  console.log(`   Categories: ${finalCatCount}`);
  console.log(`   Products:   ${finalCount} (Added ${productCount} this run)`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
