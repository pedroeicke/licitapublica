import { content } from "@/content";
import Wordmark from "@/components/ui/Wordmark";

export default function Footer() {
  const { footer } = content;

  return (
    <footer className="dive-navy relative overflow-hidden rounded-[var(--lp-raio-navy)] px-6 py-16 md:px-10">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <Wordmark variante="branca" className="h-7 md:h-[30px]" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {footer.linha}
            </p>
            <a
              href={`mailto:${footer.email}`}
              className="data mt-4 inline-block text-sm text-leaf transition-colors hover:text-leaf/80"
            >
              {footer.email}
            </a>
          </div>

        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
          <p className="data text-xs text-faint">
            © {footer.ano} {footer.empresa} · {footer.linha}
          </p>
          <a
            href="#"
            className="data text-xs text-leaf underline decoration-leaf/40 underline-offset-4 transition-colors hover:decoration-leaf"
          >
            {footer.politica}
          </a>
        </div>
        <p className="mt-5 max-w-[64ch] text-[12.5px] leading-relaxed text-faint">
          {footer.dpo}
        </p>
      </div>
    </footer>
  );
}
