import { describe, it, expect } from "vitest";
import {
  turkishLower,
  tokenize,
  buildLoadedModel,
  skorla,
  enOlumsuzKatkilar,
  enOlumluKatkilar,
  ToksisiteModelJson,
} from "./scoring";

describe("turkishLower", () => {
  it("Türkçe büyük İ/I harflerini doğru küçültür", () => {
    expect(turkishLower("İSTANBUL")).toBe("istanbul");
    expect(turkishLower("IĞDIR")).toBe("ığdır");
  });

  it("standart karakterleri de küçültür", () => {
    expect(turkishLower("MERHABA Dünya")).toBe("merhaba dünya");
  });
});

describe("tokenize", () => {
  it("@USER etiketlerini ve URL'leri temizler", () => {
    const toks = tokenize("@USER bak şu linke http://example.com/x çok kötü");
    expect(toks).not.toContain("user");
    expect(toks.some((t) => t.includes("http"))).toBe(false);
    expect(toks).toContain("kötü");
  });

  it("tek karakterli tokenları eler", () => {
    const toks = tokenize("a b cd e");
    expect(toks).toEqual(["cd"]);
  });

  it("Türkçe karakterleri korur", () => {
    const toks = tokenize("çğıöşü test");
    expect(toks).toContain("çğıöşü");
  });
});

describe("skorla", () => {
  // Küçük, elle kurgulanmış sentetik bir model: sadece 3 kelime.
  // "kötü" ve "rezalet" pozitif (toksisiteyi artıran), "harika" negatif ağırlıklı.
  const testModel: ToksisiteModelJson = {
    meta: {
      isim: "test-model",
      olusturulma_tarihi_utc: "2026-01-01T00:00:00Z",
      veri_kaynagi: "test",
      algoritma: "test",
      pozitif_sinif: "OFF",
      kelime_sayisi: 3,
      not: "test",
    },
    vocab: ["kötü", "rezalet", "harika"],
    idf: [1.5, 2.0, 1.2],
    weights: [2.0, 3.0, -2.5],
    bias: -0.5,
  };
  const model = buildLoadedModel(testModel);

  it("bilinmeyen kelimelerden oluşan metin için nötr bir skor üretir (sigmoid(bias))", () => {
    const sonuc = skorla("bilinmeyen kelimeler burada", model);
    const beklenen = 1 / (1 + Math.exp(-testModel.bias));
    expect(sonuc.skor).toBeCloseTo(beklenen, 10);
    expect(sonuc.katkilar).toHaveLength(0);
  });

  it("toksik kelime içeren metin için skor 0.5'in üzerine çıkar", () => {
    const sonuc = skorla("bu adam tam bir rezalet", model);
    expect(sonuc.skor).toBeGreaterThan(0.5);
    expect(sonuc.katkilar.length).toBeGreaterThan(0);
    expect(sonuc.katkilar[0].kelime).toBe("rezalet");
    expect(sonuc.katkilar[0].katki).toBeGreaterThan(0);
  });

  it("olumlu kelime içeren metin için skor düşer", () => {
    const sonuc = skorla("bu harika bir gün", model);
    expect(sonuc.skor).toBeLessThan(1 / (1 + Math.exp(-testModel.bias)));
    const katki = sonuc.katkilar.find((k) => k.kelime === "harika");
    expect(katki?.katki).toBeLessThan(0);
  });

  it("skor her zaman 0-1 arasındadır", () => {
    const sonuc = skorla("kötü rezalet kötü rezalet berbat kötü", model);
    expect(sonuc.skor).toBeGreaterThanOrEqual(0);
    expect(sonuc.skor).toBeLessThanOrEqual(1);
  });

  it("enOlumsuzKatkilar ve enOlumluKatkilar doğru ayrışır", () => {
    const sonuc = skorla("kötü ama harika bir rezalet", model);
    const olumsuz = enOlumsuzKatkilar(sonuc.katkilar);
    const olumlu = enOlumluKatkilar(sonuc.katkilar);
    expect(olumsuz.every((k) => k.katki > 0)).toBe(true);
    expect(olumlu.every((k) => k.katki < 0)).toBe(true);
  });
});
