"use client";

import { useState, useCallback } from "react";
import type { AddressFormData } from "@/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface CheckoutFormProps {
  /** Default address values */
  defaultValues?: Partial<AddressFormData>;
  /** Called when form is submitted with valid address */
  onSubmit: (data: AddressFormData) => void;
  /** Submit button loading state */
  isSubmitting?: boolean;
  /** Optional cancel button */
  onCancel?: () => void;
  className?: string;
}

const initialEmpty: AddressFormData = {
  name: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
};

export function CheckoutForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  onCancel,
  className,
}: CheckoutFormProps) {
  const [form, setForm] = useState<AddressFormData>({
    ...initialEmpty,
    ...defaultValues,
  });
  const [touched, setTouched] = useState<Partial<Record<keyof AddressFormData, boolean>>>({});

  const update = useCallback((field: keyof AddressFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleBlur = useCallback((field: keyof AddressFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed: AddressFormData = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        street: form.street.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
      };
      if (
        !trimmed.name ||
        !trimmed.email ||
        !trimmed.phone ||
        !trimmed.street ||
        !trimmed.city ||
        !trimmed.state ||
        !trimmed.pincode
      ) {
        setTouched(
          Object.fromEntries(
            (["name", "email", "phone", "street", "city", "state", "pincode"] as const).map(
              (k) => [k, true]
            )
          ) as Record<keyof AddressFormData, boolean>
        );
        return;
      }
      onSubmit(trimmed);
    },
    [form, onSubmit]
  );

  const showError = (field: keyof AddressFormData) => {
    const value = form[field].trim();
    return touched[field] && !value;
  };

  const inputClass =
    "w-full px-3 py-2 border rounded text-amazon-text text-sm outline-none focus:ring-2 focus:ring-amazon-orange-dark focus:border-transparent";
  const errorClass = "border-red-500";

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("bg-amazon-card-bg rounded shadow-card p-6", className)}
    >
      <h3 className="text-amazon-text font-semibold text-lg mb-4">
        Delivery address
      </h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="checkout-name" className="block text-sm font-medium text-amazon-text mb-1">
            Full name
          </label>
          <input
            id="checkout-name"
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            className={cn(inputClass, showError("name") && errorClass)}
            placeholder="Enter full name"
            autoComplete="name"
          />
          {showError("name") && (
            <p className="mt-1 text-xs text-red-600">Name is required</p>
          )}
        </div>
        <div>
          <label htmlFor="checkout-email" className="block text-sm font-medium text-amazon-text mb-1">
            Email address
          </label>
          <input
            id="checkout-email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            className={cn(inputClass, showError("email") && errorClass)}
            placeholder="For order confirmation"
            autoComplete="email"
          />
          {showError("email") && (
            <p className="mt-1 text-xs text-red-600">Email is required</p>
          )}
        </div>
        <div>
          <label htmlFor="checkout-phone" className="block text-sm font-medium text-amazon-text mb-1">
            Phone number
          </label>
          <input
            id="checkout-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            onBlur={() => handleBlur("phone")}
            className={cn(inputClass, showError("phone") && errorClass)}
            placeholder="10-digit mobile number"
            autoComplete="tel"
          />
          {showError("phone") && (
            <p className="mt-1 text-xs text-red-600">Phone is required</p>
          )}
        </div>
        <div>
          <label htmlFor="checkout-street" className="block text-sm font-medium text-amazon-text mb-1">
            Address (street, area)
          </label>
          <input
            id="checkout-street"
            type="text"
            value={form.street}
            onChange={(e) => update("street", e.target.value)}
            onBlur={() => handleBlur("street")}
            className={cn(inputClass, showError("street") && errorClass)}
            placeholder="Flat, building, area"
            autoComplete="street-address"
          />
          {showError("street") && (
            <p className="mt-1 text-xs text-red-600">Address is required</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="checkout-city" className="block text-sm font-medium text-amazon-text mb-1">
              City
            </label>
            <input
              id="checkout-city"
              type="text"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              onBlur={() => handleBlur("city")}
              className={cn(inputClass, showError("city") && errorClass)}
              placeholder="City"
              autoComplete="address-level2"
            />
            {showError("city") && (
              <p className="mt-1 text-xs text-red-600">City is required</p>
            )}
          </div>
          <div>
            <label htmlFor="checkout-state" className="block text-sm font-medium text-amazon-text mb-1">
              State
            </label>
            <input
              id="checkout-state"
              type="text"
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
              onBlur={() => handleBlur("state")}
              className={cn(inputClass, showError("state") && errorClass)}
              placeholder="State"
              autoComplete="address-level1"
            />
            {showError("state") && (
              <p className="mt-1 text-xs text-red-600">State is required</p>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="checkout-pincode" className="block text-sm font-medium text-amazon-text mb-1">
            PIN code
          </label>
          <input
            id="checkout-pincode"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={form.pincode}
            onChange={(e) => update("pincode", e.target.value.replace(/\D/g, ""))}
            onBlur={() => handleBlur("pincode")}
            className={cn(inputClass, showError("pincode") && errorClass)}
            placeholder="6-digit PIN code"
            autoComplete="postal-code"
          />
          {showError("pincode") && (
            <p className="mt-1 text-xs text-red-600">PIN code is required</p>
          )}
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <Button type="submit" isLoading={isSubmitting} fullWidth>
          Save and continue
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
