# Akış Aynası – Güven Kartı

**Takım Eşik** — NSosyal İnovasyon Yarışması 2026, Sosyal Yapay Zekâ teması.

NSosyal kullanıcılarının platformda karşılaştığı iki somut güven sorununa (bildirim/sessize alma
ayarlarının belgelenmiş biçimde güvenilmez çalışması ve taklit/kimlik riski taşıyan hesapların
şeffaf olmayan tespiti) yanıt veren, **tamamen istemci tarafında (client-side)** çalışan, sunucuya
hiçbir veri göndermeyen bir dijital güven katmanı.

Tam gerekçe, kanıt tabanı ve teknik detay için: **`NSosyal_Inovasyon_2026_-_Proje_Teknik_Raporu_1_u6IVb.pdf`**
(bu depoda, kök dizinde).

## Modüller

- **Akış Günlüğü** (`/akis`) — Türkçe toksisite sınıflandırıcısı (TF-IDF + Lojistik Regresyon,
  [OffensEval-TR 2020](https://www.aclweb.org/anthology/2020.lrec-1.758) ile eğitilmiş, tamamen
  tarayıcıda çalışır) + şeffaflık paneli ("Neden bu skoru gördüm?").
- **Garanti Sessizlik** — kullanıcı tanımlı kelime/kaynak kuralları, platformun kendi ayarından
  bağımsız, cihazda uygulanır.
- **Güven Kartı** (`/guven`) — şablon/spam benzerliği (TF-IDF kosinüs benzerliği) + taklit/kimlik
  riski göstergesi.

## Teknoloji yığını

Next.js 16 (App Router) · TypeScript · Tailwind CSS · model eğitimi çevrimdışı Python/scikit-learn,
tarayıcı çıkarımı saf TypeScript (harici ML çalışma zamanı yok).

## Kurulum ve çalıştırma

```bash
npm install
npm run dev        # http://localhost:3000
```

## Kalite kapıları

```bash
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run test       # vitest — 49/49 test
npm run build      # next build — statik derleme, 5 route
```

## Model eğitimi ve doğrulama

Otomatik üretilmiş, elle düzenlenmemiş eğitim raporu: [`docs/model-egitim-raporu.md`](docs/model-egitim-raporu.md)
— veri ön işleme, sınıf dengesizliği telafisi, overfitting kontrolü, precision/recall/karışıklık
matrisi ve Python↔TypeScript dışa aktarım doğrulaması (200 test örneğinde maksimum fark: 0,00000000).

## Geliştirme günlüğü ve karar gerekçeleri

[`docs/03-teknik-tasarim.md`](docs/03-teknik-tasarim.md) — her modülün neden bu şekilde
tasarlandığına dair gün gün loglanmış gerekçeler.
