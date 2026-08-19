import { describe, expect, it } from "vitest";
import {
  eslesenKural,
  sessizKuralEkle,
  sessizKuralSil,
  SessizKural,
} from "./sessiz-kurallar";

function kural(terim: string, id = terim): SessizKural {
  return { id, terim, olusturulmaTarihi: 0 };
}

describe("eslesenKural", () => {
  it("hiç kural yoksa null döner", () => {
    expect(eslesenKural("herhangi bir metin", [])).toBeNull();
  });

  it("büyük/küçük harf duyarsız eşleşir", () => {
    const kurallar = [kural("N Haber")];
    expect(eslesenKural("bugün N HABER'de gördüm ki...", kurallar)?.terim).toBe(
      "N Haber",
    );
  });

  it("Türkçe karaktere duyarlı küçük harfe çevirir (İ/I)", () => {
    const kurallar = [kural("İstanbul")];
    expect(eslesenKural("istanbul'da hava güzel", kurallar)).not.toBeNull();
  });

  it("eşleşme yoksa null döner", () => {
    const kurallar = [kural("spor")];
    expect(eslesenKural("bugün kahvaltı yaptım", kurallar)).toBeNull();
  });

  it("ilk eşleşen kuralı döndürür", () => {
    const kurallar = [kural("ekonomi"), kural("kahvaltı")];
    expect(eslesenKural("bugün kahvaltı yaptım", kurallar)?.terim).toBe(
      "kahvaltı",
    );
  });
});

describe("sessizKuralEkle", () => {
  it("aynı terimi (case-insensitive) tekrar eklemez", () => {
    let kurallar: SessizKural[] = [];
    kurallar = sessizKuralEkle(kurallar, "N Spor");
    kurallar = sessizKuralEkle(kurallar, "n spor");
    expect(kurallar).toHaveLength(1);
  });

  it("boş/whitespace terimi eklemez", () => {
    let kurallar: SessizKural[] = [];
    kurallar = sessizKuralEkle(kurallar, "   ");
    expect(kurallar).toHaveLength(0);
  });

  it("geçerli bir terimi ekler", () => {
    const kurallar = sessizKuralEkle([], "reklam");
    expect(kurallar).toHaveLength(1);
    expect(kurallar[0].terim).toBe("reklam");
  });
});

describe("sessizKuralSil", () => {
  it("verilen id'li kuralı siler, diğerlerini korur", () => {
    const kurallar = [kural("a", "1"), kural("b", "2")];
    const guncel = sessizKuralSil(kurallar, "1");
    expect(guncel).toHaveLength(1);
    expect(guncel[0].id).toBe("2");
  });
});
