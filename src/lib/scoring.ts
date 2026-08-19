/**
 * scoring.ts
 * ===========
 * "Akış Aynası" — tarayıcıda (client-side) çalışan TF-IDF + Lojistik Regresyon
 * skorlayıcı. Bu dosya, `scripts/train_model.py` içindeki Python tokenizer/
 * TF-IDF mantığını BİREBİR aynı şekilde yeniden uygular. İki taraf da
 * uyuşmazsa `public/model/toksisite-model.json` içindeki ağırlıklar yanlış
 * skorlar üretir — bu yüzden her değişiklik iki dosyada birden yapılmalı.
 *
 * Gizlilik notu: Bu fonksiyonlar tamamen tarayıcıda çalışır. Kullanıcının
 * yazdığı metin hiçbir zaman bir sunucuya gönderilmez (KVKK-minimal mimari).
 */

export interface ToksisiteModelJson {
  meta: {
    isim: string;
    olusturulma_tarihi_utc: string;
    veri_kaynagi: string;
    algoritma: string;
    pozitif_sinif: string;
    kelime_sayisi: number;
    not: string;
  };
  vocab: string[];
  idf: number[];
  weights: number[];
  bias: number;
}

export interface LoadedModel {
  vocab: string[];
  idf: Float64Array;
  weights: Float64Array;
  bias: number;
  vocabIndex: Map<string, number>;
  meta: ToksisiteModelJson["meta"];
}

/** Türkçe'ye duyarlı küçük harfe çevirme (İ→i, I→ı) — Python train_model.py
 * içindeki turkish_lower() ile birebir aynı mantık. */
export function turkishLower(text: string): string {
  return text
    .replace(/İ/g, "i")
    .replace(/I/g, "ı")
    .toLowerCase()
    .normalize("NFC");
}

// Python tarafındaki _TOKEN_RE = re.compile(r"[a-z0-9çğıöşü]{2,}") ile aynı.
const TOKEN_RE = /[a-z0-9çğıöşü]{2,}/g;

/** @USER etiketi, URL ve noktalama temizlenmiş, Türkçe karakter destekli
 * tokenizer. */
export function tokenize(text: string): string[] {
  let t = turkishLower(text);
  t = t.replace(/https?:\/\/\S+/g, " ");
  t = t.replace(/@user\b/g, " ");
  const matches = t.match(TOKEN_RE);
  return matches ?? [];
}

export function buildLoadedModel(raw: ToksisiteModelJson): LoadedModel {
  const vocabIndex = new Map<string, number>();
  raw.vocab.forEach((w, i) => vocabIndex.set(w, i));
  return {
    vocab: raw.vocab,
    idf: Float64Array.from(raw.idf),
    weights: Float64Array.from(raw.weights),
    bias: raw.bias,
    vocabIndex,
    meta: raw.meta,
  };
}

export interface Katki {
  kelime: string;
  katki: number; // pozitif => toksisite olasılığını artırır, negatif => azaltır
}

export interface SkorSonucu {
  /** 0-1 arası toksisite olasılığı (P(OFF)) */
  skor: number;
  /** Metinde geçen ve model kelime dağarcığında bulunan kelimelerin
   * skora katkısı, |katki| büyüklüğüne göre azalan sırada. */
  katkilar: Katki[];
  /** Metindeki toplam token sayısı */
  tokenSayisi: number;
  /** Model kelime dağarcığında eşleşen (tanınan) token sayısı */
  taninanTokenSayisi: number;
}

/**
 * Bir metni skorlar. Python train_model.py'deki manuel doğrulama koduyla
 * (sublinear TF-IDF + L2 normalizasyon + sigmoid) birebir aynı hesaplamayı
 * yapar; eğitim betiğinde bu eşdeğerlik 200 test örneğiyle doğrulanmıştır
 * (bkz. docs/model-egitim-raporu.md, "Dışa aktarım doğrulaması").
 */
export function skorla(text: string, model: LoadedModel): SkorSonucu {
  const tokens = tokenize(text);
  const counts = new Map<number, number>();
  for (const t of tokens) {
    const idx = model.vocabIndex.get(t);
    if (idx !== undefined) {
      counts.set(idx, (counts.get(idx) ?? 0) + 1);
    }
  }

  const rawVals: { idx: number; val: number }[] = [];
  let normSq = 0;
  for (const [idx, count] of counts) {
    const tf = 1 + Math.log(count); // sublinear_tf=True
    const val = tf * model.idf[idx];
    rawVals.push({ idx, val });
    normSq += val * val;
  }
  const norm = Math.sqrt(normSq);

  let z = model.bias;
  const katkilar: Katki[] = [];
  for (const { idx, val } of rawVals) {
    const normVal = norm > 0 ? val / norm : 0;
    const katki = normVal * model.weights[idx];
    z += katki;
    katkilar.push({ kelime: model.vocab[idx], katki });
  }
  katkilar.sort((a, b) => Math.abs(b.katki) - Math.abs(a.katki));

  const skor = 1 / (1 + Math.exp(-z));

  return {
    skor,
    katkilar,
    tokenSayisi: tokens.length,
    taninanTokenSayisi: counts.size,
  };
}

/** Katkı listesinden en çok toksisiteyi ARTIRAN ilk N kelimeyi döndürür. */
export function enOlumsuzKatkilar(katkilar: Katki[], n = 5): Katki[] {
  return katkilar
    .filter((k) => k.katki > 0)
    .sort((a, b) => b.katki - a.katki)
    .slice(0, n);
}

/** Katkı listesinden toksisiteyi en çok AZALTAN ilk N kelimeyi döndürür. */
export function enOlumluKatkilar(katkilar: Katki[], n = 5): Katki[] {
  return katkilar
    .filter((k) => k.katki < 0)
    .sort((a, b) => a.katki - b.katki)
    .slice(0, n);
}
