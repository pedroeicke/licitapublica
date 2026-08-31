import { content } from "@/content";
import Reveal from "@/components/motion/Reveal";
import StaggerReveal from "@/components/motion/StaggerReveal";
import GlowCard from "@/components/ui/GlowCard";
import Section, { SectionTitle } from "@/components/ui/Section";

// ============================================================
// PARA QUEM — conteúdo trazido do site em produção
// (licitapublica.com.br), que aqui faltava.
//
// O material do cliente descrevia bem O QUE o produto faz, mas nunca dizia
// a QUEM cada parte serve. Num órgão a compra passa por três mesas — quem
// pede, quem monta e quem revisa — e cada uma precisa se reconhecer antes
// de defender a contratação internamente.
//
// Por isso os chips de etapa em cada card: eles amarram o perfil às peças
// do ciclo que já foram apresentadas antes na página, em vez de deixar os
// três como descrições soltas de cargo.
// ============================================================

export default function ParaQuemSection() {
  const { paraQuem } = content;

  return (
    <Section id="para-quem" eyebrow={paraQuem.eyebrow}>
      <Reveal>
        <SectionTitle
          id="para-quem-title"
          lines={paraQuem.titleLines}
          className="max-w-[20ch]"
        />
      </Reveal>

      <StaggerReveal
        className="mt-14 grid gap-4 md:grid-cols-3"
        stagger={0.09}
      >
        {paraQuem.perfis.map((p) => (
          <GlowCard key={p.title} as="article" className="card-lift p-7 md:p-8">
            <h3 className="display-tight min-h-[2.4em] text-[19px] text-fg">
              {p.title}
            </h3>
            <p className="mt-3.5 text-[14.5px] leading-relaxed text-muted">
              {p.desc}
            </p>
            <div className="mt-7 flex flex-wrap gap-1.5 border-t border-line pt-5">
              {p.etapas.map((e) => (
                <span
                  key={e}
                  className="data rounded-md bg-paper-2 px-2 py-1 text-[10.5px] text-muted"
                >
                  {e}
                </span>
              ))}
            </div>
          </GlowCard>
        ))}
      </StaggerReveal>
    </Section>
  );
}
