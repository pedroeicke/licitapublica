import type { Metadata } from "next";
import { archivo, jakarta, plexMono, montserrat } from "./fonts";
import { content, locale } from "@/content";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: content.meta.title,
  description: content.meta.description,
  openGraph: {
    title: content.meta.title,
    description: content.meta.description,
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={locale}
      className={`${archivo.variable} ${jakarta.variable} ${plexMono.variable} ${montserrat.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full" suppressHydrationWarning>
        {/* ============================================================
            AMBIENTE — branco com luz azul difusa nas quinas.

            O chão do site é papel. O azul entra como LUZ (dois focos muito
            abertos e muito fracos), não como tinta: dá temperatura de marca
            ao branco sem transformá-lo em "seção azul clara".
            ============================================================ */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-30 bg-paper"
        />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-20"
          style={{
            background:
              "radial-gradient(56vw 48vh at 84% -4%, rgba(91,155,255,0.16), transparent 62%), radial-gradient(50vw 44vh at 2% 100%, rgba(43,98,224,0.10), transparent 60%)",
          }}
        />
        {/* grão: tira o aspecto de gradiente CSS chapado */}
        <div
          aria-hidden
          className="texture-grain pointer-events-none fixed inset-0 -z-10"
        />

        <SmoothScroll>
          <Header />
          <main id="topo">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
