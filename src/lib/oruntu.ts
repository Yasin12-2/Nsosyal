/**
 * oruntu.ts
 * ==========
 * "Örüntü paneli" ve "aktif müdahale" için saf (side-effect'siz) mantık.
 * JITAI (Just-in-Time Adaptive Intervention) felsefesinin sadeleştirilmiş
 * bir uygulaması: son N girdinin ne kadarı toksisite eşiğini aşıyor, ve bu
 * oran belirli bir sınırı geçtiğinde nazik bir farkındalık önerisi tetikler.
 *
 * Tasarım kararı: eşik/oran/pencere sabitleri BURADA, tek bir yerde
 * tanımlanır ki UI ile testler arasında tutarsızlık olmasın.
 */

import { AkisGirisi } from "./types";

/** Bir girdinin "toksik/olumsuz" sayılması için skor eşiği. */
export const TOKSIK_ESIK = 0.5;

/** Örüntü/müdahale hesaplanırken bakılacak son girdi sayısı. */
export const PENCERE_BOYUTU = 10;

/** Müdahale önerisinin tetiklenmesi için gereken minimum toksik oran (bu değerin ÜZERİNDE). */
export const MUDAHALE_ORAN_ESIGI = 0.5;

/** Müdahale önerisi göstermeden önce gereken minimum girdi sayısı (çok az
 * veriyle yanlış alarm vermemek için). */
export const MIN_GIRIS_MUDAHALE = 3;

export interface OruntuSonucu {
  /** Pencerede değerlendirilen girdi sayısı (0..PENCERE_BOYUTU) */
  toplamGiris: number;
  /** Pencerede eşiği aşan (toksik sayılan) girdi sayısı */
  toksikSayisi: number;
  /** 0-1 arası toksik oran (toplamGiris=0 ise 0) */
  toksikOran: number;
  /** Aktif müdahale önerisi gösterilmeli mi? */
  mudahaleGerekli: boolean;
  /** Örüntü panelinde gösterilecek son N girdi (eskiden yeniye) */
  pencereGirisleri: AkisGirisi[];
}

/**
 * `girisler` en eski→en yeni sırada olmalı (storage.ts bu sırayla tutar).
 */
export function oruntuHesapla(girisler: AkisGirisi[]): OruntuSonucu {
  const pencereGirisleri = girisler.slice(-PENCERE_BOYUTU);
  const toplamGiris = pencereGirisleri.length;
  const toksikSayisi = pencereGirisleri.filter(
    (g) => g.skor >= TOKSIK_ESIK,
  ).length;
  const toksikOran = toplamGiris > 0 ? toksikSayisi / toplamGiris : 0;
  const mudahaleGerekli =
    toplamGiris >= MIN_GIRIS_MUDAHALE && toksikOran > MUDAHALE_ORAN_ESIGI;

  return {
    toplamGiris,
    toksikSayisi,
    toksikOran,
    mudahaleGerekli,
    pencereGirisleri,
  };
}
