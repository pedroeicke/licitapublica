import {
  Check,
  ClipboardCheck,
  ScrollText,
  ShieldCheck,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { content } from "@/content";
import Reveal from "@/components/motion/Reveal";
import GlowCard from "@/components/ui/GlowCard";
import Marquee from "@/components/ui/Marquee";
import Section, { SectionTitle } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

// ============================================================
// GOVERNANÇA — as três linhas de defesa.
//
// ANATOMIA DO CARD (duas zonas)
// Antes cada card era só texto: pill numerada, título, parágrafo. Três
// blocos de texto lado a lado, e o leitor não tinha o que OLHAR — só o que
// ler. Agora cada card tem duas zonas:
//
//   ┌──────────────────────┐
//   │ [◇ 1ª LINHA]         │  zona de texto, padding generoso
//   │ Título               │
//   │ Descrição            │
//   ├──────────────────────┤
//   │  demonstração        │  zona visual, SEM padding,
//   │  sangrando pra fora  │  cortada pelas bordas do card
//   └──────────────────────┘
//
// O sangramento é o que importa: um painel inteiro dentro do card lê como
// ícone grande. Um painel cortado pela borda lê como "isto continua" — a
// mesma lógica do palco do hero, na escala do card.
//
// A pill de categoria acrescenta um degrau de hierarquia antes do título,
// e é ela que carrega a numeração — a sequência revisão → controle →
// auditoria fica explícita sem precisar de uma frase pra dizer isso.
//
// OS VISUAIS NÃO SÃO SCREENSHOTS. São representações abstratas montadas a
// partir do que a própria descrição de cada linha promete: checklist da
// Lei 14.133, apontamentos por criticidade, trilha com hora e autor. Nada
// de nome de servidor inventado — os autores são papéis.
// ============================================================

type Linha = (typeof content)["governanca"]["linhas"][number];

const ICONES: LucideIcon[] = [ClipboardCheck, ShieldCheck, ScrollText];

// Quantas barras o medidor acende por nível. Antes ele derivava do índice
// da lista, o que quebrava assim que dois itens tinham o mesmo nível.
const BARRAS: Record<string, number> = { Alta: 3, Média: 2, Baixa: 1 };

/** Moldura comum das demonstrações: sangra pela direita e pela base. */
function Painel({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="absolute top-6 -right-5 left-6 rounded-xl border border-line bg-white p-4 shadow-[0_18px_40px_-26px_rgba(13,20,60,0.4)]">
      <p className="data text-[9.5px] tracking-[0.16em] text-faint uppercase">
        {titulo}
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Visual({ linha }: { linha: Linha }) {
  const v = linha.visual;

  if (v.tipo === "checklist") {
    return (
      <Painel titulo={v.titulo}>
        <ul className="space-y-1.5">
          {v.itens.map((it) => (
            <li
              key={it.rotulo}
              className="flex items-center justify-between gap-3 rounded-lg border border-line px-3 py-2"
            >
              <span className="data text-[11px] font-medium text-fg">
                {it.rotulo}
              </span>
              <span
                className={cn(
                  "data flex shrink-0 items-center gap-1.5 text-[9.5px]",
                  it.ok ? "text-blue" : "text-muted"
                )}
              >
                {it.ok ? (
                  <Check className="h-3 w-3" strokeWidth={3} />
                ) : (
                  <TriangleAlert className="h-3 w-3" strokeWidth={2.5} />
                )}
                {it.estado}
              </span>
            </li>
          ))}
        </ul>
      </Painel>
    );
  }

  if (v.tipo === "criticidade") {
    return (
      <Painel titulo={v.titulo}>
        <ul className="space-y-2.5">
          {v.itens.map((it) => (
            <li key={it.rotulo} className="flex items-center gap-3">
              {/* Medidor de 3 barras em vez de vermelho/amarelo/verde: a
                  regra da paleta é azul e branco, e uma escala monocromática
                  comunica gradação igual — às vezes melhor. */}
              <span className="flex shrink-0 gap-0.5">
                {[0, 1, 2].map((b) => (
                  <span
                    key={b}
                    className={cn(
                      "h-3 w-1 rounded-[1px]",
                      b < (BARRAS[it.nivel] ?? 1) ? "bg-blue" : "bg-navy/12"
                    )}
                  />
                ))}
              </span>
              <span className="flex-1 truncate text-[11.5px] text-fg">
                {it.rotulo}
              </span>
              <span className="data shrink-0 rounded-md border border-line px-1.5 py-0.5 text-[9.5px] text-muted">
                {it.nivel}
              </span>
            </li>
          ))}
        </ul>
      </Painel>
    );
  }

  return (
    <Painel titulo={v.titulo}>
      <ul className="relative space-y-3 pl-4">
        {/* fio vertical ligando os registros: é o que faz ler como trilha,
            e não como três linhas soltas */}
        <span
          aria-hidden
          className="absolute top-1.5 bottom-1.5 left-[3px] w-px bg-line"
        />
        {v.itens.map((it) => (
          <li key={it.hora} className="relative flex items-baseline gap-2.5">
            <span
              aria-hidden
              className="absolute top-1.5 -left-4 h-[7px] w-[7px] rounded-full border-2 border-white bg-blue"
            />
            <span className="data shrink-0 text-[10px] text-muted">
              {it.hora}
            </span>
            <span className="data shrink-0 text-[10px] text-blue">
              {it.autor}
            </span>
            <span className="truncate text-[11px] text-fg">{it.acao}</span>
          </li>
        ))}
      </ul>
    </Painel>
  );
}

export default function GovernancaSection() {
  const { governanca } = content;

  return (
    <>
      <Section id="governanca" eyebrow={governanca.eyebrow}>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <SectionTitle
              id="governanca-title"
              lines={governanca.titleLines}
              className="max-w-[18ch]"
            />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-[46ch] text-[15px] leading-relaxed text-muted">
              {governanca.body}
            </p>
          </Reveal>
        </div>

        <ol className="mt-14 grid gap-4 md:grid-cols-3">
          {governanca.linhas.map((l, i) => {
            const Icone = ICONES[i] ?? ClipboardCheck;
            return (
              <Reveal key={l.n} delay={0.09 * i} as="li">
                <GlowCard className="card-lift group flex h-full flex-col overflow-hidden">
                  {/* ---- zona de texto ---- */}
                  <div className="p-7 md:p-8">
                    <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5">
                      <Icone
                        className="h-3.5 w-3.5 shrink-0 text-blue"
                        strokeWidth={2}
                      />
                      <span className="data text-[9.5px] tracking-[0.16em] text-muted uppercase">
                        {l.n} linha de defesa
                      </span>
                    </span>

                    <h3 className="display-tight mt-6 text-xl text-fg">
                      {l.title}
                    </h3>
                    <p className="mt-3 text-[14.5px] leading-relaxed text-muted">
                      {l.desc}
                    </p>
                  </div>

                  {/* ---- zona visual ----
                      mt-auto encosta na base mesmo quando o texto acima é
                      mais curto: as três demonstrações ficam alinhadas
                      entre si, que é o que faz a fileira ler como uma peça
                      só em vez de três cards independentes. */}
                  <div className="relative mt-auto h-[186px] overflow-hidden border-t border-line bg-paper-2/70">
                    <Visual linha={l} />
                  </div>
                </GlowCard>
              </Reveal>
            );
          })}
        </ol>
      </Section>

      <div className="text-leaf/80">
        <Marquee itens={governanca.marquee} duration={58} />
      </div>
    </>
  );
}
