import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchProductById, fetchProducts } from "@/lib/products";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { ProductGallery } from "@/components/products/ProductGallery";
import { AddToListButton } from "@/components/products/AddToListButton";
import { StarRating } from "@/components/ui/StarRating";
import { HomeProductSection } from "@/components/HomeProductSection";

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await fetchProductById(params.id);
  const relatedProducts = await fetchProducts({ category: product?.category?.slug, limit: 12 });

  if (!product) {
    notFound();
  }

  // Format currency
  const formatPrice = (price?: string | null) => {
    if (!price) return "";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(price));
  };

  const currentPrice = formatPrice(product.price);
  const originalPrice = formatPrice(product.originalPrice);

  return (
    <main className="min-h-screen bg-white pb-10">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb could go here */}
        <div className="text-sm text-amazon-text-muted mb-4 capitalize">
          {product.category?.name || "Product"} &rsaquo; {product.title}
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Left: Image Gallery */}
          <div className="w-full md:w-5/12 lg:w-4/12 flex-shrink-0">
            <ProductGallery images={product.images || []} title={product.title} />
          </div>

          {/* Middle: Product Info */}
          <div className="w-full md:w-4/12 lg:w-5/12 flex-grow flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-medium text-amazon-text mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 text-sm">
                {product.rating && (
                  <div className="flex items-center gap-1">
                    <StarRating rating={Number(product.rating)} />
                    <span className="text-amazon-link-blue hover:text-amazon-orange-dark cursor-pointer hover:underline">
                      {product.reviewCount} ratings
                    </span>
                  </div>
                )}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Price Section */}
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-medium text-amazon-text">{currentPrice}</span>
              </div>
              
              {product.originalPrice && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>M.R.P.:</span>
                  <span className="line-through">{originalPrice}</span>
                  {product.discountPercentage && (
                    <span className="text-red-700 font-medium">
                      ({Number(product.discountPercentage).toFixed(0)}% off)
                    </span>
                  )}
                </div>
              )}
              <p className="text-sm font-medium">Inclusive of all taxes</p>
            </div>

            <hr className="border-gray-200" />

            {/* Ask Rufus */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2 text-amazon-text font-bold">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                Ask Rufus
              </div>
              <p className="text-sm text-gray-700 mb-3">Hi, I'm Rufus, your AI shopping assistant. Ask me anything about this product!</p>
              <div className="relative">
                <input type="text" placeholder="What are the dimensions?" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400" disabled />
                <button className="absolute right-2 top-1.5 p-1 bg-blue-100 text-blue-700 rounded shadow-sm hover:bg-blue-200" disabled>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                </button>
              </div>
              <div className="flex gap-2 mt-2">
                <button className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-700 font-medium hover:bg-gray-50" disabled>Is this item durable?</button>
                <button className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-700 font-medium hover:bg-gray-50" disabled>What is the warranty?</button>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Description */}
            <div>
              <h3 className="font-bold text-base mb-2">About this item</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-amazon-text">
                <li>{product.description}</li>
              </ul>
            </div>
          </div>

          {/* Right: Buy Box */}
          <div className="w-full md:w-3/12 lg:w-[280px] flex-shrink-0">
            <div className="border border-gray-200 rounded-lg p-4 sticky top-6 shadow-sm flex flex-col gap-4">
              <div className="text-2xl font-medium text-amazon-text">
                {currentPrice}
              </div>
              
              <div className="flex items-center gap-1.5">
                <Image src="https://m.media-amazon.com/images/G/31/marketing/fba/fba-badge_18px-2x._CB485991191_.png" alt="Prime" width={52} height={16} className="h-4 w-auto object-contain mix-blend-multiply" />
              </div>

              <div className="text-sm">
                <span className="text-amazon-link-blue hover:text-amazon-orange-dark cursor-pointer mt-1">
                  FREE delivery
                </span> Tuesday, March 24 on orders dispatched by Amazon over ₹499.
              </div>

              <div className="text-sm flex flex-col gap-1 mt-2">
                <div className="flex gap-2 mb-1">
                  <span className="text-green-700 text-lg font-medium">In stock</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="text-gray-500 w-20">Ships from</span>
                  <span>Amazon</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="text-gray-500 w-20">Sold by</span>
                  <span className="text-amazon-link-blue hover:underline">RetailNet</span>
                </div>
              </div>

              {product.stock > 0 && (
                <div className="mt-2 text-sm pt-4 border-t border-gray-200">
                  <AddToCartButton productId={product.id} maxQuantity={product.stock} />
                </div>
              )}

              <hr className="border-gray-200 mt-2" />
              <AddToListButton productId={product.id} />
            </div>
          </div>
        </div>

        {/* Bottom: Related Products */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <HomeProductSection
            title="Customers who viewed this item also viewed"
            products={relatedProducts}
            isLoading={false}
            maxItems={10}
          />
        </div>
      </div>
    </main>
  );
}
