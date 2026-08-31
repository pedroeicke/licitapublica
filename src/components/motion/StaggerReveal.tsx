"use client";

import { useRef, type ReactNode, type ElementType } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Anima os FILHOS DIRETOS em sequência (não o bloco inteiro).
export default function StaggerReveal({
  children,
  stagger = 0.07,
  y = 22,
  blur = true,
  start = "top 84%",
  className,
  as = "div",
}: {
  children: ReactNode;
  stagger?: number;
  y?: number;
  blur?: boolean;
  start?: string;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const targets = gsap.utils.toArray<HTMLElement>(
        Array.from(ref.current.children)
      );
      if (!targets.length) return;

      gsap.fromTo(
        targets,
        { autoAlpha: 0, y, filter: blur ? "blur(8px)" : "blur(0px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          ease: "expo.out",
          stagger,
          immediateRender: true,
          overwrite: "auto",
          scrollTrigger: { trigger: ref.current, start, once: true },
        }
      );
    },
    { scope: ref }
  );

  const Tag = as;
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
