/**
 * sessiz-kurallar.ts
 * ===================
 * "Garanti Sessizlik" — NSosyal'in kendi bildirim/sessize alma ayarlarının
 * güvenilmez olduğu belgelenmiş bir örüntü (bkz. docs/02-nsosyal-platform-
 * analizi-ve-pivot.md — Şikayetvar: 52+ şikayet, kullanıcılar susturduğu
 * kanallardan aylarca bildirim almaya devam ediyor). Bu modül, kullanıcının
 * tanımladığı kural (kelime/kaynak etiketi) her zaman VE YALNIZCA bu
 * cihazda, sunucu tarafı hiçbir ayara bağlı olmadan uygulanır — platformun
 * ayarı bozuk olsa bile kullanıcının sözü burada geçerli kalır.
 *
 * Bilinçli tasarım kararı: kurallar SUNUCUYA GÖNDERİLMEZ, yalnızca
 * localStorage'da tutulur (aynı KVKK-minimal mimari, bkz. storage.ts).
 */

const STORAGE_KEY = "akis-aynasi:sessiz-kurallar:v1";
const MAX_KURAL = 50;

export interface SessizKural {
  id: string;
  terim: string; // küçük harfe çevrilip karşılaştırılır (bkz. eslesiyorMu)
  olusturulmaTarihi: number;
}

function localStorageMevcutMu(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function sessizKurallariYukle(): SessizKural[] {
  if (!localStorageMevcutMu()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SessizKural[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function kaydet(kurallar: SessizKural[]): void {
  if (!localStorageMevcutMu()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(kurallar));
  } catch {
    // localStorage dolu/kapalı olabilir — sessizce yut.
  }
}

export function sessizKuralEkle(
  kurallar: SessizKural[],
  terim: string,
): SessizKural[] {
  const temiz = terim.trim();
  if (!temiz) return kurallar;
  // Aynı terim zaten varsa tekrar ekleme (case-insensitive).
  const zatenVar = kurallar.some(
    (k) => k.terim.toLocaleLowerCase("tr") === temiz.toLocaleLowerCase("tr"),
  );
  if (zatenVar) return kurallar;
  const yeni: SessizKural = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    terim: temiz,
    olusturulmaTarihi: Date.now(),
  };
  const guncel = [...kurallar, yeni].slice(-MAX_KURAL);
  kaydet(guncel);
  return guncel;
}

export function sessizKuralSil(
  kurallar: SessizKural[],
  id: string,
): SessizKural[] {
  const guncel = kurallar.filter((k) => k.id !== id);
  kaydet(guncel);
  return guncel;
}

/** Bir metnin, kural listesindeki herhangi bir terimi içerip içermediğini
 * (case-insensitive, Türkçe'ye duyarlı) kontrol eder. Basit `includes`
 * kullanılıyor — MVP kapsamında kelime sınırı/regex karmaşıklığına
 * girilmedi, kasıtlı olarak dar tutuldu. */
export function eslesenKural(
  metin: string,
  kurallar: SessizKural[],
): SessizKural | null {
  if (kurallar.length === 0) return null;
  const kucukMetin = metin.toLocaleLowerCase("tr");
  for (const kural of kurallar) {
    if (kucukMetin.includes(kural.terim.toLocaleLowerCase("tr"))) {
      return kural;
    }
  }
  return null;
}
