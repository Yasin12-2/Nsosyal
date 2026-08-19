"use client";

import { useState } from "react";
import { AkisGirisi } from "@/lib/types";
import { enOlumsuzKatkilar, enOlumluKatkilar } from "@/lib/scoring";
import SkorRozeti from "./SkorRozeti";

function saatFormatla(ts: number): string {
  try {
    return new Date(ts).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function GirisKarti({
  giris,
  onSil,
  sessizTerim,
}: {
  giris: AkisGirisi;
  onSil: (id: string) => void;
  /** Eşleşen "Garanti Sessizlik" kuralının terimi varsa (bkz.
   * sessiz-kurallar.ts); bu girdi platformun kendi ayarına bakılmaksızın
   * bu cihazda sessize alınmış demektir. */
  sessizTerim?: string | null;
}) {
  const [acik, setAcik] = useState(false);
  const olumsuz = enOlumsuzKatkilar(giris.katkilar, 5);
  const olumlu = enOlumluKatkilar(giris.katkilar, 5);

  return (
    <li
      className={`rounded-xl border p-4 shadow-sm ${
        sessizTerim
          ? "border-gray-200 bg-gray-50/70"
          : "border-black/10 bg-white"
      }`}
    >
      {sessizTerim && (
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600">
          🔇 Garanti sessizlik — &quot;{sessizTerim}&quot; kuralına uydu
          (cihazında, sunucudan bağımsız)
        </div>
      )}
      <div className="flex items-start justify-between gap-3">
        <p
          className={`text-sm leading-relaxed break-words flex-1 ${
            sessizTerim ? "text-gray-500" : "text-gray-800"
          }`}
        >
          {giris.metin}
        </p>
        <SkorRozeti skor={giris.skor} />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
        <span>{saatFormatla(giris.zamanDamgasi)}</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAcik((v) => !v)}
            aria-expanded={acik}
            className="text-[var(--renk-nazik)] font-medium hover:underline"
          >
            {acik ? "Şeffaflık panelini kapat" : "Neden bu skoru gördüm?"}
          </button>
          <button
            type="button"
            onClick={() => onSil(giris.id)}
            className="text-gray-400 hover:text-red-500"
            aria-label="Bu girdiyi sil"
          >
            Sil
          </button>
        </div>
      </div>

      {acik && (
        <div className="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-gray-700 space-y-3">
          <p className="text-gray-500">
            Bu bir doğrusal model olduğu için skor, aşağıdaki her kelimenin
            katkısının toplamından hesaplanır. Model{" "}
            {giris.taninanTokenSayisi}/{giris.tokenSayisi} kelimeyi kelime
            dağarcığında tanıdı.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <h4 className="font-medium text-amber-700 mb-1">
                Toksisiteyi artıran kelimeler
              </h4>
              {olumsuz.length === 0 ? (
                <p className="text-gray-400">Belirgin bir kelime bulunamadı.</p>
              ) : (
                <ul className="space-y-1">
                  {olumsuz.map((k) => (
                    <li key={k.kelime} className="flex justify-between gap-2">
                      <span>{k.kelime}</span>
                      <span className="text-amber-700 font-mono">
                        +{k.katki.toFixed(3)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h4 className="font-medium text-emerald-700 mb-1">
                Toksisiteyi azaltan kelimeler
              </h4>
              {olumlu.length === 0 ? (
                <p className="text-gray-400">Belirgin bir kelime bulunamadı.</p>
              ) : (
                <ul className="space-y-1">
                  {olumlu.map((k) => (
                    <li key={k.kelime} className="flex justify-between gap-2">
                      <span>{k.kelime}</span>
                      <span className="text-emerald-700 font-mono">
                        {k.katki.toFixed(3)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
