"use client";

import { checkoutRequest } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    }
  }, [router]);

  const confirm = async () => {
    setBusy(true);
    setError(null);
    try {
      await checkoutRequest();
      router.push("/orders");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Checkout</h1>
      <p style={{ color: "#64748b", maxWidth: 560 }}>
        Confirm to place your order using the items currently in your cart.
      </p>
      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
      <div className="row">
        <button type="button" disabled={busy} onClick={confirm}>
          Confirm order
        </button>
        <Link href="/cart">Back to cart</Link>
      </div>
    </div>
  );
}
