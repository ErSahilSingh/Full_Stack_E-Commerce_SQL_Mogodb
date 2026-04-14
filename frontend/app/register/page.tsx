"use client";

import { registerRequest } from "@/lib/api";
import { pingAuthChanged, setStoredUser } from "@/lib/user-session";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await registerRequest({ name, email, password });
      localStorage.setItem("token", res.data.token);
      setStoredUser(res.data.user);
      pingAuthChanged();
      router.push("/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 420 }}>
      <h1 style={{ marginTop: 0 }}>register</h1>
      <form onSubmit={submit} className="card">
        <div style={{ display: "grid", gap: 10 }}>
          <label style={{ display: "grid", gap: 6 }}>
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              required
            />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </label>
        </div>
        {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
        <div className="row" style={{ marginTop: 12 }}>
          <button type="submit" disabled={busy}>
            Create account
          </button>
          <Link href="/login">Already have an account</Link>
        </div>
      </form>
    </div>
  );
}
