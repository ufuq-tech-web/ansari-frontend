"use client";

import { useEffect } from "react";

// Locks the page's own scroll while `locked` is true — stops the background
// from scrolling behind an open mobile drawer/modal.
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [locked]);
}
