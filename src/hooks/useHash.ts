// src/hooks/useHash.ts
"use client";

import { useEffect, useState } from "react";

let patched = false;

function patchHistoryOnce() {
  if (typeof window === "undefined") return;
  if (patched) return;
  patched = true;

  const fire = () => window.dispatchEvent(new Event("locationchange"));

  const _pushState = history.pushState;
  history.pushState = function (...args) {
    _pushState.apply(this, args);
    fire();
  };

  const _replaceState = history.replaceState;
  history.replaceState = function (...args) {
    _replaceState.apply(this, args);
    fire();
  };

  window.addEventListener("popstate", fire);
  window.addEventListener("hashchange", fire);
}

export function useHash() {
  const [hash, setHash] = useState<string>(() =>
    typeof window === "undefined" ? "" : window.location.hash || ""
  );

  useEffect(() => {
    patchHistoryOnce();

    const update = () => setHash(window.location.hash || "");

    update();
    window.addEventListener("locationchange", update);
    window.addEventListener("hashchange", update);

    return () => {
      window.removeEventListener("locationchange", update);
      window.removeEventListener("hashchange", update);
    };
  }, []);

  return hash; // includes leading "#", or ""
}
