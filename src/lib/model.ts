/**
 * model.ts
 * =========
 * Kompakt toksisite modelini (public/model/toksisite-model.json) tarayıcıda
 * yükleyip önbelleğe alır. Model dosyası bir `fetch()` ile YEREL statik
 * dosya sisteminden okunur — hiçbir dış sunucuya istek atılmaz, bu yüzden
 * jüri sunumu internetsiz ortamda da (Şanlıurfa) çalışır (`next build` +
 * `next start` ile üretilen statik/self-hosted çıktı yeterli).
 */

import { buildLoadedModel, LoadedModel, ToksisiteModelJson } from "./scoring";

let cachedModel: LoadedModel | null = null;
let inFlight: Promise<LoadedModel> | null = null;

export async function modeliYukle(): Promise<LoadedModel> {
  if (cachedModel) return cachedModel;
  if (inFlight) return inFlight;

  inFlight = (async () => {
    const res = await fetch("/model/toksisite-model.json", {
      cache: "force-cache",
    });
    if (!res.ok) {
      throw new Error(
        `Model dosyası yüklenemedi (HTTP ${res.status}). public/model/toksisite-model.json var mı?`,
      );
    }
    const raw = (await res.json()) as ToksisiteModelJson;
    const model = buildLoadedModel(raw);
    cachedModel = model;
    return model;
  })();

  try {
    return await inFlight;
  } finally {
    inFlight = null;
  }
}
