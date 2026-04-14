import Link from "next/link";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="card">
      <h3 style={{ margin: "0 0 6px" }}>{product.name}</h3>
      <div style={{ fontSize: 13, color: "#666" }}>{product.category}</div>
      <div style={{ margin: "8px 0" }}>${Number(product.price).toFixed(2)}</div>
      <Link href={`/products/${product._id}`}>details →</Link>
    </div>
  );
}
