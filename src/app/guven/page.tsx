"use client";

import { useCallback, useMemo, useState } from "react";
import {
  sablonBenzerligiHesapla,
  taklitRiskiHesapla,
} from "@/lib/guven-karti";
import SablonBenzerligiPaneli from "@/components/guven/SablonBenzerligiPaneli";
import TaklitRiskiPaneli from "@/components/guven/TaklitRiskiPaneli";

/**
 * "Güven Kartı" — Akış Aynası'ndaki toksisite/Garanti Sessizlik
 * modüllerinden bağımsız, ikinci bir farkındalık modülü. Neden ayrı bir
 * sayfa (Akış Günlüğü'ne gömülü bir bölüm değil)?
 * 1) Girdi şekli tamamen farklı: Akış Günlüğü tek bir "benim gördüğüm
 *    içerik" akışı biriktirirken, Güven Kartı BİRDEN FAZLA metin/bir profil
 *    kartı karşılaştırıyor — aynı sayfaya sıkıştırmak formu karmaşıklaştırır
 *    (UX önceliği: "sade, erişilebilir arayüz").
 * 2) Gizlilik çerçevesi farklı: Akış Günlüğü kullanıcının KENDİ akışını,
 *    Güven Kartı ise potansiyel olarak BAŞKA bir profilin herkese açık
 *    metnini analiz ediyor — bu ayrımı arayüzde de görünür kılmak, hangi
 *    verinin ne amaçla kullanıldığını netleştiriyor.
 * Bkz. docs/03-teknik-tasarim.md (bugünün günlüğü) için gerekçenin tam
 * metni.
 */
export default function GuvenKartiSayfasi() {
  const [metinler, setMetinler] = useState<string[]>([]);
  const [profilAdi, setProfilAdi] = useState("");
  const [biyografi, setBiyografi] = useState("");
  const [dogrulamaRozetiVarMi, setDogrulamaRozetiVarMi] = useState(false);

  const metinEkle = useCallback((metin: string) => {
    setMetinler((mevcut) => [...mevcut, metin]);
  }, []);

  const metinSil = useCallback((index: number) => {
    setMetinler((mevcut) => mevcut.filter((_, i) => i !== index));
  }, []);

  const sablonSonucu = useMemo(
    () => sablonBenzerligiHesapla(metinler),
    [metinler],
  );

  const taklitSonucu = useMemo(
    () =>
      taklitRiskiHesapla({ profilAdi, biyografi, dogrulamaRozetiVarMi }),
    [profilAdi, biyografi, dogrulamaRozetiVarMi],
  );

  return (
    <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 py-10 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Güven Kartı</h1>
        <p className="text-gray-600 mt-1 leading-relaxed">
          NSosyal&apos;in kendi topluluk kuralları, taklit/sahte hesaplar
          konusunda hassas olduğunu belirtiyor. Güven Kartı, bir gönderi
          kümesinin veya profilin taklit/kalıp içerik riskini
          değerlendirirken dikkate alabileceğiniz sinyalleri şeffaf biçimde
          gösteren, tamamen bu cihazda çalışan bir farkındalık aracıdır —
          ihbar mekanizması değildir, hiçbir hesabı otomatik olarak
          &quot;sahte&quot; ilan etmez.
        </p>
      </div>

      <SablonBenzerligiPaneli
        metinler={metinler}
        onEkle={metinEkle}
        onSil={metinSil}
        sonuc={sablonSonucu}
      />

      <TaklitRiskiPaneli
        profilAdi={profilAdi}
        biyografi={biyografi}
        dogrulamaRozetiVarMi={dogrulamaRozetiVarMi}
        onProfilAdiDegistir={setProfilAdi}
        onBiyografiDegistir={setBiyografi}
        onDogrulamaDegistir={setDogrulamaRozetiVarMi}
        sonuc={taklitSonucu}
      />

      <p className="text-xs text-gray-400 leading-relaxed">
        Veri ve gizlilik: Buraya yapıştırdığınız metinler hiçbir sunucuya
        gönderilmez ve kalıcı olarak saklanmaz — yalnızca bu sekmede, siz
        sayfadan ayrılana kadar bellekte tutulur. NSosyal&apos;den otomatik
        veri çekilmez; tüm girdiler sizin kendi yapıştırmanızla oluşur.
      </p>
    </div>
  );
}
