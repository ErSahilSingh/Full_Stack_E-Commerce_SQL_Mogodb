"use client";

import { addCartItemRequest, removeCartItemRequest } from "@/lib/api";
import type { CartItem as CartItemType } from "@/types";
import { useState } from "react";

type Props = {
  item: CartItemType;
  onChanged: () => void;
};

export function CartItem({ item, onChanged }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addOne = async () => {
    setBusy(true);
    setError(null);
    try {
      await addCartItemRequest({ productId: item.productId, quantity: 1 });
      await onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  };

  const removeOne = async () => {
    setBusy(true);
    setError(null);
    try {
      await removeCartItemRequest(item.productId);
      if (item.quantity > 1) {
        await addCartItemRequest({
          productId: item.productId,
          quantity: item.quantity - 1,
        });
      }
      await onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  };

  const removeAll = async () => {
    setBusy(true);
    setError(null);
    try {
      await removeCartItemRequest(item.productId);
      await onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 600 }}>{item.name}</div>
          <div style={{ color: "#64748b", fontSize: 14 }}>
            ${Number(item.price).toFixed(2)} each
          </div>
        </div>
        <div className="row">
          <button type="button" disabled={busy} onClick={removeOne}>
            −
          </button>
          <span>{item.quantity}</span>
          <button type="button" disabled={busy} onClick={addOne}>
            +
          </button>
          <button type="button" disabled={busy} onClick={removeAll}>
            Remove
          </button>
        </div>
      </div>
      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
    </div>
  );
}
