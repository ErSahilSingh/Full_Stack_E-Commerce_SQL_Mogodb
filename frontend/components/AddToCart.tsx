"use client";

import { addCartItemRequest } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AddToCartButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await addCartItemRequest({ productId, quantity: 1 });
      router.push("/cart");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <button type="button" disabled={busy} onClick={onClick}>
        add to cart
      </button>
      {error ? <p style={{ color: "#a00", fontSize: 14 }}>{error}</p> : null}
    </div>
  );
}
