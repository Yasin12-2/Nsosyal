import { TOKSIK_ESIK } from "@/lib/oruntu";

/**
 * Skoru yüzde olarak, damgalamayan bir renk paletiyle gösterir.
 * Kırmızı/alarm rengi KASITLI OLARAK kullanılmıyor (bkz. docs/03-teknik-tasarim.md,
 * "güçlendirme estetiği" kararı) — eşik altı sakin yeşil, eşik üstü sıcak amber.
 */
export default function SkorRozeti({ skor }: { skor: number }) {
  const yuzde = Math.round(skor * 100);
  const esikUstu = skor >= TOKSIK_ESIK;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        esikUstu
          ? "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-300"
          : "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-300"
      }`}
      title={`Toksisite olasılığı: %${yuzde}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${
          esikUstu ? "bg-amber-500" : "bg-emerald-500"
        }`}
      />
      %{yuzde}
    </span>
  );
}
