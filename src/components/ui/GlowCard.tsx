"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// ============================================================
// GLOW CARD — a luz azul segue o ponteiro pela borda do card.
//
// O efeito inteiro é CSS (classe .glow em globals.css). Este componente só
// escreve --mx/--my no elemento a cada pointermove.
//
// Por que escrever custom property e não animar via React state: state
// re-renderizaria o componente ~60×/s. Custom property vai direto no
// `style` do nó, o CSS reavalia o gradiente e a composição acontece na
// GPU — zero trabalho de React, zero reconciliação.
//
// Sem ponteiro (touch) nada acontece: o card fica no estado base, que já é
// legível por si.
// ============================================================

export default function GlowCard({
  children,
  className,
  as: Tag = "div",
  materia = true,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
  /** Aplica a matéria padrão (.card). Desligue quando o card já tem fundo
   *  próprio — em Módulos, por exemplo, o fundo é navy com poça de luz e
   *  o `.card` claro por baixo brigaria com ele. */
  materia?: boolean;
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <Tag
      ref={ref as never}
      onPointerMove={onMove}
      className={cn(materia && "card", "glow", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
