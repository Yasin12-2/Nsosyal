"use client";

import { FormEvent, useState } from "react";

export default function GirisFormu({
  onEkle,
  onOrnekYukle,
  yukleniyorMu,
  hataMesaji,
}: {
  onEkle: (metin: string) => void;
  onOrnekYukle: () => void;
  yukleniyorMu: boolean;
  hataMesaji: string | null;
}) {
  const [metin, setMetin] = useState("");

  function gonder(e: FormEvent) {
    e.preventDefault();
    const temiz = metin.trim();
    if (!temiz) return;
    onEkle(temiz);
    setMetin("");
  }

  return (
    <section className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
      <form onSubmit={gonder} className="flex flex-col gap-3">
        <label htmlFor="metin-girisi" className="font-medium text-gray-900">
          Bir gönderi veya yorum metni yapıştırın
        </label>
        <textarea
          id="metin-girisi"
          value={metin}
          onChange={(e) => setMetin(e.target.value)}
          rows={3}
          placeholder="Örn: Bugün sosyal medyada gördüğüm bir yorumu buraya yapıştırabilirim..."
          className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-800 focus:border-[var(--renk-sakin)] focus:ring-1 focus:ring-[var(--renk-sakin)] outline-none resize-y"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-gray-400 max-w-sm">
            Metin yalnızca bu cihazda, tarayıcınızda analiz edilir; hiçbir
            yere gönderilmez.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onOrnekYukle}
              disabled={yukleniyorMu}
              className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-black/5 transition-colors disabled:opacity-50"
            >
              Örnek verilerle doldur
            </button>
            <button
              type="submit"
              disabled={yukleniyorMu || !metin.trim()}
              className="rounded-full bg-[var(--renk-sakin)] px-5 py-2 text-sm font-medium text-white hover:bg-[var(--renk-sakin-koyu)] transition-colors disabled:opacity-50"
            >
              {yukleniyorMu ? "Model yükleniyor..." : "Günlüğe Ekle"}
            </button>
          </div>
        </div>
        {hataMesaji && (
          <p role="alert" className="text-sm text-red-600">
            {hataMesaji}
          </p>
        )}
      </form>
    </section>
  );
}
