"use client";

import { useCallback, useEffect, useState } from "react";
import { modeliYukle } from "@/lib/model";
import { skorla } from "@/lib/scoring";
import { LoadedModel } from "@/lib/scoring";
import {
  girisEkle,
  girisSil,
  girisleriTemizle,
  girisleriYukle,
} from "@/lib/storage";
import { oruntuHesapla } from "@/lib/oruntu";
import { AkisGirisi } from "@/lib/types";
import { ORNEK_METINLER } from "@/lib/demo-veri";
import GirisFormu from "@/components/akis/GirisFormu";
import GirisKarti from "@/components/akis/GirisKarti";
import OruntuPaneli from "@/components/akis/OruntuPaneli";
import MudahaleBanner from "@/components/akis/MudahaleBanner";

function idOlustur(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function AkisGunluguSayfasi() {
  const [girisler, setGirisler] = useState<AkisGirisi[]>([]);
  const [model, setModel] = useState<LoadedModel | null>(null);
  const [modelHatasi, setModelHatasi] = useState<string | null>(null);
  const [modelYukleniyor, setModelYukleniyor] = useState(true);
  const [bannerKapatildi, setBannerKapatildi] = useState(false);

  // İlk yüklemede: localStorage'dan girdileri oku, modeli tarayıcıya indir.
  // Not: localStorage sunucuda mevcut olmadığından (SSR/hydration uyumsuzluğunu
  // önlemek için) bu okuma bilinçli olarak mount-sonrası bir efekt içinde
  // yapılıyor; tek seferlik bir dış-kaynak senkronizasyonu olduğu için
  // react-hooks/set-state-in-effect kuralı burada kasıtlı olarak devre dışı.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGirisler(girisleriYukle());
    modeliYukle()
      .then((m) => setModel(m))
      .catch((err) => {
        console.error(err);
        setModelHatasi(
          "Model dosyası yüklenemedi. Sayfayı yenilemeyi deneyin (public/model/toksisite-model.json build çıktısında bulunmalı).",
        );
      })
      .finally(() => setModelYukleniyor(false));
  }, []);

  const skorlaVeEkle = useCallback(
    (metin: string) => {
      if (!model) return;
      const sonuc = skorla(metin, model);
      const yeniGiris: AkisGirisi = {
        id: idOlustur(),
        metin,
        zamanDamgasi: Date.now(),
        skor: sonuc.skor,
        katkilar: sonuc.katkilar,
        tokenSayisi: sonuc.tokenSayisi,
        taninanTokenSayisi: sonuc.taninanTokenSayisi,
      };
      setGirisler((mevcut) => girisEkle(mevcut, yeniGiris));
      setBannerKapatildi(false);
    },
    [model],
  );

  const ornekleriYukle = useCallback(() => {
    if (!model) return;
    let guncel = girisler;
    for (const metin of ORNEK_METINLER) {
      const sonuc = skorla(metin, model);
      const yeniGiris: AkisGirisi = {
        id: idOlustur(),
        metin,
        zamanDamgasi: Date.now(),
        skor: sonuc.skor,
        katkilar: sonuc.katkilar,
        tokenSayisi: sonuc.tokenSayisi,
        taninanTokenSayisi: sonuc.taninanTokenSayisi,
      };
      guncel = girisEkle(guncel, yeniGiris);
    }
    setGirisler(guncel);
    setBannerKapatildi(false);
  }, [model, girisler]);

  const girdiSil = useCallback((id: string) => {
    setGirisler((mevcut) => girisSil(mevcut, id));
  }, []);

  const hepsiniTemizle = useCallback(() => {
    setGirisler(girisleriTemizle());
    setBannerKapatildi(false);
  }, []);

  const oruntu = oruntuHesapla(girisler);
  const gorunecekGirisler = [...girisler].reverse(); // en yeni en üstte

  return (
    <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 py-10 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Akış Günlüğü</h1>
        <p className="text-gray-600 mt-1">
          Gördüğünüz içerikleri buraya ekleyin; Akış Aynası zaman içindeki
          örüntüyü size gösterir.
        </p>
      </div>

      <GirisFormu
        onEkle={skorlaVeEkle}
        onOrnekYukle={ornekleriYukle}
        yukleniyorMu={modelYukleniyor}
        hataMesaji={modelHatasi}
      />

      {oruntu.mudahaleGerekli && !bannerKapatildi && (
        <MudahaleBanner
          toksikOran={oruntu.toksikOran}
          onKapat={() => setBannerKapatildi(true)}
        />
      )}

      <OruntuPaneli oruntu={oruntu} />

      <div className="flex items-center justify-between">
        <h2 className="font-medium text-gray-900">
          Girdiler ({girisler.length})
        </h2>
        {girisler.length > 0 && (
          <button
            type="button"
            onClick={hepsiniTemizle}
            className="text-sm text-gray-400 hover:text-red-500"
          >
            Tümünü temizle
          </button>
        )}
      </div>

      {gorunecekGirisler.length === 0 ? (
        <p className="text-sm text-gray-400">
          Henüz girdi eklenmedi. Yukarıdan bir metin yapıştırın veya &quot;Örnek
          verilerle doldur&quot; butonunu kullanın.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {gorunecekGirisler.map((g) => (
            <GirisKarti key={g.id} giris={g} onSil={girdiSil} />
          ))}
        </ul>
      )}
    </div>
  );
}
