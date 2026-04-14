"use client";

import {
  fetchCategorySales,
  fetchDailyRevenue,
  fetchTopSpenders,
} from "@/lib/api";
import type { CategorySalesRow, DailyRevenueRow, TopSpenderRow } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReportsPage() {
  const router = useRouter();
  const [daily, setDaily] = useState<DailyRevenueRow[]>([]);
  const [spenders, setSpenders] = useState<TopSpenderRow[]>([]);
  const [categories, setCategories] = useState<CategorySalesRow[]>([]);
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
        const [d, s, c] = await Promise.all([
          fetchDailyRevenue(),
          fetchTopSpenders(),
          fetchCategorySales(),
        ]);
        setDaily(d.data);
        setSpenders(s.data);
        setCategories(c.data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [router]);

  if (loading) {
    return <p>Loading reports…</p>;
  }

  if (error) {
    return <p style={{ color: "#b91c1c" }}>{error}</p>;
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Reports</h1>

      <h2>Daily revenue (last 7 days)</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {daily.map((row) => (
            <tr key={String(row.day)}>
              <td>{String(row.day)}</td>
              <td>${Number(row.revenue).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Top spenders</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Total spent</th>
          </tr>
        </thead>
        <tbody>
          {spenders.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.email}</td>
              <td>${Number(row.total_spent).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Category sales (MongoDB)</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Quantity</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((row) => (
            <tr key={row._id}>
              <td>{row._id}</td>
              <td>{row.totalQuantity}</td>
              <td>${Number(row.totalRevenue).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
