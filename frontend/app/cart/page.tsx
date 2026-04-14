"use client";

import { fetchCart } from "@/lib/api";
import { CartItem } from "@/components/CartItem";
import type { Cart } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCart();
      setCart(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const total =
    cart?.items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0) ?? 0;

  if (loading) {
    return <p>Loading cart…</p>;
  }

  if (error) {
    return <p style={{ color: "#b91c1c" }}>{error}</p>;
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cart.items.map((item) => (
          <CartItem
            key={String(item.productId)}
            item={item}
            onChanged={load}
          />
        ))
      )}
      <div className="row" style={{ marginTop: 16, justifyContent: "space-between" }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Total: ${total.toFixed(2)}</div>
        <Link href="/checkout">Proceed to Checkout</Link>
      </div>
    </div>
  );
}
