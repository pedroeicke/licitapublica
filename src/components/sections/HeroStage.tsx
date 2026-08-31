"use client";

import { content } from "@/content";

// ============================================================
// HERO STAGE — a gravação do produto como PALCO.
//
// Antes isto era um mockup desenhado em HTML. Agora é o vídeo real da
// plataforma, então saiu tudo o que era imitação de interface: a gravação
// já traz o menu lateral, o cabeçalho e a tabela de processos. Ficou só a
// barra de navegador em volta — ela enquadra o vídeo como "o produto
// rodando", coisa que uma moldura genérica não faria.
//
// A janela é larga, deitada em perspectiva e CORTADA pela borda inferior
// da viewport. O corte é o truque da imersão: um retângulo inteiro dentro
// da tela é uma figura — você olha PRA ela. Um retângulo que sai da tela
// vira espaço — você está DENTRO dele.
//
// A inclinação NÃO mora aqui: fica no wrapper .hs-tilt, no Hero. A entrada
// anima este elemento e o scroll anima a inclinação; se as duas coisas
// disputassem o mesmo nó, o tween de scroll gravaria o "from" da entrada
// como estado inicial e a tela saltaria ao rolar.
//
// O vídeo começa PAUSADO, mostrando o poster. Quem dá play é o Hero,
// quando a tela termina de se levantar.
// ============================================================

export default function HeroStage() {
  const { visual } = content.hero;

  return (
    <div className="hs-window relative w-full">
      {/* brilho sob o palco — a luz que faz a tela "flutuar" */}
      <div
        aria-hidden
        className="orb orb-a absolute -inset-x-24 -top-10 h-[70%]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(91,155,255,0.5), transparent)",
        }}
      />

      <div className="relative overflow-hidden rounded-t-2xl border border-line bg-white shadow-[0_-2px_0_rgba(255,255,255,.9)_inset,0_-40px_120px_-30px_rgba(43,98,224,0.45)]">
        {/* barra do navegador */}
        <div className="flex items-center gap-2 border-b border-line bg-paper-2 px-5 py-3.5">
          <span className="h-2.5 w-2.5 rounded-full bg-navy/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-navy/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-navy/10" />
          <span className="data mx-auto rounded-md bg-white px-3 py-1 text-[10.5px] text-muted">
            {visual.janela}
          </span>
        </div>

        {/* A proporção é a do arquivo (1280×722). Fixá-la reserva a altura
            antes de o vídeo carregar — sem isso o palco muda de tamanho no
            meio da entrada e o ScrollTrigger recalcula posições no pior
            momento possível. */}
        <video
          className="hs-video block aspect-[1280/722] w-full object-cover"
          src="/hero-demo.mp4"
          poster="/hero-demo-poster.jpg"
          // muted + playsInline são o que torna o play programático viável:
          // navegador nenhum autoriza reprodução automática com áudio.
          muted
          playsInline
          loop
          preload="auto"
          aria-label="Gravação da plataforma Licita Pública em uso"
        />
      </div>
    </div>
  );
}
