"use client";

import { FormEvent, useState } from "react";
import { SablonBenzerlikSonucu } from "@/lib/guven-karti";

const SEVIYE_METIN: Record<
  SablonBenzerlikSonucu["uyariSeviyesi"],
  { rozet: string; renkSinif: string; not: string }
> = {
  yok: {
    rozet: "Karşılaştırma bekleniyor",
    renkSinif: "bg-gray-50 text-gray-600 ring-gray-300",
    not: "En az 2 metin ekleyin ki karşılaştırma yapılabilsin.",
  },
  dusuk: {
    rozet: "Belirgin bir kalıp bulunamadı",
    renkSinif: "bg-emerald-50 text-emerald-800 ring-emerald-300",
    not: "Eklediğiniz metinler birbirinden yeterince farklı görünüyor.",
  },
  orta: {
    rozet: "Hafif kalıp benzerliği",
    renkSinif: "bg-amber-50 text-amber-800 ring-amber-300",
    not: "Bazı metinler birbirine benziyor olabilir — bu tek başına bir sorun değildir, sadece dikkat çekici bir kalıptır.",
  },
  yuksek: {
    rozet: "Olağandışı derecede benzer",
    renkSinif: "bg-orange-50 text-orange-800 ring-orange-300",
    not: "Bu metinler birbirine olağandışı derecede benziyor; kalıp/şablon içerik olabilir. Bu, kesin bir \"bot\" veya \"spam\" iddiası değildir, sadece dikkat çekici bir farkındalık notudur.",
  },
};

/**
 * "Şablon/Spam Benzerliği" paneli. Kullanıcı birden fazla gönderi/hesap
 * açıklaması metni ekler; aralarındaki TF-IDF kosinüs benzerliği hesaplanır.
 * Dil bilinçli olarak damgalamayan: "bot" veya "sahte" gibi kesin iddialar
 * KURULMUYOR, yalnızca "kalıp içerik olabilir" farkındalığı sunuluyor.
 */
export default function SablonBenzerligiPaneli({
  metinler,
  onEkle,
  onSil,
  sonuc,
}: {
  metinler: string[];
  onEkle: (metin: string) => void;
  onSil: (index: number) => void;
  sonuc: SablonBenzerlikSonucu;
}) {
  const [taslak, setTaslak] = useState("");

  function gonder(e: FormEvent) {
    e.preventDefault();
    const temiz = taslak.trim();
    if (!temiz) return;
    onEkle(temiz);
    setTaslak("");
  }

  const seviyeBilgi = SEVIYE_METIN[sonuc.uyariSeviyesi];

  return (
    <section
      aria-label="Şablon/spam benzerliği paneli"
      className="rounded-xl border border-black/10 bg-white p-5 shadow-sm"
    >
      <h2 className="font-medium text-gray-900">Şablon/Spam Benzerliği</h2>
      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
        Aynı hesaptan veya birbirine bağlı görünen hesaplardan birden fazla
        gönderi/hesap açıklaması metni yapıştırın. Metinler yalnızca bu
        tarayıcıda, aralarındaki kelime benzerliği ölçülerek karşılaştırılır
        — hiçbir yere gönderilmez.
      </p>

      <form onSubmit={gonder} className="mt-3 flex flex-col gap-2">
        <textarea
          value={taslak}
          onChange={(e) => setTaslak(e.target.value)}
          rows={2}
          placeholder="Bir gönderi veya hesap açıklaması metni yapıştırın..."
          className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-800 focus:border-[var(--renk-sakin)] focus:ring-1 focus:ring-[var(--renk-sakin)] outline-none resize-y"
          aria-label="Karşılaştırılacak metin"
        />
        <button
          type="submit"
          disabled={!taslak.trim()}
          className="self-end rounded-full bg-[var(--renk-sakin)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--renk-sakin-koyu)] transition-colors disabled:opacity-50"
        >
          Metni Ekle
        </button>
      </form>

      {metinler.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
          {metinler.map((metin, i) => (
            <li
              key={i}
              className="flex items-start justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-700"
            >
              <span className="flex-1 break-words">
                <span className="font-medium text-gray-500">
                  Metin {i + 1}:{" "}
                </span>
                {metin}
              </span>
              <button
                type="button"
                onClick={() => onSil(i)}
                className="shrink-0 text-gray-400 hover:text-red-500"
                aria-label={`Metin ${i + 1}'i sil`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 rounded-lg border border-black/5 bg-gray-50/60 p-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${seviyeBilgi.renkSinif}`}
        >
          {seviyeBilgi.rozet}
        </span>
        <p className="mt-2 text-xs text-gray-600 leading-relaxed">
          {seviyeBilgi.not}
        </p>
        {sonuc.enYuksekCift && (
          <p className="mt-1 text-xs text-gray-500">
            En yüksek benzerlik: Metin {sonuc.enYuksekCift.aIndex + 1} ile
            Metin {sonuc.enYuksekCift.bIndex + 1} arasında{" "}
            <span className="font-mono">
              %{Math.round(sonuc.enYuksekCift.benzerlik * 100)}
            </span>
            .
          </p>
        )}
      </div>
    </section>
  );
}
