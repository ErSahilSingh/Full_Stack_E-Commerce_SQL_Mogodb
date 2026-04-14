import Link from "next/link";
import { HomeIntro } from "@/components/HomeIntro";
import { fetchProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types";

export default async function HomePage() {
  let items: Product[] = [];
  let busted = false;
  try {
    const result = await fetchProducts({ page: 1, limit: 8, search: "" });
    items = result.data.items;
  } catch {
    busted = true;
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Shop</h1>
      <HomeIntro />
      <h2 style={{ marginTop: 24, fontSize: 18 }}>Products</h2>
      {busted ? (
        <p style={{ color: "#a00" }}>Couldn&apos;t reach the API (backend running?)</p>
      ) : items.length === 0 ? (
        <p style={{ color: "#666" }}>
          Nothing here. <Link href="/products">all products</Link>
        </p>
      ) : (
        <>
          <div className="grid">
            {items.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
          <p style={{ marginTop: 16 }}>
            <Link href="/products">more…</Link>
          </p>
        </>
      )}
    </div>
  );
}
