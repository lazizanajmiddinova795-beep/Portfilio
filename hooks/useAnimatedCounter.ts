"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a number from 0 to `target` once triggered.
 * Call `trigger()` to start the animation.
 * Returns [count, trigger].
 */
export function useAnimatedCounter(
  target: number,
  duration = 1800
): [number, () => void] {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  const trigger = () => {
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return [count, trigger];
}
