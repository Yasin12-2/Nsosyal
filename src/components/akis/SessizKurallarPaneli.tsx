"use client";

import { useState } from "react";
import { SessizKural } from "@/lib/sessiz-kurallar";

/**
 * "Garanti Sessizlik" kuralları paneli. NSosyal'in kendi sessize alma
 * ayarlarının güvenilmez olduğu belgelenmiş bir örüntü olduğu için (bkz.
 * docs/02-nsosyal-platform-analizi-ve-pivot.md), burada eklenen kurallar
 * SUNUCUYA GÖNDERİLMEZ — yalnızca bu cihazda, her zaman uygulanır.
 */
export default function SessizKurallarPaneli({
  kurallar,
  onEkle,
  onSil,
}: {
  kurallar: SessizKural[];
  onEkle: (terim: string) => void;
  onSil: (id: string) => void;
}) {
  const [taslak, setTaslak] = useState("");

  return (
    <div className="rounded-xl border border-black/10 bg-white p-4">
      <h2 className="font-medium text-gray-900">Garanti Sessizlik</h2>
      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
        Buraya eklediğin bir kelime/kaynak etiketi (ör. &quot;N Spor&quot;),
        platformun kendi ayarı çalışsa da çalışmasa da bu cihazda{" "}
        <strong>her zaman</strong> uygulanır — sunucuya hiçbir şey
        gönderilmez.
      </p>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!taslak.trim()) return;
          onEkle(taslak);
          setTaslak("");
        }}
      >
        <input
          type="text"
          value={taslak}
          onChange={(e) => setTaslak(e.target.value)}
          placeholder="ör. N Spor, reklam, ..."
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--renk-sakin)]"
          aria-label="Sessize alınacak kelime veya kaynak etiketi"
        />
        <button
          type="submit"
          className="rounded-lg bg-[var(--renk-sakin)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--renk-sakin-koyu)] transition-colors"
        >
          Ekle
        </button>
      </form>

      {kurallar.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {kurallar.map((k) => (
            <li
              key={k.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
            >
              {k.terim}
              <button
                type="button"
                onClick={() => onSil(k.id)}
                className="text-gray-400 hover:text-red-500"
                aria-label={`"${k.terim}" kuralını sil`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
