"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";
import { cn } from "@/lib/utils";

import { Sidebar } from "@/components/Sidebar";
import { useCart } from "@/context/CartContext";

const SECOND_BAR_CATEGORIES = [
  { label: "Rufus", slug: "#" },
  { label: "Fresh", slug: "#" },
  { label: "Amazon Pay", slug: "#" },
  { label: "MX Player", slug: "#" },
  { label: "Sell", slug: "#" },
  { label: "Gift Cards", slug: "#" },
  { label: "Buy Again", slug: "#" },
  { label: "AmazonBasics", slug: "#" },
  { label: "Prime Videos", slug: "#" },
] as const;

export interface NavbarProps {
  /** Current search query (optional, for controlled use) */
  searchValue?: string;
  /** Cart item count to show in badge */
  cartCount?: number;
  /** Delivery location label (e.g. city or "India") */
  deliveryLocation?: string;
  /** Optional additional class */
  className?: string;
}

export function Navbar({
  searchValue,
  deliveryLocation = "India",
  className,
}: NavbarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { cartCount } = useCart();
  const router = useRouter();

  const handleSearch = (query: string, categorySlug?: string) => {
    if (!query) return;
    const searchParams = new URLSearchParams({ search: query });
    if (categorySlug) searchParams.set("category", categorySlug);
    router.push(`/search?${searchParams.toString()}`);
  };

  return (
    <>
      <Sidebar open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <header
        className={cn(
          "sticky top-0 z-50 bg-amazon-nav-dark text-white",
          className
        )}
      >
      {/* TOP BAR: logo, delivery, search, language, account, returns, cart */}
      <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center shrink-0 text-amazon-orange font-bold text-xl sm:text-2xl tracking-tight hover:opacity-90 py-1 transition-transform duration-200 hover:-translate-y-0.5"
          aria-label="Amazon.in Home"
        >
          amazon.in
        </Link>

        {/* Delivery location */}
        <div className="hidden sm:flex flex-col shrink-0 text-xs py-1 px-2 hover:opacity-90 transition-colors duration-200">
          <span className="text-gray-300 flex items-center gap-0.5">
            <LocationIcon className="w-3.5 h-3.5" />
            Deliver to
          </span>
          <span className="font-medium text-white">{deliveryLocation}</span>
        </div>

        {/* Large search bar with category dropdown */}
        <div className="flex-1 min-w-0 flex justify-center max-w-2xl">
          <SearchBar
            defaultValue={searchValue}
            onSearch={handleSearch}
            placeholder="Search Amazon.in"
            className="w-full"
          />
        </div>

        {/* Language selector */}
        <LanguageSelector className="hidden md:flex shrink-0" />

        {/* Wishlist Link */}
        <Link
          href="/wishlist"
          className="hidden md:flex flex-col text-xs py-1 px-2 hover:opacity-90 shrink-0 transition-colors duration-200"
        >
          <span className="text-gray-300">Your</span>
          <span className="font-semibold text-white">Wishlist</span>
        </Link>

        {/* Account & Lists */}
        <Link
          href="#"
          className="hidden sm:flex flex-col text-xs py-1 px-2 hover:opacity-90 shrink-0 transition-colors duration-200"
        >
          <span className="text-gray-300">Hello, sign in</span>
          <span className="font-semibold text-white">Account & Lists</span>
        </Link>

        {/* Returns & Orders */}
        <Link
          href="/orders"
          className="hidden sm:flex flex-col text-xs py-1 px-2 hover:opacity-90 shrink-0 transition-colors duration-200"
        >
          <span className="text-gray-300">Returns</span>
          <span className="font-semibold text-white">& Orders</span>
        </Link>

        {/* Cart */}
        <Link
          href="/cart"
          className="relative flex items-end gap-1 pb-1.5 px-2 rounded hover:opacity-90 shrink-0 transition-transform duration-200 hover:-translate-y-0.5"
          aria-label={`Cart, ${cartCount} items`}
        >
          {/* Container matches Amazon's #nav-cart-count-container: position relative */}
          <div style={{ position: "relative", width: "41px", height: "28px" }}>
            {/* Amazon sprite — exact position match */}
            <span
              style={{
                width: "41px",
                height: "28px",
                backgroundImage:
                  "url('https://m.media-amazon.com/images/G/31/gno/sprites/nav-sprite-global-1x-reorg-privacy._CB546381437_.png')",
                backgroundPosition: "-218px -337px",
                backgroundRepeat: "no-repeat",
                display: "block",
              }}
              aria-hidden
            />
            {/* Counter — sits inside the basket */}
            <span
              style={{
                position: "absolute",
                top: "-3px",
                left: "14px",
                minWidth: "18px",
                textAlign: "center",
                color: "#f08804",
                fontWeight: 700,
                fontSize: "14px",
                lineHeight: "16px",
              }}
              aria-hidden
            >
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          </div>
          <span className="font-bold text-white text-sm mb-0.5">
            Cart
          </span>
        </Link>
      </div>

      {/* SECOND BAR: category navigation */}
      <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 bg-amazon-nav-mid text-sm overflow-x-auto scrollbar-hide font-medium">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center gap-1 shrink-0 py-1.5 px-2 rounded hover:border hover:border-white whitespace-nowrap transition-colors duration-200"
        >
          <MenuIcon className="w-5 h-5 mr-0.5" />
          <span>All</span>
        </button>
        {SECOND_BAR_CATEGORIES.map((cat, idx) => (
          <Link
            key={idx}
            href={cat.slug}
            className="shrink-0 py-1.5 px-2 rounded hover:bg-amazon-nav-light whitespace-nowrap transition-colors duration-200"
          >
            {cat.label}
          </Link>
        ))}
      </div>
    </header>
    </>
  );
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}


function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </svg>
  );
}

function LanguageSelector({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 py-1 px-2 rounded hover:opacity-90 text-sm transition-colors duration-200"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="text-amazon-orange font-medium">EN</span>
        <ChevronDownIcon className={cn("w-4 h-4", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-0.5 w-40 py-1 bg-white border border-gray-200 rounded shadow-lg z-50">
          <button
            type="button"
            className="w-full px-3 py-2 text-left text-sm text-amazon-text hover:bg-amazon-background transition-colors duration-200"
            onClick={() => setOpen(false)}
          >
            English - EN
          </button>
          <button
            type="button"
            className="w-full px-3 py-2 text-left text-sm text-amazon-text hover:bg-amazon-background transition-colors duration-200"
            onClick={() => setOpen(false)}
          >
            हिन्दी - HI
          </button>
        </div>
      )}
    </div>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden>
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}
