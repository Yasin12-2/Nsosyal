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
Bu klasöre özel, bağımsız bir git reposu (`.git`, ana Bağımlılık projesinden ayrı). İlk commit bu oturumda atıldı. Uzak (GitHub) repo henüz bağlanmadı — kullanıcıdan bekleniyor (bkz. memory: `nsosyal_inovasyon_durum.md`).

## Gün 1, devam — Pivot: NSosyal'e kanıta dayalı bağlanma

Kullanıcı kritik bir düzeltme yaptı: NSosyal soyut bir tema değil, gerçek/yayında bir platform; yarışma bu platforma somut katkı istiyor. Detaylı araştırma ve karar gerekçesi: `docs/02-nsosyal-platform-analizi-ve-pivot.md`. Özet: NSosyal'in kendi bildirim/sessize alma ayarları belgelenmiş biçimde güvenilmez (Şikayetvar: 27/100 puan, 52+ bildirim/SMS şikayeti). Mevcut mimarinin ~%90'ı korunuyor, sadece çerçeveleme ve bir yeni özellik eklendi.

**Eklenen: "Garanti Sessizlik" (`src/lib/sessiz-kurallar.ts`, `src/components/akis/SessizKurallarPaneli.tsx`)**
- Kullanıcının tanımladığı kelime/kaynak etiketleri (ör. "N Spor"), sunucuya hiç gönderilmeden, yalnızca bu cihazda `localStorage`'da tutulur ve her girişte `eslesenKural()` ile kontrol edilir.
- Eşleşen girişler `GirisKarti`'de "🔇 Garanti sessizlik" etiketiyle görsel olarak işaretlenir (silinmiyor, sadece soluklaştırılıyor — kullanıcı isterse geri görebilir).
- Mimari gerekçe: platformun kendi ayarının çalışıp çalışmadığına bağımlı olmayan, her zaman tutarlı bir ikinci katman — Şikayetvar'daki "ayardan kapattım, gelmeye devam ediyor" örüntüsüne doğrudan teknik yanıt.
- 9 yeni test (`sessiz-kurallar.test.ts`) — eşleşme mantığı (case-insensitive, Türkçe karakter, tekrar eklenmeme, silme) kapsandı.

**Ana Sayfa / Hakkında sayfaları** NSosyal'e özel kanıt/istatistiklerle (Şikayetvar 27/100, kategori kırılımı) güncellendi; genel "sosyal medya kullanımı artıyor" çerçevesinden NSosyal'in kendi, kaynaklı sorununa geçildi.

**Kalite kapıları (tekrar doğrulandı):** `tsc` 0 hata, `eslint` 0 hata, `vitest` 25/25 (16→25, +9 yeni test), `next build` başarılı, 4 route.

## Gün 2 — 20 Ağustos 2026 (gece → sabah): "Güven Kartı" modülü

### Bağlam
Gece boyunca iki paralel araştırma yapıldı (`docs/05-derin-fikir-taramasi.md` — dış kaynak/rakip taraması; `docs/06-canli-hesap-bulgulari.md` — NSosyal'in kendi canlı hesabı üzerinden birincil kanıt taraması) ve tek bir nihai öneride birleştirildi (`docs/07-gece-sentezi-oneri.md`). Kullanıcı onayı: mevcut "Akış Aynası" fikri korunuyor, üzerine bağımsız yeni bir modül — **Güven Kartı** — ekleniyor. Mevcut modüllere (toksisite sınıflandırıcı, Akış Günlüğü, Garanti Sessizlik, şeffaflık katmanı) DOKUNULMADI.

**Kanıt zinciri (rapor anlatısı için):** NSosyal'in kurucusu ve resmi hesabı, taklit/sahte hesaplara karşı hassasiyet vaat ediyor (bkz. `docs/06`, §1.1); buna rağmen platformda uzun süredir askıya alınmamış, kendini ironik biçimde "sahte değil" diye tanımlayan taklit hesap örnekleri gözlemlendi (§1.2). Güven Kartı, bu vaat/gerçeklik boşluğuna kullanıcı tarafında yanıt veren, tamamen client-side bir farkındalık aracı.

### Eklenen modül: Güven Kartı

**1) Şablon/Spam Benzerliği** (`src/lib/guven-karti.ts` → `sablonBenzerligiHesapla`)
- Kullanıcının yapıştırdığı 2+ metin arasında TF-IDF tabanlı kosinüs benzerliği hesaplanır.
- **Teknik karar + gerekçe:** Mevcut `scoring.ts`'teki `tokenize`/`turkishLower` fonksiyonları AYNEN yeniden kullanıldı (kod tekrarı yok, tokenizasyon tutarlılığı korunuyor) — ama IDF, önceden eğitilmiş bir modelden değil, YALNIZCA girilen metinlerin oluşturduğu küçük korpustan hesaplanıyor. Böylece modül, eğitilmiş bir sınıflandırıcıya bağımlı olmadan HERHANGİ bir metin kümesini karşılaştırabiliyor — bu, "kendi eğitilmiş modelimiz + genel amaçlı benzerlik aracı" arasındaki bilinçli mimari ayrım.
- İkili karşılaştırmalar azalan benzerliğe göre sıralanıp en yüksek çift + ortalama gösteriliyor; eşikler (`SABLON_BENZERLIK_ESIK_ORTA=0.45`, `..._YUKSEK=0.7`) tek bir yerde sabit tanımlandı (mevcut `oruntu.ts`'teki "sabitler tek yerde" deseniyle tutarlı).
- **Dil kararı:** "Bu metinler birbirine olağandışı derecede benziyor, kalıp içerik olabilir" — "bu bir bot/spam" gibi kesin iddia YOK (damgalamayan dil ilkesi).

**2) Taklit/Kimlik Riski Göstergesi** (`src/lib/guven-karti.ts` → `taklitRiskiHesapla`)
- Üç açıklanabilir sinyali ağırlıklı olarak birleştirir: (a) isim/marka benzerliği (Levenshtein tabanlı, normalize edilmiş string benzerliği + alt-dize güçlendirmesi, ağırlık 0.5), (b) biyografideki öz-savunma dil kalıpları ("sahte değil", "gerçek hesap", "resmi değildir", "inanabilirsiniz" vb. — `docs/06`'daki gözlemlenen gerçek sinyalin genellemesi, ağırlık 0.3), (c) doğrulama/tanınırlık tutarsızlığı — kullanıcının kendi işaretlediği "doğrulama rozeti var mı?" checkbox'ı + yüksek isim benzerliği birlikte tetiklenirse (ağırlık 0.2).
- **Referans isim listesi (`TANINMIS_ISIMLER`, 36 örnek):** Küresel + yerli, nötr, kamuya mâl olmuş kişi/marka isimleri (ör. Elon Musk, Galatasaray, Turkcell). Kasıtlı olarak SİYASİ figürler ve gerçek/özel bir NSosyal hesabı (`@realelonmusk` gibi) İÇERMİYOR — bu sadece bizim araştırma kanıtımızdı, koda gerçek bir hesabı hedefleyen hiçbir sabit kod YAZILMADI. Liste yalnızca genel isim-benzerliği referansı; ürün herhangi bir profil metnini analiz eden GENEL bir araç.
- Her sinyalin skora katkısı ve gerekçesi ayrı ayrı, kullanıcıya görünür şekilde raporlanıyor (mevcut şeffaflık katmanı ilkesiyle birebir tutarlı — `GirisKarti.tsx`'teki "Neden bu skoru gördüm?" panelinin doğal devamı).
- **Dil kararı:** Sonuç bir "sahte hesap tespiti" değil, "dikkat düzeyi" (düşük/orta/yüksek) — ihbar aracı değil, kullanıcı farkındalığı aracı.

### Mimari/etik kısıtlar (uygulandı)
- Tamamen client-side, yeni backend/API/veritabanı yok.
- NSosyal'den otomatik veri çekme yok; kullanıcı metni/profil bilgisini kendi elle yapıştırıyor. Doğrulama rozeti bilgisi kullanıcı beyanına dayalı bir checkbox — otomatik çekilmiyor.
- **Kalıcılık kararı (Akış Günlüğü'nden bilinçli farklılık):** Güven Kartı girdileri localStorage'a KAYDEDİLMİYOR, yalnızca React state'inde (sekme ömrü boyunca) tutuluyor. Gerekçe: Akış Günlüğü kullanıcının KENDİ akışını saklarken, Güven Kartı sıklıkla BAŞKA bir profilin herkese açık metnini analiz ediyor — bu veriyi (yerel de olsa) kalıcı tutmamak, KVKK-minimal felsefeyi bir adım daha ileri taşıyan bilinçli bir tercih.

### Bileşen/dosya yapısı (yeni)
- `src/lib/guven-karti.ts` — TF-IDF benzerlik + isim benzerliği + öz-savunma kalıp eşleştirme + risk skoru birleştirme mantığı (saf fonksiyonlar, side-effect yok).
- `src/lib/guven-karti.test.ts` — 24 yeni test (benzerlik hesaplama, Levenshtein/string benzerliği, isim eşleştirme, öz-savunma kalıp tespiti, risk skoru birleştirme).
- `src/components/guven/SablonBenzerligiPaneli.tsx`, `TaklitRiskiPaneli.tsx`, `TaklitRiskRozeti.tsx` — mevcut `akis/` bileşen stiliyle (rozet + panel deseni, aynı Tailwind sınıfları/renk paleti) tutarlı.
- **Klasör kararı:** Bileşenler `src/components/akis/` yerine yeni `src/components/guven/` klasörüne kondu (mevcut `akis/` grubuyla aynı düzey, ayrı bir özellik grubu) — mevcut modüllere "dokunma" kısıtına en temiz uyum, ve iki modülün birbirinden bağımsız geliştirilebilir olduğunu dosya yapısında da netleştiriyor.
- **Sayfa kararı:** `/akis`'e gömülü bir bölüm yerine ayrı bir `/guven` sayfası açıldı. Gerekçe: (1) girdi şekli temelden farklı — Akış Günlüğü tek bir biriken "benim gördüğüm içerik" akışı, Güven Kartı çoklu metin/profil karşılaştırması; aynı sayfaya sıkıştırmak formu karmaşıklaştırırdı (UX önceliği: sadelik). (2) gizlilik çerçevesi farklı — biri kullanıcının kendi verisini, diğeri genelde başka bir profilin herkese açık metnini işliyor; bunu ayrı bir sayfa/URL olarak göstermek bu ayrımı kullanıcıya da netleştiriyor. `layout.tsx` navigasyonuna "Güven Kartı" linki eklendi.
- `src/app/hakkinda/page.tsx` ve `src/app/page.tsx`'e modülü tanıtan kısa, dürüst (sınırlamaları da belirten) bölümler eklendi.

### Kalite kapıları (sırayla, ayrı ayrı doğrulandı)
| Kapı | Sonuç |
|---|---|
| `npx tsc --noEmit` | 0 hata |
| `npx eslint .` | 0 hata |
| `npx vitest run` | 49/49 test geçti (25→49, +24 yeni test, `guven-karti.test.ts`) |
| `npx next build` | Başarılı, 5 route statik üretildi (`/`, `/akis`, `/guven`, `/hakkinda`, `/_not-found`) |

### Bilinen sınırlamalar (dürüst beyan, rapora aktarılacak)
- `TANINMIS_ISIMLER` listesi küçük (36 örnek) ve elle derlenmiş — kapsamlı bir isim veri tabanı değil, MVP kapsamında kasıtlı olarak dar tutuldu.
- İsim benzerliği ve öz-savunma dil kalıbı eşleştirmesi olasılıksal/sezgisel bir gösterge; davranışsal sinyallere (hesap yaşı, gönderi sıklığı, ağ yapısı) NSosyal API'si olmadığı için erişilemiyor — bu yüzden "kesin tespit" değil, "dikkat çekici sinyal" olarak dürüstçe çerçevelendi (bkz. `docs/05-derin-fikir-taramasi.md`, §3, Botometer notu).
- Şablon benzerliği modülü küçük metin kümelerinde (2-5 metin) güvenilir; çok büyük korpuslarda performans/anlamlılık test edilmedi (MVP kapsamı dışı).
