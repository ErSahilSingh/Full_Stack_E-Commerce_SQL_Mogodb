"use client";

import { fetchOrders } from "@/lib/api";
import type { Order } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
      return;
    }
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchOrders();
        setOrders(res.data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [router]);

  if (loading) {
    return <p>Loading orders…</p>;
  }

  if (error) {
    return <p style={{ color: "#b91c1c" }}>{error}</p>;
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((o) => (
          <div key={o.id} className="card" style={{ marginBottom: 14 }}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700 }}>Order #{o.id}</div>
              <div style={{ color: "#64748b" }}>{String(o.status)}</div>
            </div>
            <div style={{ color: "#64748b", fontSize: 14 }}>
              {new Date(o.created_at).toLocaleString()}
            </div>
            <div style={{ marginTop: 8, fontWeight: 600 }}>
              Total: ${Number(o.total_amount).toFixed(2)}
            </div>
            <ul style={{ margin: "10px 0 0", paddingLeft: 18 }}>
              {o.items.map((it) => (
                <li key={it.id}>
                  {it.product_name} × {it.quantity} @ ${Number(it.price).toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
      <p>
        <Link href="/products">Continue shopping</Link>
      </p>
    </div>
  );
}
