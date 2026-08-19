import { Katki } from "./scoring";

/** Akış Günlüğü'ne eklenen tek bir girdi (kullanıcının yapıştırdığı metin +
 * skorlama sonucu). Yalnızca tarayıcının localStorage'ında tutulur. */
export interface AkisGirisi {
  id: string;
  metin: string;
  /** epoch ms */
  zamanDamgasi: number;
  skor: number;
  katkilar: Katki[];
  tokenSayisi: number;
  taninanTokenSayisi: number;
}
