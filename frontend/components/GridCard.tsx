import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface GridCardItem {
  name: string;
  imageUrl: string;
  href: string;
}

export interface GridCardProps {
  title: string;
  items: GridCardItem[];
  linkText?: string;
  linkHref?: string;
  className?: string;
}

export function GridCard({
  title,
  items,
  linkText = "See more",
  linkHref = "/",
  className,
}: GridCardProps) {
  const isQuad = items.length >= 4;
  const displayItems = isQuad ? items.slice(0, 4) : items.slice(0, 1);

  return (
    <div className={cn("bg-white p-5 flex flex-col h-full shadow-sm z-10 relative", className)}>
      <h2 className="text-xl font-bold mb-4 text-amazon-text tracking-tight line-clamp-1">
        {title}
      </h2>

      <div className={cn("flex-grow", isQuad && "grid grid-cols-2 gap-4")}>
        {displayItems.map((item, idx) => (
          <Link key={idx} href={item.href} className="group flex flex-col items-center">
            <div className={cn("relative w-full bg-gray-50 mb-2", isQuad ? "aspect-square" : "aspect-[4/3]")}>
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-contain p-2 mix-blend-multiply"
                sizes={isQuad ? "(max-width: 768px) 50vw, 25vw" : "(max-width: 768px) 100vw, 33vw"}
              />
            </div>
            {isQuad && (
              <span className="text-xs text-amazon-text group-hover:text-amazon-orange text-center line-clamp-1 w-full">
                {item.name}
              </span>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-4 pt-2">
        <Link href={linkHref} className="text-sm font-medium text-[#007185] hover:text-[#C7511F] hover:underline">
          {linkText}
        </Link>
      </div>
    </div>
  );
}
