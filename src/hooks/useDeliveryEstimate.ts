"use client";

import { useState, type FormEvent } from "react";

// Pincode entry + a plausible-but-fake delivery date estimate (low-stock
// items get a longer window). No real courier API behind this yet.
export function useDeliveryEstimate(stock?: "in_stock" | "low_stock" | "out_of_stock") {
  const [pincode, setPincode] = useState("");
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);

  const handlePincodeChange = (value: string) => {
    setPincode(value.replace(/\D/g, ""));
    setDeliveryEstimate(null);
  };

  const handleCheckDelivery = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) return;
    const date = new Date();
    date.setDate(date.getDate() + (stock === "low_stock" ? 6 : 4));
    setDeliveryEstimate(date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }));
  };

  return { pincode, deliveryEstimate, handlePincodeChange, handleCheckDelivery };
}
