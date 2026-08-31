import { cn } from "@/lib/utils";

// ============================================================
// SECTION — o compasso vertical do site.
//
// Os três set-pieces (ciclo, telas, grafo) ficam fora deste compasso de
// propósito — é o contraste entre eles e o padrão que cria o ritmo.
// ============================================================

export default function Section({
  id,
  eyebrow,
  className,
  inner,
  children,
}: {
  id?: string;
  eyebrow?: string;
  className?: string;
  inner?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-28 px-6 py-24 md:px-10 md:py-36",
        className
      )}
    >
      <div className={cn("relative mx-auto w-full max-w-[1180px]", inner)}>
        {eyebrow && (
          <div className="relative mb-9">
            <p className="eyebrow relative flex items-center gap-3 text-blue">
              <span className="h-px w-8 bg-blue-lite/40" />
              {eyebrow}
            </p>
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

// Título de seção. Recebe as linhas separadas pra que a quebra seja uma
// decisão de design, não um acidente de largura de container.
export function SectionTitle({
  lines,
  className,
  id,
}: {
  lines: readonly string[];
  className?: string;
  id?: string;
}) {
  return (
    <h2
      id={id}
      className={cn(
        "display-tight relative text-[length:var(--text-giant)] text-fg",
        className
      )}
    >
      {lines.map((l, i) => (
        <span key={i} className="block">
          {l}
        </span>
      ))}
    </h2>
  );
}

// Cabeçalho de seção fora do <Section> (usado pelos set-pieces, que têm
// layout próprio mas precisam do mesmo eyebrow + numeral).
export function SectionEyebrow({
  children,
  className,
}: {
  num?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <p className="eyebrow relative flex items-center gap-3 text-blue">
        <span className="h-px w-8 bg-blue-lite/40" />
        {children}
      </p>
    </div>
  );
}
