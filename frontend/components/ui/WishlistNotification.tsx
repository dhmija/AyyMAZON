"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface WishlistNotificationProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  className?: string;
}

export function WishlistNotification({ 
  message, 
  isVisible, 
  onClose,
  className 
}: WishlistNotificationProps) {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Wait for fade out animation
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20",
        "bg-white border border-gray-200 rounded-xl shadow-lg px-8 py-5",
        "transition-all duration-300 ease-in-out whitespace-pre-line text-center",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
        className
      )}
    >
      <p className="text-amazon-text text-base font-medium leading-relaxed">
        {message}
      </p>
    </div>
  );
}
