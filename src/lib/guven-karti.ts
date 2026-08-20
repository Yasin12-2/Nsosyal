/**
 * guven-karti.ts
 * ===============
 * "Güven Kartı" — mevcut toksisite sınıflandırıcısından TAMAMEN BAĞIMSIZ,
 * ikinci bir farkındalık modülü. Amaç: kullanıcının kendi elle yapıştırdığı
 * (1) birden fazla gönderi/hesap açıklaması metni arasındaki ŞABLON/SPAM
 * BENZERLİĞİNİ ve (2) tek bir profil adı + biyografi metnindeki TAKLİT/
 * KİMLİK RİSKİ sinyallerini hesaplar.
 *
 * Neden ayrı bir dosya (scoring.ts'e karışık değil)?
 * Bu modül farklı bir problem sınıfını çözüyor (benzerlik + isim eşleştirme,
 * eğitilmiş bir sınıflandırıcı DEĞİL) — ayrı dosyada tutmak hem test
 * edilebilirliği hem de "toksisite modeli" ile "güven kartı"nın birbirinden
 * bağımsız, birbirini bozmadan geliştirilebilir iki modül olduğunu netleştiriyor
 * (bkz. docs/07-gece-sentezi-oneri.md: "mevcut modüllere DOKUNMA").
 *
 * Gizlilik/etik notu: Tüm hesaplamalar tarayıcıda çalışır, hiçbir metin
 * sunucuya gönderilmez. NSosyal'den otomatik veri çekme YOKTUR — kullanıcı
 * metni kendi elle yapıştırır. Sonuçlar KESİN İDDİA değil, dikkat çekici
 * SİNYAL/FARKINDALIK notlarıdır ("bu bir bot/sahte hesaptır" gibi ölçülemez
 * iddialar kurulmaz).
 */

import { tokenize, turkishLower } from "./scoring";

/* ------------------------------------------------------------------------
 * 1) Şablon/Spam Benzerliği — TF-IDF cosine similarity
 * ---------------------------------------------------------------------- */

export interface SablonBenzerlikCifti {
  aIndex: number;
  bIndex: number;
  benzerlik: number; // 0-1 arası kosinüs benzerliği
}

export type SablonUyariSeviyesi = "yok" | "dusuk" | "orta" | "yuksek";

export interface SablonBenzerlikSonucu {
  /** Girilen tüm ikili karşılaştırmaların ortalaması (0-1). Karşılaştırma
   * yapılamıyorsa (2'den az metin) 0. */
  ortalamaBenzerlik: number;
  /** En yüksek benzerliğe sahip çift; karşılaştırma yoksa null. */
  enYuksekCift: SablonBenzerlikCifti | null;
  /** Tüm ikili çiftler, benzerliğe göre azalan sırada. */
  ciftler: SablonBenzerlikCifti[];
  uyariSeviyesi: SablonUyariSeviyesi;
}

/** "Kalıp/şablon içerik olabilir" farkındalık notunun tetiklendiği orta eşik. */
export const SABLON_BENZERLIK_ESIK_ORTA = 0.45;
/** Güçlü bir kalıp/şablon farkındalık notunun tetiklendiği üst eşik. */
export const SABLON_BENZERLIK_ESIK_YUKSEK = 0.7;

function kosinusBenzerligi(
  a: Map<string, number>,
  b: Map<string, number>,
): number {
  const [kucuk, buyuk] = a.size <= b.size ? [a, b] : [b, a];
  let toplam = 0;
  for (const [terim, deger] of kucuk) {
    const digerDeger = buyuk.get(terim);
    if (digerDeger !== undefined) toplam += deger * digerDeger;
  }
  return toplam;
}

/**
 * Girilen metinler arasında TF-IDF tabanlı kosinüs benzerliği hesaplar.
 * Mevcut `scoring.ts`'teki tokenizer'ı (aynı Türkçe küçük harfe çevirme +
 * @USER/URL temizleme kuralları) yeniden kullanır; IDF burada eğitilmiş bir
 * modelden değil, YALNIZCA girilen metinlerin kendi oluşturduğu küçük
 * korpustan (kaç metinde geçtiği) hesaplanır — bu, önceden eğitilmiş bir
 * modele ihtiyaç duymadan herhangi bir metin kümesini karşılaştırabilmeyi
 * sağlar.
 */
export function sablonBenzerligiHesapla(
  metinler: string[],
): SablonBenzerlikSonucu {
  const gecerliMetinler = metinler.map((m) => m.trim()).filter(Boolean);
  if (gecerliMetinler.length < 2) {
    return {
      ortalamaBenzerlik: 0,
      enYuksekCift: null,
      ciftler: [],
      uyariSeviyesi: "yok",
    };
  }

  const tokenListeleri = gecerliMetinler.map((m) => tokenize(m));
  const belgeSayisi = tokenListeleri.length;

  const df = new Map<string, number>();
  for (const tokens of tokenListeleri) {
    for (const terim of new Set(tokens)) {
      df.set(terim, (df.get(terim) ?? 0) + 1);
    }
  }

  const idf = new Map<string, number>();
  for (const [terim, dfSayisi] of df) {
    // sklearn'deki "smooth" IDF ile aynı formül (train_model.py ile tutarlı ruh).
    idf.set(terim, Math.log((1 + belgeSayisi) / (1 + dfSayisi)) + 1);
  }

  const vektorler = tokenListeleri.map((tokens) => {
    const sayimlar = new Map<string, number>();
    for (const t of tokens) sayimlar.set(t, (sayimlar.get(t) ?? 0) + 1);

    const vektor = new Map<string, number>();
    let normKare = 0;
    for (const [terim, sayi] of sayimlar) {
      const tf = 1 + Math.log(sayi); // sublinear tf — scoring.ts ile tutarlı
      const deger = tf * (idf.get(terim) ?? 0);
      vektor.set(terim, deger);
      normKare += deger * deger;
    }
    const norm = Math.sqrt(normKare);
    if (norm > 0) {
      for (const [terim, deger] of vektor) vektor.set(terim, deger / norm);
    }
    return vektor;
  });

  const ciftler: SablonBenzerlikCifti[] = [];
  for (let i = 0; i < vektorler.length; i++) {
    for (let j = i + 1; j < vektorler.length; j++) {
      ciftler.push({
        aIndex: i,
        bIndex: j,
        benzerlik: kosinusBenzerligi(vektorler[i], vektorler[j]),
      });
    }
  }
  ciftler.sort((a, b) => b.benzerlik - a.benzerlik);

  const ortalamaBenzerlik =
    ciftler.reduce((toplam, c) => toplam + c.benzerlik, 0) / ciftler.length;
  const enYuksekCift = ciftler[0] ?? null;
  const enYuksekDeger = enYuksekCift?.benzerlik ?? 0;

  const uyariSeviyesi: SablonUyariSeviyesi =
    enYuksekDeger >= SABLON_BENZERLIK_ESIK_YUKSEK
      ? "yuksek"
      : enYuksekDeger >= SABLON_BENZERLIK_ESIK_ORTA
        ? "orta"
        : "dusuk";

  return { ortalamaBenzerlik, enYuksekCift, ciftler, uyariSeviyesi };
}

/* ------------------------------------------------------------------------
 * 2) Taklit/Kimlik Riski Göstergesi
 * ---------------------------------------------------------------------- */

/**
 * Küçük, elle derlenmiş, NÖTR ve kamuya mâl olmuş isim/marka listesi.
 * SADECE isim benzerliği hesaplamak için referans olarak kullanılır — bu
 * kişilerin/markaların NSosyal'de gerçekten taklit edildiğine dair bir iddia
 * İÇERMEZ, hiçbiri belirli bir gerçek hesabı hedef almaz. Kasıtlı olarak
 * siyasi figürler/itibar riski taşıyan isimler DIŞLANDI (bkz.
 * docs/03-teknik-tasarim.md, Gün 2 kararı).
 */
export const TANINMIS_ISIMLER: readonly string[] = [
  // Küresel kişiler
  "Elon Musk",
  "Bill Gates",
  "Cristiano Ronaldo",
  "Lionel Messi",
  "Taylor Swift",
  "Selena Gomez",
  "Leonardo DiCaprio",
  "Emma Watson",
  "Neymar Jr",
  "Roger Federer",
  // Küresel markalar
  "Apple",
  "Google",
  "Microsoft",
  "Nike",
  "Adidas",
  "Coca-Cola",
  "Tesla",
  "Amazon",
  "Netflix",
  "Samsung",
  // Türkiye'den kişiler (nötr, spor/sanat — siyasi figür yok)
  "Arda Güler",
  "Hakan Çalhanoğlu",
  "Burak Özçivit",
  "Kenan Sofuoğlu",
  "Demet Özdemir",
  "Tarkan",
  // Türkiye'den markalar
  "Galatasaray",
  "Fenerbahçe",
  "Beşiktaş",
  "Trabzonspor",
  "Turkcell",
  "Türk Hava Yolları",
  "Arçelik",
  "Ülker",
  "Trendyol",
  "Migros",
];

/** Öz-savunma amaçlı, sık gözlemlenen dil kalıpları (regex, küçük harfli
 * metin üzerinde çalışır — bkz. ozSavunmaIfadeleriBul). */
const OZ_SAVUNMA_KALIPLARI: { desen: RegExp; etiket: string }[] = [
  { desen: /sahte\s+(bir\s+)?hesap\s+de(ğ|g)il/u, etiket: '"sahte hesap değil" ifadesi' },
  { desen: /kesinlikle\s+sahte\s+de(ğ|g)il/u, etiket: '"kesinlikle sahte değil" ifadesi' },
  { desen: /ger(ç|c)ek\s+hesap/u, etiket: '"gerçek hesap" ifadesi' },
  { desen: /resmi\s+de(ğ|g)ildir/u, etiket: '"resmi değildir" ifadesi' },
  { desen: /resmi\s+hesab(ı|i)m(d(ı|i)r)?/u, etiket: '"resmi hesabım(dır)" ifadesi' },
  { desen: /inanabilirsiniz/u, etiket: '"inanabilirsiniz" ifadesi' },
  { desen: /bot\s+de(ğ|g)ilim/u, etiket: '"bot değilim" ifadesi' },
  { desen: /parodi\s+de(ğ|g)il/u, etiket: '"parodi değil" ifadesi' },
  { desen: /taklit\s+de(ğ|g)il/u, etiket: '"taklit değil" ifadesi' },
  { desen: /orijinal\s+hesap/u, etiket: '"orijinal hesap" ifadesi' },
  { desen: /gön(ü|u)l\s+rahatl(ı|i)(ğ|g)(ı|i)yla/u, etiket: '"gönül rahatlığıyla (inanabilirsiniz)" ifadesi' },
];

/** Bir biyografi metninde geçen öz-savunma dil kalıplarını (etiket listesi
 * olarak) döndürür. Tek başına "kanıt" değildir — sadece dikkat çekici bir
 * kalıptır (bkz. taklitRiskiHesapla açıklama metinleri). */
export function ozSavunmaIfadeleriBul(biyografi: string): string[] {
  if (!biyografi.trim()) return [];
  const metin = turkishLower(biyografi);
  return OZ_SAVUNMA_KALIPLARI.filter(({ desen }) => desen.test(metin)).map(
    ({ etiket }) => etiket,
  );
}

/** Bir ismi karşılaştırma için normalize eder: Türkçe küçük harfe çevirir,
 * yalnızca harf/rakam/boşluk bırakır, fazla boşlukları sadeleştirir. */
export function normalizeAd(ad: string): string {
  const kucuk = turkishLower(ad);
  const temiz = kucuk.replace(/[^a-z0-9çğıöşü\s]/g, " ");
  return temiz.replace(/\s+/g, " ").trim();
}

/** İki string arasındaki Levenshtein (düzenleme) mesafesi. */
export function levenshteinMesafe(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  let onceki = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const simdiki = [i];
    for (let j = 1; j <= n; j++) {
      const maliyet = a[i - 1] === b[j - 1] ? 0 : 1;
      simdiki[j] = Math.min(
        onceki[j] + 1, // silme
        simdiki[j - 1] + 1, // ekleme
        onceki[j - 1] + maliyet, // değiştirme
      );
    }
    onceki = simdiki;
  }
  return onceki[n];
}

/** 0 (hiç benzemiyor) ile 1 (birebir aynı) arasında normalize edilmiş
 * string benzerliği. */
export function stringBenzerligi(a: string, b: string): number {
  const maxUzunluk = Math.max(a.length, b.length);
  if (maxUzunluk === 0) return 1;
  return 1 - levenshteinMesafe(a, b) / maxUzunluk;
}

export interface AdBenzerlikSonucu {
  /** En yakın bulunan tanınmış isim/marka; eşleşme yoksa boş string. */
  enYakinIsim: string;
  /** 0-1 arası benzerlik. */
  benzerlik: number;
}

/** Girilen bir profil adını `TANINMIS_ISIMLER` listesindeki en yakın isme
 * göre puanlar (normalize edilmiş Levenshtein benzerliği + alt-dize içerme
 * güçlendirmesi, ör. "elon musk hayranı" gibi eklemeli adlar da yakalanır). */
export function adBenzerligiHesapla(profilAdi: string): AdBenzerlikSonucu {
  const normalizedProfil = normalizeAd(profilAdi);
  if (!normalizedProfil) return { enYakinIsim: "", benzerlik: 0 };

  let enIyi: AdBenzerlikSonucu = { enYakinIsim: "", benzerlik: 0 };
  for (const isim of TANINMIS_ISIMLER) {
    const normIsim = normalizeAd(isim);
    let benzerlik = stringBenzerligi(normalizedProfil, normIsim);
    if (
      normIsim.length >= 3 &&
      (normalizedProfil.includes(normIsim) || normIsim.includes(normalizedProfil))
    ) {
      benzerlik = Math.max(benzerlik, 0.85);
    }
    if (benzerlik > enIyi.benzerlik) {
      enIyi = { enYakinIsim: isim, benzerlik };
    }
  }
  return enIyi;
}

export type TaklitRiskSeviyesi = "dusuk" | "orta" | "yuksek";

export interface TaklitRiskiSinyali {
  anahtar: "ad_benzerligi" | "oz_savunma" | "dogrulama_tutarsizligi";
  baslik: string;
  aciklama: string;
  /** Bu sinyalin toplam skora ağırlıklı katkısı (0-1). */
  katki: number;
  tetiklendiMi: boolean;
}

export interface TaklitRiskiSonucu {
  skor: number; // 0-1
  seviye: TaklitRiskSeviyesi;
  sinyaller: TaklitRiskiSinyali[];
  enYakinIsim: string | null;
}

/** İsim benzerliğinin "yüksek" sayılacağı eşik (ör. tanınırlık iddiası). */
export const TAKLIT_AD_BENZERLIK_ESIGI = 0.72;

export interface TaklitRiskiGirdisi {
  profilAdi: string;
  biyografi: string;
  /** Kullanıcının beyanına dayalı: profilde doğrulama (mavi tik) rozeti
   * görünüyor mu? NSosyal'den otomatik çekilmez, kullanıcı işaretler. */
  dogrulamaRozetiVarMi: boolean;
}

/**
 * Üç sinyali (isim benzerliği, öz-savunma dil kalıpları, doğrulama
 * tutarsızlığı) birleştiren, AÇIKLANABİLİR bir taklit/kimlik riski skoru
 * üretir. Bu bir "bot/sahte hesap tespiti" DEĞİLDİR — kullanıcıya
 * etkileşime girmeden önce dikkate alabileceği bir farkındalık notudur.
 */
export function taklitRiskiHesapla(
  girdi: TaklitRiskiGirdisi,
): TaklitRiskiSonucu {
  const { profilAdi, biyografi, dogrulamaRozetiVarMi } = girdi;

  const adSonuc = profilAdi.trim()
    ? adBenzerligiHesapla(profilAdi)
    : { enYakinIsim: "", benzerlik: 0 };
  const adYuksekMi = adSonuc.benzerlik >= TAKLIT_AD_BENZERLIK_ESIGI;

  const ozSavunmalar = ozSavunmaIfadeleriBul(biyografi);
  const ozSavunmaSkoru = Math.min(1, ozSavunmalar.length / 2);

  const tutarsizlikVarMi = adYuksekMi && !dogrulamaRozetiVarMi;

  const adKatki = 0.5 * adSonuc.benzerlik;
  const ozSavunmaKatki = 0.3 * ozSavunmaSkoru;
  const tutarsizlikKatki = tutarsizlikVarMi ? 0.2 : 0;

  const skor = Math.min(1, adKatki + ozSavunmaKatki + tutarsizlikKatki);
  const seviye: TaklitRiskSeviyesi =
    skor >= 0.6 ? "yuksek" : skor >= 0.3 ? "orta" : "dusuk";

  const sinyaller: TaklitRiskiSinyali[] = [
    {
      anahtar: "ad_benzerligi",
      baslik: "İsim/marka benzerliği",
      aciklama: adSonuc.enYakinIsim
        ? `Girilen profil adı, tanınmış bir isim/marka listesindeki "${adSonuc.enYakinIsim}" ile yaklaşık %${Math.round(adSonuc.benzerlik * 100)} benziyor.`
        : "Profil adı girilmedi veya tanınmış isim listesiyle belirgin bir benzerlik bulunamadı.",
      katki: adKatki,
      tetiklendiMi: adYuksekMi,
    },
    {
      anahtar: "oz_savunma",
      baslik: "Öz-savunma dil kalıpları",
      aciklama:
        ozSavunmalar.length > 0
          ? `Biyografide şu ifade(ler) fark edildi: ${ozSavunmalar.join(", ")}. Bu tek başına bir kanıt değildir, ama gerçek hesapların çoğu kendini bu şekilde savunma ihtiyacı duymaz — dikkat çekici bir kalıptır.`
          : "Biyografide öz-savunma amaçlı bilinen bir dil kalıbı fark edilmedi.",
      katki: ozSavunmaKatki,
      tetiklendiMi: ozSavunmalar.length > 0,
    },
    {
      anahtar: "dogrulama_tutarsizligi",
      baslik: "Doğrulama/tanınırlık tutarsızlığı",
      aciklama: tutarsizlikVarMi
        ? "İsim, tanınmış bir isme/markaya belirgin biçimde benziyor ama hesapta doğrulama (mavi tik) rozeti olduğunu belirtmediniz. Gerçek, tanınmış hesaplar genelde doğrulanmış olur — bu bir tutarsızlık işareti olabilir."
        : "Bu sinyal yalnızca isim benzerliği yüksekken VE doğrulama rozeti işaretlenmemişken tetiklenir; şu an geçerli değil.",
      katki: tutarsizlikKatki,
      tetiklendiMi: tutarsizlikVarMi,
    },
  ];

  return { skor, seviye, sinyaller, enYakinIsim: adSonuc.enYakinIsim || null };
}
