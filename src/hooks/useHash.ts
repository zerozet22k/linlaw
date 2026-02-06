// src/hooks/useHash.ts
"use client";

import { useEffect, useState } from "react";

const EVENT = "locationchange";

function patchHistoryOnce() {
  if (typeof window === "undefined") return;

  const w = window as unknown as { __hashHistoryPatched?: boolean };
  if (w.__hashHistoryPatched) return;
  w.__hashHistoryPatched = true;

  const fireAsync = () => {
    setTimeout(() => window.dispatchEvent(new Event(EVENT)), 0);
  };

  const _pushState = history.pushState;
  history.pushState = function (...args) {
    const ret = _pushState.apply(this, args as any);
    fireAsync();
    return ret;
  };

  const _replaceState = history.replaceState;
  history.replaceState = function (...args) {
    const ret = _replaceState.apply(this, args as any);
    fireAsync();
    return ret;
  };
}

export function useHash() {
  const [hash, setHash] = useState<string>(() =>
    typeof window === "undefined" ? "" : window.location.hash || ""
  );

  useEffect(() => {
    patchHistoryOnce();

    const update = () => {
      const next = window.location.hash || "";
      setHash((prev) => (prev === next ? prev : next));
    };

    update();

    window.addEventListener(EVENT, update);
    window.addEventListener("hashchange", update);
    window.addEventListener("popstate", update);

    return () => {
      window.removeEventListener(EVENT, update);
      window.removeEventListener("hashchange", update);
      window.removeEventListener("popstate", update);
    };
  }, []);

  return hash;
}
