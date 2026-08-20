"use client";

import { TaklitRiskiSonucu } from "@/lib/guven-karti";
import TaklitRiskRozeti from "./TaklitRiskRozeti";

/**
 * "Taklit/Kimlik Riski" paneli. Kullanıcı bir profil adı + biyografi
 * yapıştırır ve doğrulama rozeti görüp görmediğini kendisi işaretler
 * (NSosyal'den otomatik veri çekilmiyor — bkz. lib/guven-karti.ts). Sonuç,
 * canlı olarak (submit gerekmeden) hesaplanıp gösterilir; her sinyalin
 * gerekçesi ayrı ayrı görünür (şeffaflık katmanı ilkesiyle tutarlı, bkz.
 * GirisKarti.tsx'teki "Neden bu skoru gördüm?" paneli).
 */
export default function TaklitRiskiPaneli({
  profilAdi,
  biyografi,
  dogrulamaRozetiVarMi,
  onProfilAdiDegistir,
  onBiyografiDegistir,
  onDogrulamaDegistir,
  sonuc,
}: {
  profilAdi: string;
  biyografi: string;
  dogrulamaRozetiVarMi: boolean;
  onProfilAdiDegistir: (deger: string) => void;
  onBiyografiDegistir: (deger: string) => void;
  onDogrulamaDegistir: (deger: boolean) => void;
  sonuc: TaklitRiskiSonucu | null;
}) {
  return (
    <section
      aria-label="Taklit/kimlik riski paneli"
      className="rounded-xl border border-black/10 bg-white p-5 shadow-sm"
    >
      <h2 className="font-medium text-gray-900">Taklit/Kimlik Riski</h2>
      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
        Etkileşime girmeden önce dikkatli olmak istediğiniz bir profilin
        adını ve biyografisini yapıştırın. Bu bir &quot;sahte hesap
        tespiti&quot; değildir — yalnızca dikkate alabileceğiniz sinyalleri
        gösteren bir farkındalık aracıdır.
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <div>
          <label
            htmlFor="profil-adi"
            className="text-sm font-medium text-gray-800"
          >
            Profil adı
          </label>
          <input
            id="profil-adi"
            type="text"
            value={profilAdi}
            onChange={(e) => onProfilAdiDegistir(e.target.value)}
            placeholder="ör. Elon Musk"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--renk-sakin)] focus:ring-1 focus:ring-[var(--renk-sakin)] outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="biyografi"
            className="text-sm font-medium text-gray-800"
          >
            Biyografi
          </label>
          <textarea
            id="biyografi"
            value={biyografi}
            onChange={(e) => onBiyografiDegistir(e.target.value)}
            rows={2}
            placeholder="Profilin biyografi metnini yapıştırın..."
            className="mt-1 w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-800 focus:border-[var(--renk-sakin)] focus:ring-1 focus:ring-[var(--renk-sakin)] outline-none resize-y"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={dogrulamaRozetiVarMi}
            onChange={(e) => onDogrulamaDegistir(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-[var(--renk-sakin)] focus:ring-[var(--renk-sakin)]"
          />
          Bu profilde doğrulama (mavi tik) rozeti görüyorum
        </label>
      </div>

      {sonuc && (profilAdi.trim() || biyografi.trim()) && (
        <div className="mt-4 rounded-lg border border-black/5 bg-gray-50/60 p-3">
          <TaklitRiskRozeti seviye={sonuc.seviye} skor={sonuc.skor} />
          <ul className="mt-3 flex flex-col gap-2">
            {sonuc.sinyaller.map((sinyal) => (
              <li
                key={sinyal.anahtar}
                className={`rounded-lg p-2.5 text-xs leading-relaxed ${
                  sinyal.tetiklendiMi
                    ? "bg-amber-50 text-amber-900 ring-1 ring-inset ring-amber-200"
                    : "bg-white text-gray-500 ring-1 ring-inset ring-gray-200"
                }`}
              >
                <span className="font-medium">{sinyal.baslik}</span>
                {" — "}
                {sinyal.aciklama}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-gray-400">
            Bu skor kesin bir iddia değildir; hiçbir hesabı &quot;sahte&quot;
            diye ilan etmez. Sadece etkileşime girmeden önce dikkate
            alabileceğiniz sinyalleri şeffaf biçimde gösterir.
          </p>
        </div>
      )}
    </section>
  );
}
