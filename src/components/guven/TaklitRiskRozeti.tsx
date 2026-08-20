import { TaklitRiskSeviyesi } from "@/lib/guven-karti";

const SEVIYE_STIL: Record<
  TaklitRiskSeviyesi,
  { etiket: string; renkSinif: string; noktaSinif: string }
> = {
  dusuk: {
    etiket: "Düşük dikkat düzeyi",
    renkSinif: "bg-emerald-50 text-emerald-800 ring-emerald-300",
    noktaSinif: "bg-emerald-500",
  },
  orta: {
    etiket: "Orta dikkat düzeyi",
    renkSinif: "bg-amber-50 text-amber-800 ring-amber-300",
    noktaSinif: "bg-amber-500",
  },
  yuksek: {
    etiket: "Yüksek dikkat düzeyi",
    renkSinif: "bg-orange-50 text-orange-800 ring-orange-300",
    noktaSinif: "bg-orange-500",
  },
};

/**
 * Taklit/kimlik riski skorunu, damgalamayan bir "dikkat düzeyi" rozeti
 * olarak gösterir. Kırmızı/alarm rengi ve "TEHLİKE"/"SAHTE" gibi kesin
 * iddialar KASITLI OLARAK kullanılmıyor (bkz. SkorRozeti.tsx'teki aynı
 * "güçlendirme estetiği" kararı).
 */
export default function TaklitRiskRozeti({
  seviye,
  skor,
}: {
  seviye: TaklitRiskSeviyesi;
  skor: number;
}) {
  const stil = SEVIYE_STIL[seviye];
  const yuzde = Math.round(skor * 100);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${stil.renkSinif}`}
      title={`Taklit/kimlik riski göstergesi: %${yuzde}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${stil.noktaSinif}`} />
      {stil.etiket} (%{yuzde})
    </span>
  );
}
