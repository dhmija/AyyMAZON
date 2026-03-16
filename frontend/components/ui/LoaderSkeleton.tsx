import { cn } from "@/lib/utils";

export interface LoaderSkeletonProps {
  className?: string;
}

export function LoaderSkeleton({ className }: LoaderSkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded bg-slate-200/90 before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent",
        className
      )}
      aria-hidden
    />
  );
}

/** Skeleton for a product card */
export function ProductCardSkeleton() {
  return (
    <div className="bg-amazon-card-bg rounded shadow-card p-4 flex flex-col h-full">
      <LoaderSkeleton className="w-full aspect-square mb-3" />
      <LoaderSkeleton className="h-4 w-3/4 mb-2" />
      <LoaderSkeleton className="h-4 w-1/2 mb-2" />
      <LoaderSkeleton className="h-5 w-20 mb-2" />
      <LoaderSkeleton className="h-4 w-16" />
    </div>
  );
}

/** Skeleton for a cart/order line item */
export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 bg-amazon-card-bg rounded shadow-card">
      <LoaderSkeleton className="w-24 h-24 shrink-0 rounded" />
      <div className="flex-1 min-w-0">
        <LoaderSkeleton className="h-4 w-full mb-2" />
        <LoaderSkeleton className="h-4 w-2/3 mb-2" />
        <LoaderSkeleton className="h-5 w-20" />
      </div>
    </div>
  );
}

/** Skeleton for search bar */
export function SearchBarSkeleton() {
  return (
    <div className="flex flex-1 max-w-xl">
      <LoaderSkeleton className="h-10 w-full rounded-r-none rounded-l" />
      <LoaderSkeleton className="h-10 w-12 rounded-l-none rounded-r shrink-0" />
    </div>
  );
}

export function CartPageSkeleton() {
  return (
    <div className="min-h-screen bg-amazon-background animate-fade-up">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <LoaderSkeleton className="h-9 w-56" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <CartItemSkeleton />
            <CartItemSkeleton />
            <CartItemSkeleton />
          </div>
          <LoaderSkeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function CheckoutPageSkeleton() {
  return (
    <div className="min-h-screen bg-amazon-background animate-fade-up">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <LoaderSkeleton className="h-9 w-44" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <LoaderSkeleton className="lg:col-span-2 h-[29rem] rounded-2xl" />
          <LoaderSkeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-amazon-background animate-fade-up">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <LoaderSkeleton className="lg:col-span-4 h-[24rem] rounded-2xl" />
          <div className="lg:col-span-4 space-y-4">
            <LoaderSkeleton className="h-5 w-24" />
            <LoaderSkeleton className="h-10 w-4/5" />
            <LoaderSkeleton className="h-6 w-40" />
            <LoaderSkeleton className="h-8 w-48" />
            <LoaderSkeleton className="h-4 w-full" />
            <LoaderSkeleton className="h-4 w-5/6" />
            <LoaderSkeleton className="h-4 w-3/4" />
          </div>
          <LoaderSkeleton className="lg:col-span-4 h-[22rem] rounded-2xl" />
        </div>
        <LoaderSkeleton className="h-44 rounded-2xl" />
        <LoaderSkeleton className="h-56 rounded-2xl" />
      </div>
    </div>
  );
}

export function OrderConfirmationSkeleton() {
  return (
    <div className="min-h-screen bg-amazon-background animate-fade-up">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-amazon-card-bg rounded-2xl shadow-card p-6 space-y-5">
          <LoaderSkeleton className="h-8 w-56" />
          <LoaderSkeleton className="h-5 w-40" />
          <LoaderSkeleton className="h-28 rounded-xl" />
          <LoaderSkeleton className="h-24 rounded-xl" />
          <LoaderSkeleton className="h-12 w-40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
