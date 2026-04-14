"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  authChangedEvent,
  clearStoredUser,
  pingAuthChanged,
  resolveDisplayUser,
  type StoredUser,
} from "@/lib/user-session";

export function Navbar() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [me, setMe] = useState<StoredUser | null>(null);

  useEffect(() => {
    function refresh() {
      setLoggedIn(!!localStorage.getItem("token"));
      setMe(resolveDisplayUser());
    }
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener(authChangedEvent, refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(authChangedEvent, refresh);
    };
  }, [pathname]);

  function logout() {
    localStorage.removeItem("token");
    clearStoredUser();
    setLoggedIn(false);
    setMe(null);
    pingAuthChanged();
    window.location.href = "/products";
  }

  return (
    <header
      style={{
        borderBottom: "1px solid #ccc",
        background: "#fafafa",
        padding: "10px 12px",
      }}
    >
      <div
        className="row"
        style={{ maxWidth: 960, margin: "0 auto", justifyContent: "space-between" }}
      >
        <nav className="row" style={{ gap: 14 }}>
          <Link href="/">home</Link>
          <Link href="/products">products</Link>
          <Link href="/cart">cart</Link>
          <Link href="/checkout">checkout</Link>
          <Link href="/orders">orders</Link>
          <Link href="/reports">reports</Link>
        </nav>
        <div className="row">
          {loggedIn ? (
            <>
              {me ? (
                <span style={{ fontSize: 14, color: "#333" }}>{me.name}</span>
              ) : null}
              <button type="button" onClick={logout}>
                log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login">login</Link>
              <Link href="/register">register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
