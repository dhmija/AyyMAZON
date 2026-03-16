"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside and handle ESC key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden"; // Prevent scrolling
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/70 z-[60] transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Sidebar Panel */}
      <div
        ref={sidebarRef}
        className={cn(
          "fixed top-0 left-0 h-full w-[365px] bg-white z-[70] shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto overflow-x-hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="bg-amazon-nav-dark text-white px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
            Hello, Sign in
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition absolute -right-12 top-2 text-white outline-none">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
          </button>
        </div>

        <div className="py-2">
          {/* Section 1 */}
          <div className="border-b border-gray-300 py-2">
            <h3 className="px-8 py-2 font-bold text-lg text-gray-800">Digital Content & Devices</h3>
            <SidebarLink href="#" label="Amazon Music" />
            <SidebarLink href="#" label="Kindle E-readers & Books" />
            <SidebarLink href="#" label="Amazon Appstore" />
          </div>

          {/* Section 2 */}
          <div className="border-b border-gray-300 py-2">
            <h3 className="px-8 py-2 font-bold text-lg text-gray-800">Shop By Department</h3>
            <SidebarLink href="/products/category/smartphones" label="Smartphones & Tech" />
            <SidebarLink href="/products/category/laptops" label="Laptops" />
            <SidebarLink href="/products/category/mens-shirts" label="Men's Fashion" />
            <SidebarLink href="/products/category/womens-dresses" label="Women's Fashion" />
            <SidebarLink href="#" label="See All" />
          </div>

          {/* Section 3 */}
          <div className="border-b border-gray-300 py-2">
            <h3 className="px-8 py-2 font-bold text-lg text-gray-800">Programs & Features</h3>
            <SidebarLink href="#" label="Gift Cards" />
            <SidebarLink href="#" label="Amazon Live" />
            <SidebarLink href="#" label="International Shopping" />
            <SidebarLink href="#" label="See All" />
          </div>

          {/* Section 4 */}
          <div className="py-2 pb-6">
            <h3 className="px-8 py-2 font-bold text-lg text-gray-800">Help & Settings</h3>
            <SidebarLink href="#" label="Your Account" />
            <SidebarLink href="#" label="English" />
            <SidebarLink href="#" label="United States" />
            <SidebarLink href="#" label="Sign In" />
          </div>
        </div>
      </div>
    </>
  );
}

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between px-8 py-3.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
    >
      <span>{label}</span>
      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    </Link>
  );
}
