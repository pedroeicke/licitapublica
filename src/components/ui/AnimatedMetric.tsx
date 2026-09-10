"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function AnimatedMetric({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const final = Number(value.replace(/[^\d]/g, ""));
    const prefix = value.startsWith("+") ? "+" : "";
    const counter = { value: 0 };
    gsap.to(counter, {
      value: final,
      duration: 1.4,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
      onUpdate: () => { el.textContent = `${prefix}${Math.round(counter.value)}`; },
    });
  }, { scope: ref });

  return <><span className="sr-only">{value}</span><span ref={ref} aria-hidden="true">{value}</span></>;
}
