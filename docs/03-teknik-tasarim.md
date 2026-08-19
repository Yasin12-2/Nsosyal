# Teknik Tasarım — "Akış Aynası" (çalışma günlüğü)

## Gün 1 — 19 Ağustos 2026

### Amaç ve kapsam
NSosyal İnovasyon Yarışması 2026, tema: **Sosyal Yapay Zekâ** (bkz. `docs/01-fikir-ve-tema-karari.md`). MVP kapsamı bilinçli olarak dar tutuldu: gerçek platform API entegrasyonu (Instagram/TikTok/X), kullanıcı hesabı/login, sunucu tarafı veritabanı **YOK**. Her şey istemci tarafında (client-side) çalışıyor, veri yalnızca `localStorage`'da tutuluyor.

### Mimari kararlar

**1) Neden client-side model (sunucu değil)?**
Ekibin önceki projesindeki (Bağımlılıkla Mücadele) KVKK-minimal mimari felsefesi buraya taşındı: kullanıcının yazdığı/yapıştırdığı metin hiçbir zaman ağa gönderilmiyor. Bunu teknik olarak mümkün kılmak için model, sınıflandırma ağırlıklarını (TF-IDF kelime dağarcığı + IDF + Lojistik Regresyon katsayıları) küçük bir JSON dosyasına aktarıp tarayıcıda saf TypeScript ile yeniden hesaplıyor — harici bir ML runtime (TF.js/ONNX) gerekmedi, çünkü lojistik regresyon zaten basit bir ağırlıklı toplam + sigmoid işlemi.

**2) Neden OffensEval-TR 2020 veri seti?**
- Gerçek, hakemli akademik yayına dayanıyor (Çöltekin, 2020, LREC) — uydurma/kaynaksız veri değil.
- CC-BY lisanslı, halka açık (`https://coltekin.github.io/offensive-turkish/offenseval2020-turkish.zip`).
- Türkçe, ikili (OFF/NOT) etiketli, ~35K satır — 5 günlük sprint için boyutu ideal (dakikalar içinde eğitilebiliyor).
- Ayrıntı ve gerçek metrikler: `docs/model-egitim-raporu.md` (otomatik üretilen, elle düzenlenmemiş).

**3) Neden iki model (Tam Model + Kompakt Model)?**
Tam model (19.195 kelime) referans/karşılaştırma amaçlı; tarayıcıya göndermek için 4000 kelimeye budanmış Kompakt Model kullanılıyor (dosya boyutu ~185KB). Performans kaybı ihmal edilebilir (accuracy 0.7959 → 0.7846). Dışa aktarım, Python `predict_proba` ile TS uygulaması arasında 200 test örneğinde **maksimum 0.00000000 fark** ile doğrulandı — JSON'a yazılan sayılar tarayıcıda birebir aynı skorları üretiyor.

**4) Tokenizer eşdeğerliği (kritik risk noktası)**
Python (`scripts/train_model.py`) ve TypeScript (`src/lib/scoring.ts`) tarafında tokenizasyon/TF-IDF hesaplaması BİREBİR aynı mantıkla (Türkçe'ye duyarlı küçük harfe çevirme, `@USER`/URL temizleme, aynı regex) uygulandı. Bu iki taraf uyuşmazsa model skorları anlamsızlaşır — ileride biri değişirse diğeri de güncellenmeli (kod içi yorumlarla işaretlendi).

### Bileşen yapısı
- `src/lib/model.ts` — model JSON'unu `fetch` ile indirir, `LoadedModel`'e dönüştürür.
- `src/lib/scoring.ts` — tokenizer + TF-IDF + skorlama + açıklanabilirlik (kelime-katkı) mantığı.
- `src/lib/oruntu.ts` — girdi geçmişinden zaman-içi örüntü (toksik oran, müdahale eşiği) hesaplar.
- `src/lib/storage.ts` — localStorage okuma/yazma (girdi ekleme/silme/temizleme).
- `src/lib/demo-veri.ts` — kurgusal, elle yazılmış örnek cümleler (gerçek kullanıcı verisi DEĞİL — bkz. dosya içi not).
- `src/components/akis/` — `GirisFormu`, `GirisKarti`, `OruntuPaneli`, `SkorRozeti`, `MudahaleBanner` (damgalamayan, seçimi kullanıcıda bırakan dil — bkz. bileşen içi yorum).
- `src/app/akis/page.tsx` — Akış Günlüğü sayfası (ana etkileşim yüzeyi).
- `src/app/hakkinda/page.tsx` — proje/model açıklaması.

### Şeffaflık katmanı
Lojistik regresyon doğrusal bir model olduğu için her kelimenin skora katkısı **tam olarak** hesaplanabiliyor (`enOlumsuzKatkilar`/`enOlumluKatkilar`, `scoring.ts`). Bu, kara kutu bir YZ açıklaması değil, gerçek/tam açıklanabilirlik — önceki projedeki "Neden bu öneriyi gördüm?" katmanının doğal, teknik olarak daha güçlü bir devamı.

### Kalite kapıları (bu oturumda doğrulandı)
| Kapı | Sonuç |
|---|---|
| `npx tsc --noEmit` | 0 hata |
| `npx eslint .` | 0 hata (1 kaçak `eslint-disable` konumu düzeltildi — bkz. aşağı) |
| `npx vitest run` | 16/16 test geçti (`oruntu.test.ts`, `scoring.test.ts`) |
| `npx next build` | Başarılı, 4 route statik üretildi (`/`, `/akis`, `/hakkinda`, `/_not-found`) |

**Düzeltilen kusur:** `src/app/akis/page.tsx`'te `react-hooks/set-state-in-effect` için konan `eslint-disable-next-line` yorumu, gerçek ihlal satırının değil `useEffect(() => {` satırının hemen üzerine konmuştu (bu yüzden hem "unused directive" uyarısı hem de gerçek hata birlikte çıkıyordu). Yorum, gerçek `setGirisler(girisleriYukle())` satırının hemen üzerine taşınarak düzeltildi.

### Bilinen sınırlamalar / sonraki adımlar (dürüst beyan, rapora aktarılacak)
- Gerçek platform API entegrasyonu yok — kullanıcı içeriği manuel yapıştırıyor veya demo veriyle dolduruyor. Sonraki adım: tarayıcı uzantısı ile otomatik yakalama.
- Model 2020 tarihli veriyle eğitildi; güncel argo/slang'i tam yakalamayabilir. Sonraki adım: periyodik yeniden eğitim.
- İkili sınıflandırma (toksik/değil); ince taneli duygu analizi (öfke/kaygı/üzüntü) yok — kapsam kasıtlı olarak dar tutuldu.
- Tek veri setiyle eğitildi, farklı platform/bağlamlarda genelleme test edilmedi.

### Git
Bu klasöre özel, bağımsız bir git reposu (`.git`, ana Bağımlılık projesinden ayrı). İlk commit bu oturumda atılacak; sonraki oturumlarda anlamlı kilometre taşlarıyla devam edilecek. Uzak (GitHub) repo henüz bağlanmadı — kullanıcıdan bekleniyor (bkz. memory: `nsosyal_inovasyon_durum.md`).
