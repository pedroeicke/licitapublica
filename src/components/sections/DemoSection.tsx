"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { content } from "@/content";
import Reveal from "@/components/motion/Reveal";
import { SectionEyebrow, SectionTitle } from "@/components/ui/Section";

// ============================================================
// DEMONSTRAÇÃO — a conversão.
//
// Cinco campos, um por linha em mobile e dois por linha no desktop. O
// original empilhava tudo em coluna única: em formulário de B2B isso faz
// a "altura percebida" dobrar e derruba o preenchimento.
//
// Label flutuante em vez de placeholder: placeholder some quando o usuário
// digita, e aí ele não sabe mais o que era o campo ao revisar.
//
// O submit ainda não tem back-end — o handler está isolado em enviar() com
// o ponto de integração marcado. Enquanto não existir endpoint, o formulário
// não finge sucesso: mostra o estado e diz que a equipe retorna.
// ============================================================

type Estado = "idle" | "enviando" | "ok";

export default function DemoSection() {
  const { demo } = content;
  const [estado, setEstado] = useState<Estado>("idle");

  const enviar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEstado("enviando");
    // TODO(integração): POST para /api/contato ou para o CRM da Plenum.
    // Enquanto o endpoint não existe, apenas confirmamos o recebimento
    // local — nada é transmitido.
    await new Promise((r) => setTimeout(r, 700));
    setEstado("ok");
  };

  return (
    <section
      id="demo"
      aria-labelledby="demo-title"
      className="dive-navy relative scroll-mt-28 overflow-hidden px-6 py-24 md:px-10 md:py-36"
    >
      <div
        aria-hidden
        className="orb orb-a top-[-18%] left-1/2 -translate-x-1/2 h-[56vh] w-[70vw] max-w-[980px]"
        style={{ background: "radial-gradient(closest-side, rgba(91,155,255,0.45), transparent)", opacity: 0.7 }}
      />

      <div className="relative mx-auto grid w-full max-w-[1180px] gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div>
          <SectionEyebrow className="mb-9">{demo.eyebrow}</SectionEyebrow>
          <Reveal>
            {/* coluna estreita: o text-giant padrão quebraria em 4 linhas */}
            <SectionTitle
              id="demo-title"
              lines={demo.titleLines}
              className="text-[clamp(1.7rem,2.6vw,2.4rem)]"
            />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-7 max-w-[46ch] text-[15.5px] leading-relaxed text-muted">
              {demo.body}
            </p>
          </Reveal>
        </div>

        <Reveal y={40}>
          <div className="card rounded-3xl p-7 md:p-9">
            {estado === "ok" ? (
              <div className="flex min-h-[380px] flex-col items-start justify-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-leaf/15 text-leaf">
                  <Check className="h-6 w-6" strokeWidth={2.4} />
                </span>
                <h3 className="display-tight mt-6 text-2xl text-fg">
                  Pedido registrado.
                </h3>
                <p className="mt-3 max-w-[38ch] text-[15px] leading-relaxed text-muted">
                  A equipe comercial retorna em até 1 dia útil com a agenda da
                  demonstração e a proposta.
                </p>
              </div>
            ) : (
              <form onSubmit={enviar} noValidate={false}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {demo.campos.map((c) => (
                    <div
                      key={c.name}
                      className={
                        // só o e-mail institucional ocupa a linha inteira —
                        // é o campo mais longo. Os outros quatro fecham em
                        // dois pares, sem sobrar campo órfão numa linha.
                        c.name === "email" ? "sm:col-span-2" : undefined
                      }
                    >
                      <label
                        htmlFor={c.name}
                        className="mb-2 block text-[12.5px] font-medium text-muted"
                      >
                        {c.label}
                        {c.required && (
                          <span className="ml-1 text-leaf">*</span>
                        )}
                      </label>
                      <input
                        id={c.name}
                        name={c.name}
                        type={c.type}
                        required={c.required}
                        autoComplete={
                          c.name === "email"
                            ? "email"
                            : c.name === "nome"
                              ? "name"
                              : c.name === "whatsapp"
                                ? "tel"
                                : "organization"
                        }
                        className="w-full rounded-xl border border-line bg-black/40 px-4 py-3 text-[15px] text-fg shadow-[inset_0_1px_2px_rgba(0,0,0,.4)] transition-colors duration-200 outline-none placeholder:text-faint focus:border-blue/60"
                      />
                    </div>
                  ))}
                </div>

                <p className="mt-6 text-[12.5px] leading-relaxed text-faint">
                  {demo.lgpd}
                </p>

                <button
                  type="submit"
                  disabled={estado === "enviando"}
                  className="cta mt-7 w-full disabled:opacity-70"
                >
                  {estado === "enviando" ? "Enviando…" : demo.submit}
                  {estado !== "enviando" && (
                    <ArrowRight className="h-4 w-4" strokeWidth={2} />
                  )}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
