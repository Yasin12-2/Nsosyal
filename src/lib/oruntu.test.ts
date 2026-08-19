import { describe, it, expect } from "vitest";
import {
  oruntuHesapla,
  TOKSIK_ESIK,
  PENCERE_BOYUTU,
  MIN_GIRIS_MUDAHALE,
} from "./oruntu";
import { AkisGirisi } from "./types";

function girisOlustur(skor: number, index: number): AkisGirisi {
  return {
    id: `g${index}`,
    metin: `metin ${index}`,
    zamanDamgasi: index,
    skor,
    katkilar: [],
    tokenSayisi: 1,
    taninanTokenSayisi: 1,
  };
}

describe("oruntuHesapla", () => {
  it("boş girdi listesinde müdahale önermez", () => {
    const sonuc = oruntuHesapla([]);
    expect(sonuc.toplamGiris).toBe(0);
    expect(sonuc.toksikOran).toBe(0);
    expect(sonuc.mudahaleGerekli).toBe(false);
  });

  it("MIN_GIRIS_MUDAHALE altındaki girdi sayısında oran yüksek olsa bile müdahale önermez", () => {
    const girisler = [girisOlustur(0.9, 0), girisOlustur(0.9, 1)];
    expect(girisler.length).toBeLessThan(MIN_GIRIS_MUDAHALE);
    const sonuc = oruntuHesapla(girisler);
    expect(sonuc.toksikOran).toBe(1);
    expect(sonuc.mudahaleGerekli).toBe(false);
  });

  it("son N girdinin >%50'si eşiği aşınca müdahale önerir", () => {
    const girisler = [
      girisOlustur(0.9, 0),
      girisOlustur(0.8, 1),
      girisOlustur(0.7, 2),
      girisOlustur(0.1, 3),
    ];
    const sonuc = oruntuHesapla(girisler);
    expect(sonuc.toplamGiris).toBe(4);
    expect(sonuc.toksikSayisi).toBe(3);
    expect(sonuc.toksikOran).toBe(0.75);
    expect(sonuc.mudahaleGerekli).toBe(true);
  });

  it("tam olarak %50 oranında müdahale ÖNERMEZ (eşik kesin aşılmalı, 'üzerinde' > kullanılır)", () => {
    const girisler = [
      girisOlustur(0.9, 0),
      girisOlustur(0.9, 1),
      girisOlustur(0.1, 2),
      girisOlustur(0.1, 3),
    ];
    const sonuc = oruntuHesapla(girisler);
    expect(sonuc.toksikOran).toBe(0.5);
    expect(sonuc.mudahaleGerekli).toBe(false);
  });

  it("skor tam olarak TOKSIK_ESIK değerinde toksik sayılır (>=)", () => {
    const girisler = [
      girisOlustur(TOKSIK_ESIK, 0),
      girisOlustur(TOKSIK_ESIK, 1),
      girisOlustur(TOKSIK_ESIK, 2),
    ];
    const sonuc = oruntuHesapla(girisler);
    expect(sonuc.toksikSayisi).toBe(3);
  });

  it("yalnızca son PENCERE_BOYUTU kadar girdiye bakar", () => {
    const eskiToksikler = Array.from({ length: 20 }, (_, i) =>
      girisOlustur(0.95, i),
    );
    const yeniTemizler = Array.from({ length: PENCERE_BOYUTU }, (_, i) =>
      girisOlustur(0.05, 20 + i),
    );
    const girisler = [...eskiToksikler, ...yeniTemizler];
    const sonuc = oruntuHesapla(girisler);
    expect(sonuc.toplamGiris).toBe(PENCERE_BOYUTU);
    expect(sonuc.toksikSayisi).toBe(0);
    expect(sonuc.mudahaleGerekli).toBe(false);
  });
});
