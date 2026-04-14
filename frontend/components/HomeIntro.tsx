"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { authChangedEvent } from "@/lib/user-session";

export function HomeIntro() {
  const pathname = usePathname();
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    function go() {
      setOk(!!localStorage.getItem("token"));
    }
    go();
    window.addEventListener("storage", go);
    window.addEventListener(authChangedEvent, go);
    return () => {
      window.removeEventListener("storage", go);
      window.removeEventListener(authChangedEvent, go);
    };
  }, [pathname]);

  if (ok === null) {
    return <p style={{ color: "#555" }}>Browse stuff, add to cart, etc.</p>;
  }

  if (ok) {
    return (
      <p style={{ color: "#555" }}>
        You&apos;re logged in — cart/checkout/reports should work if the API is up.
      </p>
    );
  }

  return (
    <p style={{ color: "#555" }}>Log in if you want checkout + orders (JWT in localStorage).</p>
  );
}
