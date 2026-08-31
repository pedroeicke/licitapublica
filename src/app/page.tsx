import RibbonSpine from "@/components/motion/RibbonSpine";
import Hero from "@/components/sections/Hero";
import TeseSection from "@/components/sections/TeseSection";
import CicloHorizontal from "@/components/sections/CicloHorizontal";
import TelasSection from "@/components/sections/TelasSection";
import PrecosSection from "@/components/sections/PrecosSection";
import ConsultorSection from "@/components/sections/ConsultorSection";
import GrafoSection from "@/components/sections/GrafoSection";
import MergulhoNavy from "@/components/sections/MergulhoNavy";
import GovernancaSection from "@/components/sections/GovernancaSection";
import SegurancaSection from "@/components/sections/SegurancaSection";
import ParaQuemSection from "@/components/sections/ParaQuemSection";
import ModulosSection from "@/components/sections/ModulosSection";
import QuemSection from "@/components/sections/QuemSection";
import DemoSection from "@/components/sections/DemoSection";
import FaqSection from "@/components/sections/FaqSection";

// ============================================================
// A página em CINCO MOVIMENTOS.
//
// O site do cliente tinha nove seções no mesmo compasso (label → título →
// grid), do começo ao fim. Sem variação de ritmo, tudo parece igualmente
// importante — e por isso nada parece importante.
//
// Aqui existe uma partitura:
//
//   I.   PROMESSA   Hero pinado → cortina da tese
//   II.  MÉTODO     Ciclo horizontal (set-piece) → telas com Flip
//   III. PROVA      Preços (claro) → Consultor → Grafo (clímax)
//   IV.  CONFIANÇA  Para quem → Governança → Segurança → Módulos → Quem
//   V.   AÇÃO       Demonstração → FAQ
//
// Os mergulhos claros (telas, preços, quem) não são decoração: eles caem
// justamente onde o assunto é PRODUTO REAL. O mundo navy é o argumento;
// o papel branco é a coisa funcionando.
// ============================================================

export default function Home() {
  return (
    <div className="relative">
      {/* fita de 3 cores desenhada por scroll, atrás de tudo */}
      <RibbonSpine />

      {/* I — PROMESSA */}
      <Hero />
      {/* precisa vir IMEDIATAMENTE após o Hero: a cortina usa o pin-spacer dele */}
      <TeseSection />

      {/* II — MÉTODO */}
      <CicloHorizontal />
      <TelasSection />

      {/* III — PROVA */}
      <PrecosSection />
      {/* Um campo navy só: sem isso o brilho de cada seção era cortado
          na fronteira e a emenda entre elas aparecia como um traço. */}
      <MergulhoNavy>
        <ConsultorSection />
        <GrafoSection />
      </MergulhoNavy>

      {/* IV — CONFIANÇA */}
      {/* "Para quem" vem antes da governança: o leitor precisa se
          reconhecer no produto antes de se importar com como ele é
          controlado. */}
      <ParaQuemSection />
      <GovernancaSection />
      <SegurancaSection />
      <ModulosSection />
      <QuemSection />

      {/* V — AÇÃO */}
      <DemoSection />
      <FaqSection />
    </div>
  );
}
