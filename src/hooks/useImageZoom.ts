"use client";

import { useState, type MouseEvent } from "react";

// Hover-to-zoom effect for a product image: tracks cursor position within
// the image container and returns inline styles that pan/scale toward it.
export function useImageZoom() {
  const [zoomStyle, setZoomStyle] = useState<{ transformOrigin: string; transform: string }>({
    transformOrigin: "center",
    transform: "scale(1)",
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: "scale(2)" });
  };

  const handleMouseLeave = () => setZoomStyle({ transformOrigin: "center", transform: "scale(1)" });

  return { zoomStyle, handleMouseMove, handleMouseLeave };
}
