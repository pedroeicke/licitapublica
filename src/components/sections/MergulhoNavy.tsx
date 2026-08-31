import type { ReactNode } from "react";

// ============================================================
// MERGULHO NAVY — o campo escuro que Consultor e Grafo dividem.
//
// POR QUE ISTO EXISTE: as duas seções eram dois blocos `dive-navy
// overflow-hidden` independentes, cada um com os próprios orbes. O orbe
// inferior do Consultor era cortado no rodapé dele e o orbe superior do
// Grafo era cortado no topo do Grafo — dois cortes retos na MESMA linha
// horizontal. O fundo é da mesma cor nos dois, então a emenda não se via
// pela cor: se via pelo brilho, que morria e renascia num traço.
//
// Agora o navy e a luz pertencem a UM invólucro só, e os orbes atravessam
// a fronteira de propósito — é a travessia que apaga a emenda. As seções
// ficam transparentes e cuidam apenas do próprio conteúdo.
//
// Consequência de projeto: quem for mexer no espaçamento entre as duas
// mexe no padding delas, não aqui. E qualquer seção nova que entre no
// mergulho entra DENTRO deste invólucro, sem trazer fundo próprio.
// ============================================================

export default function MergulhoNavy({ children }: { children: ReactNode }) {
  return (
    <div className="dive-navy relative overflow-hidden">
      {/* Quatro orbes distribuídos pela altura do bloco inteiro. O de 34%
          fica em cima da antiga emenda: era ali que o corte aparecia. */}
      <div
        aria-hidden
        className="orb orb-a top-[-8%] left-[-6%] h-[52vh] w-[46vw] max-w-[680px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(43,98,224,0.55), transparent)",
          opacity: 0.75,
        }}
      />
      <div
        aria-hidden
        className="orb orb-b top-[34%] right-[-8%] h-[56vh] w-[44vw] max-w-[660px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(91,155,255,0.4), transparent)",
          opacity: 0.62,
        }}
      />
      <div
        aria-hidden
        className="orb orb-a top-[58%] left-[-10%] h-[50vh] w-[44vw] max-w-[660px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(43,98,224,0.5), transparent)",
          opacity: 0.6,
        }}
      />
      <div
        aria-hidden
        className="orb orb-b right-[-6%] bottom-[-12%] h-[46vh] w-[40vw] max-w-[600px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(91,155,255,0.42), transparent)",
          opacity: 0.55,
        }}
      />
      {children}
    </div>
  );
}
