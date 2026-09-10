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
//
// O CELULAR AO LADO (pedido de 06:31) não repete a gravação: um painel de
// desktop espremido num aparelho de 150px vira texto ilegível e ainda
// sugere uma interface móvel que não foi mostrada em lugar nenhum. Ele
// mostra a peça mais forte do produto — a resposta com a fonte oficial —
// em conteúdo que já vive em pt.ts. É MOCKUP, e some abaixo de lg: dentro
// de um celular de verdade, um celular desenhado é piada.
// ============================================================

export default function HeroStage() {
  const { visual } = content.hero;
  const { consultor } = content;

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

      {/* ---------- CELULAR ---------- */}
      {/* Fica dentro de .hs-window de propósito: herda a inclinação e o
          mergulho do palco, então os dois se levantam juntos como uma peça
          só, em vez de o aparelho flutuar por cima da cena.

          A PROPORÇÃO é fixada (9/19.5). Sem ela o quadro encolhia até a
          altura do conteúdo e virava um retângulo quase quadrado — que não
          lê como telefone nenhum. Com a proporção fixa, a tipografia pode
          crescer até ficar legível em vez de virar ruído cinza. */}
      <div
        aria-hidden
        className="absolute top-[12%] -right-[8%] hidden w-[19%] max-w-[196px] xl:block"
      >
        <div className="relative flex aspect-[9/19.5] flex-col overflow-hidden rounded-[1.7rem] border-[3px] border-navy/85 bg-white shadow-[0_34px_70px_-26px_rgba(13,20,60,0.6)]">
          {/* entalhe */}
          <span className="absolute top-2 left-1/2 h-1 w-9 -translate-x-1/2 rounded-full bg-navy/20" />

          <div className="flex flex-1 flex-col gap-2 px-3 pt-7 pb-4">
            <p className="data text-[6px] tracking-[0.16em] text-faint uppercase">
              {consultor.eyebrow}
            </p>

            <div className="rounded-lg rounded-tl-sm border border-line bg-paper-2 px-2 py-1.5">
              <p className="text-[7px] leading-[1.45] text-fg">
                {consultor.pergunta.texto}
              </p>
            </div>

            <div className="ml-auto w-[94%] rounded-lg rounded-tr-sm border border-blue/25 bg-blue/[0.07] px-2 py-1.5">
              <p className="text-[7px] leading-[1.45] text-fg">
                {consultor.resposta.antes}
                <strong className="font-semibold text-gold">
                  {consultor.resposta.ref}
                </strong>
              </p>
            </div>

            {/* mt-auto encosta a fonte na base: é a âncora da cena, e é ela
                que o corte da viewport pega por último */}
            <div className="mt-auto rounded-lg border border-gold/35 bg-gold/[0.09] px-2 py-2">
              <p className="data text-[5.5px] leading-[1.5] tracking-[0.12em] text-gold uppercase">
                {consultor.fonte.label}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
