"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function useAnimatedCounter(
  target: number,
  duration = 2000,
  start = 0
): number {
  const [count, setCount] = useState(start);
  const ref = useRef<HTMLSpanElement | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const animate = (timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    setCount(Math.round(start + (target - start) * eased));
    if (progress < 1) {
      rafRef.current = requestAnimationFrame(animate);
    }
  };

  const startAnimation = () => {
    startTimeRef.current = null;
    rafRef.current = requestAnimationFrame(animate);
  };

  return count;
}
