"use client";

import { useRef, type ReactNode, type ElementType } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

// Reveal padrão. immediateRender:true aplica o estado "from" já no mount,
// então o elemento nunca é visto antes do trigger. Sem JS o "from" nunca
// roda e o conteúdo fica visível — o site continua legível.
export default function Reveal({
  children,
  as = "div",
  className,
  y = 48,
  delay = 0,
  blur = false,
  start = "top 84%",
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  y?: number;
  delay?: number;
  blur?: boolean;
  start?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ref.current,
        { autoAlpha: 0, y, filter: blur ? "blur(12px)" : "blur(0px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.05,
          delay,
          ease: "expo.out",
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
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
