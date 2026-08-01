"use client";

import { useEffect, useRef } from "react";

/**
 * Premium custom cursor with a dot + trailing ring.
 * The ring follows with spring-like lag via RAF.
 * Hidden automatically on touch-only devices via CSS.
 */
export default function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    };

    const onMouseEnterInteractive = () => {
      ring.classList.add("cursor-hover");
      dot.classList.add("cursor-hover");
    };

    const onMouseLeaveInteractive = () => {
      ring.classList.remove("cursor-hover");
      dot.classList.remove("cursor-hover");
    };

    const addInteractiveListeners = () => {
      document
        .querySelectorAll(
          "a, button, [role='button'], input, textarea, select, label[for]"
        )
        .forEach((el) => {
          el.addEventListener("mouseenter", onMouseEnterInteractive);
          el.addEventListener("mouseleave", onMouseLeaveInteractive);
        });
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);
    addInteractiveListeners();

    const observer = new MutationObserver(addInteractiveListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={cursorDotRef}
        className="cursor-dot fixed top-0 left-0 w-2 h-2 rounded-full bg-green-500 pointer-events-none z-[9999] will-change-transform"
        aria-hidden="true"
      />
      <div
        ref={cursorRingRef}
        className="cursor-ring fixed top-0 left-0 w-10 h-10 rounded-full border-2 border-green-400/60 pointer-events-none z-[9998] will-change-transform"
        aria-hidden="true"
      />
    </>
  );
}
