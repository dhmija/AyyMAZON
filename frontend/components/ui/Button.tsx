import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
}

const variantStyles = {
  primary:
    "bg-amazon-orange-dark text-white hover:bg-amber-600 active:bg-amber-700 border-amazon-orange-dark",
  secondary:
    "bg-amazon-orange text-amazon-text hover:bg-amber-200 active:bg-amber-300 border-amazon-orange",
  outline:
    "bg-white border border-amazon-nav-mid text-amazon-text hover:bg-amazon-background",
  ghost:
    "bg-transparent text-amazon-text hover:bg-amazon-background border-transparent",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border-red-600",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth,
      isLoading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={props.type ?? "button"}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium border rounded transform-gpu transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-amazon-orange-dark focus:ring-offset-1 enabled:hover:-translate-y-0.5 enabled:hover:shadow-card disabled:opacity-60 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
