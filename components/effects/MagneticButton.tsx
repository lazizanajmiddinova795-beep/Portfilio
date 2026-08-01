"use client";

import { useRef, useEffect, forwardRef } from "react";
import type { ReactNode } from "react";

interface MagneticButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  strength?: number;
  as?: "button";
}

/**
 * A button with a subtle magnetic hover effect.
 * The element shifts slightly toward the cursor on hover.
 * Disabled automatically on touch-only devices.
 */
const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  function MagneticButton(
    { children, className = "", strength = 0.35, as: _as, ...rest },
    forwardedRef
  ) {
    const internalRef = useRef<HTMLButtonElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLButtonElement>) ?? internalRef;

    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      // Disable on touch-only devices
      if (window.matchMedia("(hover: none)").matches) return;

      const onMouseMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * strength;
        const dy = (e.clientY - cy) * strength;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      };

      const onMouseLeave = () => {
        el.style.transform = "translate(0px, 0px)";
        el.style.transition = "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)";
      };

      const onMouseEnter = () => {
        el.style.transition = "transform 0.1s linear";
      };

      el.addEventListener("mousemove", onMouseMove);
      el.addEventListener("mouseleave", onMouseLeave);
      el.addEventListener("mouseenter", onMouseEnter);

      return () => {
        el.removeEventListener("mousemove", onMouseMove);
        el.removeEventListener("mouseleave", onMouseLeave);
        el.removeEventListener("mouseenter", onMouseEnter);
      };
    }, [strength, ref]);

    return (
      <button ref={ref} className={className} {...rest}>
        {children}
      </button>
    );
  }
);

MagneticButton.displayName = "MagneticButton";

export default MagneticButton;
