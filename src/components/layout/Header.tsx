"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { content } from "@/content";
import Wordmark from "@/components/ui/Wordmark";
import { cn } from "@/lib/utils";

// ============================================================
// HEADER — no formato do header da Legora, a página inteira.
//
// Duas faixas fixas no topo: a de anúncio (44px, navy) e a barra do menu
// (72px) com os links à esquerda, a marca no centro e Entrar + o botão em
// pílula à direita. Sobre o filme do hero a barra é transparente com texto
// branco; passado o hero ela fica clara (#FAFAF9) com texto navy — é o
// mesmo comportamento da Legora, que troca a variante "Transparent" pela
// sólida e mantém a faixa de anúncio em cima.
//
// Mantidos do header anterior: o scroll-spy (o link da seção visível fica
// em destaque) e o menu de verdade no mobile, porque as seções são o
// argumento de venda e o comprador público quer pular direto pra elas.
// ============================================================

export default function Header() {
  const { nav } = content;
  const [active, setActive] = useState<string>("");
  // Enquanto o filme do hero está na tela a barra é transparente.
  const [noHero, setNoHero] = useState(true);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const onScroll = () => setNoHero(window.scrollY < window.innerHeight - 116);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = nav.links.map((l) => l.href.slice(1));
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // A seção que ocupa a maior fatia da janela vence. Só "topo cruzou"
        // erra feio em seções pinadas (o ciclo horizontal fica minutos na
        // tela sem disparar nada novo).
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [nav.links]);

  // Fecha o menu no Esc — o painel cobre a tela inteira no mobile e ficar
  // preso nele sem botão à mão é o jeito mais rápido de perder a visita.
  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aberto]);

  // Com o menu aberto o painel é navy: a barra volta ao tema escuro.
  const claro = !noHero && !aberto;

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60]">
        <a
          href={nav.anuncio.href}
          className="flex h-11 items-center justify-center gap-2 overflow-hidden bg-navy px-4 text-[12px] whitespace-nowrap text-white transition-colors hover:bg-navy-2"
        >
          <span className="truncate font-medium">{nav.anuncio.texto}</span>
          <span className="shrink-0 text-white/70">
            <span className="hidden sm:inline">{nav.anuncio.link} </span>→
          </span>
        </a>

        <div
          className={cn(
            "relative flex h-[60px] items-center px-4 transition-colors duration-300 md:h-[72px] md:px-[30px]",
            claro ? "bg-[#FAFAF9] text-navy" : "bg-transparent text-white",
          )}
        >
          <nav aria-label="Seções" className="hidden items-center gap-1 xl:flex">
            {nav.links.map((l) => {
              const on = active === l.href.slice(1);
              return (
                <a
                  key={l.href}
                  href={l.href}
                  aria-current={on ? "true" : undefined}
                  className={cn(
                    "rounded-t-2xl px-[15px] py-[7px] text-[13px] whitespace-nowrap transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
                    on ? "opacity-100" : "opacity-80 hover:opacity-100",
                  )}
                >
                  {l.label}
                </a>
              );
            })}
          </nav>

          <a href="#topo" aria-label="Licita Pública, início" className="absolute left-1/2 -translate-x-1/2">
            <Wordmark variante={claro ? "cor" : "branca"} className="h-[22px] md:h-[26px]" />
          </a>

          <div className="ml-auto flex items-center gap-2">
            <a
              href={nav.entrar.href}
              className="hidden px-[15px] py-[7px] text-[13px] whitespace-nowrap opacity-80 transition-opacity hover:opacity-100 sm:block"
            >
              {nav.entrar.label}
            </a>
            <a
              href="#demo"
              className={cn(
                "group hidden h-[30px] items-center gap-2 rounded-full pr-[5px] pl-[14px] text-[13px] whitespace-nowrap text-white transition-colors sm:inline-flex",
                claro ? "bg-navy hover:bg-navy-2" : "bg-navy-2 hover:bg-navy",
              )}
            >
              {nav.cta}
              <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-navy transition-transform duration-300 group-hover:translate-x-0.5">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.25} aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </a>
            <button
              onClick={() => setAberto((v) => !v)}
              aria-expanded={aberto}
              aria-controls="menu-mobile"
              aria-label={aberto ? "Fechar menu" : "Abrir menu"}
              className={cn(
                "grid h-9 w-9 place-items-center rounded-full transition-colors xl:hidden",
                claro ? "hover:bg-navy/5" : "hover:bg-white/10",
              )}
            >
              {aberto ? <X className="h-5 w-5" strokeWidth={2} /> : <Menu className="h-5 w-5" strokeWidth={2} />}
            </button>
          </div>
        </div>
      </div>

      {/* PAINEL MOBILE — cobre a tela sob as duas faixas */}
      <div
        id="menu-mobile"
        hidden={!aberto}
        className="dive-navy fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-navy-deep/96 px-6 pt-[124px] pb-12 backdrop-blur-xl md:pt-[136px] xl:hidden"
      >
        <nav aria-label="Seções" className="flex flex-col">
          {nav.links.map((l) => {
            const on = active === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setAberto(false)}
                aria-current={on ? "true" : undefined}
                className={cn(
                  "display-tight border-b border-line py-5 text-2xl transition-colors",
                  on ? "text-blue" : "text-fg",
                )}
              >
                {l.label}
              </a>
            );
          })}
        </nav>
        <a href="#demo" onClick={() => setAberto(false)} className="cta mt-8 w-full">
          {nav.cta}
        </a>
        <a href={nav.entrar.href} className="cta-ghost mt-3 w-full">
          {nav.entrar.label}
        </a>
      </div>
    </>
  );
}
