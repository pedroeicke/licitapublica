import { Check, ShieldCheck } from "lucide-react";
import { content } from "@/content";
import Reveal from "@/components/motion/Reveal";
import StaggerReveal from "@/components/motion/StaggerReveal";
import Marquee from "@/components/ui/Marquee";
import { SectionEyebrow, SectionTitle } from "@/components/ui/Section";

// ============================================================
// SEGURANÇA E PRIVACIDADE — mergulho navy.
//
// Conteúdo trazido do site em produção. Tínhamos só as três linhas de
// defesa (governança); o setor de compras pergunta muito além disso —
// LGPD, isolamento, backup, DPO — e a resposta já existia escrita, só não
// estava aqui.
//
// É mergulho navy de propósito: seção de confiança sobre fundo escuro lê
// como cofre. E é aqui que as cores da logo entram como acento dentro do
// texto branco — verde nos selos de conformidade (estado "ok") e ouro nos
// títulos dos itens. É o jogo do material original do cliente: fundo azul,
// texto branco, verde e ouro pontuando.
// ============================================================

export default function SegurancaSection() {
  const { seguranca } = content;

  return (
    <section
      id="seguranca"
      aria-labelledby="seguranca-title"
      className="dive-navy relative scroll-mt-28 overflow-hidden rounded-[var(--lp-raio-navy)] px-6 py-16 md:px-10 md:py-24"
    >
      <div
        aria-hidden
        className="orb orb-a top-[-14%] right-[-8%] h-[52vh] w-[46vw] max-w-[700px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(91,155,255,0.4), transparent)",
          opacity: 0.7,
        }}
      />

      {/* A faixa de minutas é a PRIMEIRA LINHA deste bloco, não uma peça à
          parte. Solta acima da seção, com as duas arredondadas, virava uma
          pílula fina sobre outro bloco azul com um vão branco no meio.
          Aqui dentro ela encosta na borda de cima e o raio da seção a
          recorta: fica uma peça só. As margens negativas anulam o padding
          da seção pra ela sangrar de ponta a ponta. */}
      <div className="relative z-10 -mx-6 -mt-16 mb-16 bg-navy md:-mx-10 md:-mt-24 md:mb-24">
        <Marquee
          itens={content.governanca.marquee}
          duration={58}
          pontos="marca"
          className="border-t-0 text-white"
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1180px]">
        <SectionEyebrow className="mb-9">{seguranca.eyebrow}</SectionEyebrow>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <SectionTitle id="seguranca-title" lines={seguranca.titleLines} />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-[48ch] text-[15px] leading-relaxed text-muted">
              {seguranca.body}
            </p>
          </Reveal>
        </div>

        {/* selos de conformidade — verde é o "ok" */}
        <StaggerReveal
          className="mt-10 grid gap-3 md:grid-cols-3"
          stagger={0.06}
        >
          {seguranca.selos.map((s) => (
            <span
              key={s}
              className="flex h-full items-center justify-center gap-2 rounded-full border border-leaf/30 bg-leaf/[0.08] px-3.5 py-2 text-center text-[12.5px] text-fg"
            >
              <Check className="h-3.5 w-3.5 shrink-0 text-leaf" strokeWidth={3} />
              {s}
            </span>
          ))}
        </StaggerReveal>

        <StaggerReveal
          className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3"
          stagger={0.05}
        >
          {seguranca.itens.map((i) => (
            <article
              key={i.title}
              className="group h-full bg-navy-deep p-7 transition-colors duration-500 hover:bg-white/[0.03]"
            >
              <ShieldCheck
                className="h-5 w-5 text-gold/70 transition-colors duration-500 group-hover:text-gold"
                strokeWidth={1.75}
              />
              <h3 className="display-tight mt-5 text-[17px] text-gold">
                {i.title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">
                {i.desc}
              </p>
            </article>
          ))}
        </StaggerReveal>

        <Reveal delay={0.1}>
          <p className="mt-10 text-[14px] leading-relaxed text-muted">
            {seguranca.nota}{" "}
            <a
              href="#"
              className="text-leaf underline decoration-leaf/40 underline-offset-4 transition-colors hover:decoration-leaf"
            >
              {seguranca.politica}
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
