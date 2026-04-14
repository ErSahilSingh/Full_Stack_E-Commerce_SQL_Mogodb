import Link from "next/link";
import type { ReactNode } from "react";
import { fetchProductById } from "@/lib/api";
import { AddToCartButton } from "@/components/AddToCart";

type Props = {
  params: { id: string };
};

export default async function ProductDetailPage({ params }: Props) {
  let body: ReactNode = null;

  try {
    const res = await fetchProductById(params.id);
    const p = res.data;
    body = (
      <div className="card" style={{ maxWidth: 720 }}>
        <h1 style={{ marginTop: 0 }}>{p.name}</h1>
        <p style={{ color: "#64748b" }}>{p.category}</p>
        <p style={{ fontSize: 22, fontWeight: 700 }}>${Number(p.price).toFixed(2)}</p>
        {p.description ? <p>{p.description}</p> : null}
        <p style={{ color: "#64748b", fontSize: 14 }}>Stock: {p.stock}</p>
        <AddToCartButton productId={p._id} />
        <p style={{ marginTop: 16 }}>
          <Link href="/products">Back to products</Link>
        </p>
      </div>
    );
  } catch {
    body = (
      <div>
        <p>Product not found.</p>
        <Link href="/products">Back to products</Link>
      </div>
    );
  }

  return <div>{body}</div>;
}
