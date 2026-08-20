import { describe, it, expect } from "vitest";
import {
  sablonBenzerligiHesapla,
  normalizeAd,
  levenshteinMesafe,
  stringBenzerligi,
  adBenzerligiHesapla,
  ozSavunmaIfadeleriBul,
  taklitRiskiHesapla,
  TANINMIS_ISIMLER,
} from "./guven-karti";

describe("sablonBenzerligiHesapla", () => {
  it("2'den az metinle karşılaştırma yapmaz", () => {
    const sonuc0 = sablonBenzerligiHesapla([]);
    expect(sonuc0.uyariSeviyesi).toBe("yok");
    expect(sonuc0.enYuksekCift).toBeNull();

    const sonuc1 = sablonBenzerligiHesapla(["tek başına bir metin"]);
    expect(sonuc1.uyariSeviyesi).toBe("yok");
  });

  it("boş/whitespace metinleri filtreler", () => {
    const sonuc = sablonBenzerligiHesapla(["  ", "", "gerçek bir metin"]);
    expect(sonuc.uyariSeviyesi).toBe("yok");
  });

  it("birebir aynı iki metin için benzerlik ~1 ve seviye yüksek olur", () => {
    const metin = "Bugün harika bir gün geçirdim herkese selamlar";
    const sonuc = sablonBenzerligiHesapla([metin, metin]);
    expect(sonuc.enYuksekCift?.benzerlik).toBeCloseTo(1, 5);
    expect(sonuc.uyariSeviyesi).toBe("yuksek");
  });

  it("tamamen alakasız iki metin için benzerlik düşük olur", () => {
    const sonuc = sablonBenzerligiHesapla([
      "kedi köpek balık deniz yaz tatili plaj güneş",
      "ekonomi borsa faiz döviz kur enflasyon bütçe",
    ]);
    expect(sonuc.enYuksekCift?.benzerlik).toBeLessThan(
      sonuc.uyariSeviyesi === "yuksek" ? 1 : 0.7,
    );
    expect(sonuc.uyariSeviyesi).not.toBe("yuksek");
  });

  it("üç metin arasında en yüksek çifti doğru bulur", () => {
    const a = "kampanyaya katıl hemen şimdi tıkla kazan";
    const b = "kampanyaya katıl hemen şimdi tıkla kazan bugün";
    const c = "bugün hava çok güzel yürüyüşe çıktım";
    const sonuc = sablonBenzerligiHesapla([a, b, c]);
    expect(sonuc.enYuksekCift?.aIndex).toBe(0);
    expect(sonuc.enYuksekCift?.bIndex).toBe(1);
    expect(sonuc.ciftler).toHaveLength(3);
  });
});

describe("normalizeAd / levenshteinMesafe / stringBenzerligi", () => {
  it("normalizeAd noktalama ve fazla boşlukları temizler", () => {
    expect(normalizeAd("  Elon  Musk!! ")).toBe("elon musk");
  });

  it("levenshteinMesafe aynı string için 0 döner", () => {
    expect(levenshteinMesafe("abc", "abc")).toBe(0);
  });

  it("levenshteinMesafe tek karakter farkını doğru sayar", () => {
    expect(levenshteinMesafe("elon musk", "elonn musk")).toBe(1);
  });

  it("stringBenzerligi özdeş stringler için 1 döner", () => {
    expect(stringBenzerligi("galatasaray", "galatasaray")).toBe(1);
  });

  it("stringBenzerligi çok farklı stringler için düşük değer döner", () => {
    expect(stringBenzerligi("apple", "zzzzzzzzzz")).toBeLessThan(0.3);
  });
});

describe("adBenzerligiHesapla", () => {
  it("listede yer alan bir isimle birebir eşleşirse benzerlik 1'e yakın olur", () => {
    const sonuc = adBenzerligiHesapla("Elon Musk");
    expect(sonuc.enYakinIsim).toBe("Elon Musk");
    expect(sonuc.benzerlik).toBeGreaterThan(0.95);
  });

  it("hafif yazım farkı olan isimlerde yine yüksek benzerlik bulur", () => {
    const sonuc = adBenzerligiHesapla("El0n Musk");
    expect(sonuc.enYakinIsim).toBe("Elon Musk");
    expect(sonuc.benzerlik).toBeGreaterThan(0.7);
  });

  it("eklemeli adlarda (ör. 'X hayranı') alt-dize güçlendirmesiyle yüksek benzerlik bulur", () => {
    const sonuc = adBenzerligiHesapla("Elon Musk Hayranı Sayfası");
    expect(sonuc.enYakinIsim).toBe("Elon Musk");
    expect(sonuc.benzerlik).toBeGreaterThanOrEqual(0.85);
  });

  it("alakasız bir isim için düşük benzerlik döner", () => {
    const sonuc = adBenzerligiHesapla("Zzqvwxy Plmnop");
    expect(sonuc.benzerlik).toBeLessThan(0.5);
  });

  it("boş profil adı için benzerlik 0 döner", () => {
    const sonuc = adBenzerligiHesapla("   ");
    expect(sonuc.benzerlik).toBe(0);
  });

  it("isim listesi 20-40 arası, elle derlenmiş makul boyutta", () => {
    expect(TANINMIS_ISIMLER.length).toBeGreaterThanOrEqual(20);
    expect(TANINMIS_ISIMLER.length).toBeLessThanOrEqual(40);
  });
});

describe("ozSavunmaIfadeleriBul", () => {
  it("bilinen bir öz-savunma kalıbını yakalar", () => {
    const bulunanlar = ozSavunmaIfadeleriBul(
      "Kesinlikle sahte bir hesap değildir, buna gönül rahatlığıyla inanabilirsiniz :)",
    );
    expect(bulunanlar.length).toBeGreaterThan(0);
  });

  it("sıradan bir biyografide hiçbir kalıp bulmaz", () => {
    const bulunanlar = ozSavunmaIfadeleriBul(
      "Yazılım geliştirici, kahve ve kitap sever.",
    );
    expect(bulunanlar).toHaveLength(0);
  });

  it("boş biyografi için boş dizi döner", () => {
    expect(ozSavunmaIfadeleriBul("")).toEqual([]);
  });
});

describe("taklitRiskiHesapla", () => {
  it("tanınmış isme çok benzeyen + öz-savunma içeren + doğrulanmamış profil için yüksek risk üretir", () => {
    const sonuc = taklitRiskiHesapla({
      profilAdi: "Elon Musk",
      biyografi:
        "Kesinlikle sahte bir hesap değildir, buna gönül rahatlığıyla inanabilirsiniz :)",
      dogrulamaRozetiVarMi: false,
    });
    expect(sonuc.seviye).toBe("yuksek");
    expect(sonuc.skor).toBeGreaterThan(0.6);
    const tutarsizlik = sonuc.sinyaller.find(
      (s) => s.anahtar === "dogrulama_tutarsizligi",
    );
    expect(tutarsizlik?.tetiklendiMi).toBe(true);
  });

  it("doğrulama rozeti işaretlenirse tutarsızlık sinyali tetiklenmez", () => {
    const sonuc = taklitRiskiHesapla({
      profilAdi: "Elon Musk",
      biyografi: "Girişimci.",
      dogrulamaRozetiVarMi: true,
    });
    const tutarsizlik = sonuc.sinyaller.find(
      (s) => s.anahtar === "dogrulama_tutarsizligi",
    );
    expect(tutarsizlik?.tetiklendiMi).toBe(false);
  });

  it("sıradan, tanınmayan bir profil için düşük risk üretir", () => {
    const sonuc = taklitRiskiHesapla({
      profilAdi: "Ayşe Yılmaz",
      biyografi: "Öğretmen, iki çocuk annesi.",
      dogrulamaRozetiVarMi: false,
    });
    expect(sonuc.seviye).toBe("dusuk");
  });

  it("her sinyal için ayrı, görünür bir açıklama üretir", () => {
    const sonuc = taklitRiskiHesapla({
      profilAdi: "Galatasaray",
      biyografi: "Resmi hesabımdır.",
      dogrulamaRozetiVarMi: false,
    });
    expect(sonuc.sinyaller).toHaveLength(3);
    for (const sinyal of sonuc.sinyaller) {
      expect(sinyal.aciklama.length).toBeGreaterThan(0);
    }
  });

  it("skor her zaman 0-1 arasındadır", () => {
    const sonuc = taklitRiskiHesapla({
      profilAdi: "Elon Musk",
      biyografi:
        "Sahte hesap değildir, gerçek hesap, resmi değildir ama inanabilirsiniz, bot değilim, taklit değil.",
      dogrulamaRozetiVarMi: false,
    });
    expect(sonuc.skor).toBeGreaterThanOrEqual(0);
    expect(sonuc.skor).toBeLessThanOrEqual(1);
  });
});
