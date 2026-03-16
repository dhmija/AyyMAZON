import { HeroCarousel } from "@/components/HeroCarousel";
import { GridCard, type GridCardItem } from "@/components/GridCard";
import { fetchProducts } from "@/lib/products";
import type { Product } from "@/types";

// Target site style banners
const HERO_SLIDES = [
  {
    id: "1",
    imageUrl: "https://m.media-amazon.com/images/I/71Ie3JXGfVL._SX3000_.jpg",
    alt: "Blockbuster entertainment Join Prime",
    href: "/",
  },
  {
    id: "2",
    imageUrl: "https://m.media-amazon.com/images/I/81KkrQWEHIL._SX3000_.jpg",
    alt: "Flights promotion",
    href: "/",
  },
  {
    id: "3",
    imageUrl: "https://m.media-amazon.com/images/I/61zAjw4bqPL._SX3000_.jpg",
    alt: "Electronics Sale",
    href: "/products/category/electronics",
  },
];

export default async function HomePage() {
  // Parallel data fetching for categories
  const [electronicsData, laptopsData, mensShirtsData, womensDressesData] = await Promise.all([
    fetchProducts({ category: "smartphones", limit: 4 }),
    fetchProducts({ category: "laptops", limit: 4 }),
    fetchProducts({ category: "mens-shirts", limit: 4 }),
    fetchProducts({ category: "womens-dresses", limit: 4 }),
  ]);

  const electronics = electronicsData as Product[];
  const laptops = laptopsData as Product[];
  const mensShirts = mensShirtsData as Product[];
  const womensDresses = womensDressesData as Product[];

  // Helper to map products to grid items
  const mapToGridItems = (products: Product[]): GridCardItem[] => {
    return products.slice(0, 4).map(p => ({
      name: p.title,
      imageUrl: p.images?.[0]?.imageUrl || "https://dummyjson.com/image/400x400",
      href: `/products/${p.id}`,
    }));
  };

  return (
    <main className="min-h-screen bg-[#E3E6E6] pb-8">
      {/* Hero banner carousel */}
      <section className="w-full relative mx-auto max-w-[1500px]">
        {/* We use Next.js Image optimization in HeroCarousel */}
        <HeroCarousel slides={HERO_SLIDES} interval={5000} className="[mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]" />
      </section>

      {/* Grid Layout - Pulled up to overlap the hero banner slightly */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-5 relative z-10 -mt-[10%] sm:-mt-[15%] md:-mt-[20%] space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {electronics.length > 0 && (
            <GridCard
              title="Smartphones & Tech"
              items={mapToGridItems(electronics)}
              linkText="See all smartphones"
              linkHref="/products/category/smartphones"
            />
          )}

          {laptops.length > 0 && (
            <GridCard
              title="Laptops & Accessories"
              items={mapToGridItems(laptops)}
              linkText="Shop now"
              linkHref="/products/category/laptops"
            />
          )}

          {mensShirts.length > 0 && (
            <GridCard
              title="Men's Fashion"
              items={mapToGridItems(mensShirts)}
              linkText="See more"
              linkHref="/products/category/mens-shirts"
            />
          )}

          {womensDresses.length > 0 && (
            <GridCard
              title="Women's Fashion"
              items={mapToGridItems(womensDresses)}
              linkText="Explore all"
              linkHref="/products/category/womens-dresses"
            />
          )}
        </div>

        {/* Second row of grids (Mocking other categories just to fill space) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Can use single-item grid cards here to mix it up */}
            {electronics[0] && (
              <GridCard
                title="Deal of the Day"
                items={[mapToGridItems(electronics)[0]]}
                linkText="See all deals"
                linkHref="/products/category/smartphones"
              />
            )}
             {laptops[0] && (
              <GridCard
                title="Upgrade your setup"
                items={[mapToGridItems(laptops)[0]]}
                linkText="Shop Laptops"
                linkHref="/products/category/laptops"
              />
            )}
             {mensShirts.length > 3 && (
              <GridCard
                title="Trending in Mens"
                items={mapToGridItems(mensShirts.slice(1, 4)).concat(mapToGridItems(mensShirts)[0])}
                linkText="Discover more"
                linkHref="/products/category/mens-shirts"
              />
            )}
             {womensDresses.length > 3 && (
              <GridCard
                title="Trending in Womens"
                items={mapToGridItems(womensDresses.slice(1, 4)).concat(mapToGridItems(womensDresses)[0])}
                linkText="Discover more"
                linkHref="/products/category/womens-dresses"
              />
            )}
        </div>
      </div>
    </main>
  );
}
