"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

// Texto revelado palavra a palavra, blur -> nítido, dirigido pelo scroll.
// Usado só nos parágrafos-tese: se aplicar em todo corpo de texto o site
// vira exibição de efeito e a leitura sofre.
export default function SplitReveal({
  text,
  className,
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  as?: "p" | "h2" | "h3";
}) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const els = gsap.utils.toArray<HTMLElement>(".sr-w");
      gsap.set(els, { opacity: 0.16, filter: "blur(6px)" });
      gsap.to(els, {
        opacity: 1,
        filter: "blur(0px)",
        ease: "none",
        stagger: 0.4,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          end: "bottom 68%",
          scrub: 0.5,
        },
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref as never} className={cn(className)}>
      {words.map((w, i) => (
        <span key={i} className="sr-w inline-block whitespace-pre">
          {w}{" "}
        </span>
      ))}
    </Tag>
  );
}
