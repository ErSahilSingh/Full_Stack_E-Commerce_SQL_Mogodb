import Link from "next/link";
import { fetchProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

type Props = {
  searchParams: { page?: string; search?: string };
};

export default async function ProductsPage({ searchParams }: Props) {
  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);
  const search = searchParams.search || "";
  const result = await fetchProducts({ page, limit: 10, search });
  const data = result.data;
  const totalPages = Math.max(1, Math.ceil(data.total / data.limit));
  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  const qs = (p: number) => {
    const params = new URLSearchParams();
    params.set("page", String(p));
    if (search) {
      params.set("search", search);
    }
    return params.toString();
  };

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>products</h1>
      <form method="get" className="row" style={{ marginBottom: 12 }}>
        <input type="hidden" name="page" value="1" />
        <input
          name="search"
          placeholder="name / category"
          defaultValue={search}
          style={{ minWidth: 220 }}
        />
        <button type="submit">go</button>
      </form>
      <div className="grid">
        {data.items.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
      <div className="row" style={{ marginTop: 20, justifyContent: "space-between" }}>
        <div style={{ color: "#666", fontSize: 14 }}>
          p{data.page}/{totalPages} · {data.total} total
        </div>
        <div className="row">
          <Link
            href={`/products?${qs(prevPage)}`}
            aria-disabled={page <= 1}
            style={{ pointerEvents: page <= 1 ? "none" : "auto", opacity: page <= 1 ? 0.4 : 1 }}
          >
            Previous
          </Link>
          <Link
            href={`/products?${qs(nextPage)}`}
            style={{
              pointerEvents: page >= totalPages ? "none" : "auto",
              opacity: page >= totalPages ? 0.4 : 1,
            }}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
