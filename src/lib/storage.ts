/**
 * storage.ts
 * ===========
 * Akış Günlüğü girdilerini yalnızca tarayıcının localStorage'ında saklar.
 *
 * Neden localStorage (ve neden bir backend/veritabanı YOK)?
 * - KVKK yükünü sıfırlamak: gerçek kullanıcı verisi hiçbir sunucuya
 *   gönderilmiyor/depolanmıyor; her şey kullanıcının kendi cihazında kalıyor.
 * - Prototip kapsamında bir hesap/oturum sistemi gereksiz karmaşıklık katar
 *   (scope creep) — CLAUDE.md'deki "kapsam dışı" talimatına uygun.
 */

import { AkisGirisi } from "./types";

const STORAGE_KEY = "akis-aynasi:girisler:v1";
const MAX_GIRIS = 200; // localStorage şişmesin diye makul bir üst sınır

function localStorageMevcutMu(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function girisleriYukle(): AkisGirisi[] {
  if (!localStorageMevcutMu()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AkisGirisi[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function kaydet(girisler: AkisGirisi[]): void {
  if (!localStorageMevcutMu()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(girisler));
  } catch {
    // localStorage dolu/kapalı olabilir — sessizce yut, uygulama çökmesin.
  }
}

/** Yeni bir girdi ekler (en yeni en sonda tutulur) ve güncel listeyi döndürür. */
export function girisEkle(
  girisler: AkisGirisi[],
  yeniGiris: AkisGirisi,
): AkisGirisi[] {
  const guncel = [...girisler, yeniGiris].slice(-MAX_GIRIS);
  kaydet(guncel);
  return guncel;
}

/** Tek bir girdiyi siler. */
export function girisSil(girisler: AkisGirisi[], id: string): AkisGirisi[] {
  const guncel = girisler.filter((g) => g.id !== id);
  kaydet(guncel);
  return guncel;
}

/** Tüm günlüğü temizler. */
export function girisleriTemizle(): AkisGirisi[] {
  kaydet([]);
  return [];
}
