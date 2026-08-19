import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

// Not: Kasıtlı olarak next/font/google KULLANILMIYOR. Jüri sunumunun
// internet garantisi olmayan bir ortamda (Şanlıurfa) çevrimdışı çalışması
// gerekiyor; sistem fontu yığını (bkz. globals.css) hem çevrimdışı build'i
// garanti eder hem de ekstra font indirme gecikmesini ortadan kaldırır.

export const metadata: Metadata = {
  title: "Akış Aynası",
  description:
    "Sosyal medya akışının duygusal/toksik örüntüsüne ayna tutan, cihaz-ağırlıklı, KVKK-minimal bir farkındalık aracı.",
};

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/akis", label: "Akış Günlüğü" },
  { href: "/hakkinda", label: "Hakkında" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <a
          href="#ana-icerik"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:shadow"
        >
          İçeriğe geç
        </a>
        <header className="border-b border-black/10 bg-white/70 backdrop-blur sticky top-0 z-40">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg text-[var(--renk-sakin-koyu)]">
              <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--renk-sakin)]" />
              Akış Aynası
            </Link>
            <nav aria-label="Ana gezinme" className="flex gap-1 sm:gap-2 text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-2 text-gray-700 hover:bg-black/5 hover:text-[var(--renk-sakin-koyu)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main id="ana-icerik" className="flex-1 flex flex-col">
          {children}
        </main>
        <footer className="border-t border-black/10 mt-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 text-sm text-gray-500 flex flex-col gap-2">
            <p>
              Akış Aynası bir teşhis, terapi veya tıbbi araç DEĞİLDİR; kişisel
              farkındalık için basit bir aynadır. Tüm veriler yalnızca bu
              cihazda tutulur, hiçbir yere gönderilmez.
            </p>
            <p>NSosyal İnovasyon Yarışması 2026 — Sosyal Yapay Zekâ teması, prototip.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
