"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { content } from "@/content";
import Wordmark from "@/components/ui/Wordmark";
import { cn } from "@/lib/utils";

// ============================================================
// HEADER — pill flutuante de vidro.
//
// Três correções em relação ao site do cliente:
//  1. A nav lá trocava de tema (nav-dark) conforme o fundo. Aqui a pill é
//     SEMPRE vidro navy: o site alterna branco e navy o tempo todo, e um
//     header que troca de tema a cada seção pisca no meio da transição.
//     Navy sobre branco tem contraste de sobra, e sobre navy o blur e a
//     borda o destacam. Uma peça, um estado.
//  2. Scroll-spy real (IntersectionObserver): o link ativo acompanha a
//     seção. No original os links eram inertes.
//  3. Menu de fato no mobile. Esconder os seis links atrás de nada e
//     deixar só o CTA é comum, mas aqui as seções SÃO o argumento de
//     venda — o comprador público quer pular direto pra "Preços" ou
//     "Governança".
// ============================================================

export default function Header() {
  const { nav } = content;
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [aberto, setAberto] = useState(false);
  const desktopNav = useRef<HTMLElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);

  const destacar = (link: HTMLAnchorElement | null) => {
    const marker = indicator.current;
    if (!marker) return;
    marker.style.opacity = link ? "1" : "0";
    if (!link) return;
    marker.style.transform = `translateX(${link.offsetLeft}px)`;
    marker.style.width = `${link.offsetWidth}px`;
  };

  const restaurarDestaque = () => {
    destacar(desktopNav.current?.querySelector<HTMLAnchorElement>('a[aria-current="true"]') ?? null);
  };

  useEffect(() => {
    const navElement = desktopNav.current;
    if (!navElement) return;
    const atualizar = () => {
      const focused = navElement.querySelector<HTMLAnchorElement>("a:focus-visible");
      const hovered = navElement.querySelector<HTMLAnchorElement>("a:hover");
      destacar(focused ?? hovered ?? navElement.querySelector<HTMLAnchorElement>('a[aria-current="true"]'));
    };
    atualizar();
    const observer = new ResizeObserver(atualizar);
    observer.observe(navElement);
    return () => observer.disconnect();
  }, [active]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-3.5 z-[60] mx-auto w-fit transition-[background,border-color,box-shadow] duration-500",
          "flex max-w-[94vw] items-center gap-1 rounded-full border py-1.5 pr-1.5 pl-3 md:py-2.5 md:pr-2.5 md:pl-4",
          "border-white/25 bg-navy/70 backdrop-blur-2xl backdrop-saturate-150",
          scrolled
            ? "shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_20px_50px_-18px_rgba(13,20,60,.55)]"
            : "shadow-[inset_0_1px_0_rgba(255,255,255,.1),0_10px_30px_-16px_rgba(13,20,60,.4)]",
        )}
      >
        <a
          href="#topo"
          className="shrink-0 pr-2 text-white"
          aria-label="Licita Pública — início"
        >
          <Wordmark variante="branca" className="h-[18px] md:h-6" />
        </a>

        <nav
          ref={desktopNav}
          className="relative hidden shrink-0 items-center gap-0.5 md:flex"
          aria-label="Seções"
          onMouseLeave={restaurarDestaque}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) restaurarDestaque();
          }}
        >
          <span
            ref={indicator}
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 rounded-full border border-white/20 bg-white/15 opacity-0 shadow-[inset_0_1px_0_rgba(255,255,255,.22),0_3px_12px_rgba(0,0,0,.08)] backdrop-blur-md transition-[transform,width,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          />
          {nav.links.map((l) => {
            const on = active === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                onMouseEnter={(event) => destacar(event.currentTarget)}
                onFocus={(event) => destacar(event.currentTarget)}
                aria-current={on ? "true" : undefined}
                className={cn(
                  "relative z-10 rounded-full px-2.5 py-2 text-[12.5px] font-medium whitespace-nowrap transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                  on
                    ? "text-white"
                    : "text-white/75 hover:text-white focus-visible:text-white",
                )}
              >
                {l.label}
              </a>
            );
          })}
        </nav>

        <a
          href={nav.entrar.href}
          className="ml-1.5 hidden shrink-0 rounded-full px-3 py-2 text-[12.5px] font-medium whitespace-nowrap text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:block"
        >
          {nav.entrar.label}
        </a>

        <a href="#demo" className="cta cta--sm ml-1 shrink-0">
          {nav.cta}
        </a>

        <button
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-controls="menu-mobile"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          className="ml-0.5 grid h-9 w-9 shrink-0 place-items-center md:h-10 md:w-10 rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white md:hidden"
        >
          {aberto ? (
            <X className="h-5 w-5" strokeWidth={2} />
          ) : (
            <Menu className="h-5 w-5" strokeWidth={2} />
          )}
        </button>
      </header>

      {/* PAINEL MOBILE — folha de vidro sob a pill */}
      <div
        id="menu-mobile"
        hidden={!aberto}
        className="dive-navy fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-navy-deep/96 px-6 pt-24 pb-12 backdrop-blur-xl md:hidden"
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
        <a
          href="#demo"
          onClick={() => setAberto(false)}
          className="cta mt-8 w-full"
        >
          {nav.cta}
        </a>
        <a
          href={nav.entrar.href}
          className="cta-ghost mt-3 w-full"
        >
          {nav.entrar.label}
        </a>
      </div>
    </>
  );
}
