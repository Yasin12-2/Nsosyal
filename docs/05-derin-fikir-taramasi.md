# Derin Fikir Taraması — Gece Turu (2026-08-20)

> Görev: mevcut "Akış Aynası" fikrini (bkz. `docs/01-fikir-ve-tema-karari.md`, `docs/02-nsosyal-platform-analizi-ve-pivot.md`, `docs/03-teknik-tasarim.md`) önyargısız sınamak, rakip/emsal + NSosyal'e özgü + akademik zemin araştırmasıyla en az 6 fikir üretip fizibilite puanlamak. Apify KULLANILMADI (yalnızca ücretsiz WebSearch/WebFetch). Kullanıcı onay kapısı beklemeden, gerekçeli TOP 3 önerisiyle teslim ediliyor — seçim kullanıcıya ait.
>
> Rapor teslimine kalan süre: **24 Ağustos 2026 17:00 TSİ — 4 gün.**

---

## 1. Rakip/emsal analizi (global platformlar, ücretsiz kaynaklar)

| Platform/Ürün | Ne yapıyor | NSosyal'e uygulanabilirlik / boşluk |
|---|---|---|
| **X (Twitter) — Community Notes** | Merkezi moderatör yerine kullanıcı topluluğunun oy birliğiyle (köprü-algoritması) gönderilere bağlam notu ekleme. 2024 sonrası "Lightning Notes" ile ~20 dk'ya indirilen hız, düzeltilen içerikle etkileşenlere DM bildirimi. | Gerçek bir "topluluk" mekanizması **çoklu kullanıcı + oy uzlaşma altyapısı + sunucu** gerektirir — 4 günlük, tek geliştiricili bir prototipte gerçekçi biçimde simüle edilemez (bkz. §3, Fikir 5, düşük fizibilite notu). |
| **Meta (Threads/Instagram) — Hidden Words** | Kullanıcının kendi belirlediği kelime/emoji'leri feed/yorum/DM'den filtreleyen, süre sınırlı (30 gün) olabilen, Instagram'dan **bağımsız** çalışan bir susturma katmanı. Meta 2025'te ABD'de üçüncü taraf doğrulamayı bırakıp Community Notes modeline geçti. | **Kritik benzerlik:** Bu, mevcut "Garanti Sessizlik" özelliğiyle kavramsal olarak örtüşüyor — yani "kullanıcı tanımlı susturma" fikri dünyada YENİ değil. Ayrışma noktası özgünlükte değil **güvenilirlikte**: Hidden Words birinci taraf (Meta'nın kendi backend'i), NSosyal'de ise platformun KENDİ ayarları belgelenmiş biçimde güvenilmez (bkz. §2). Bizim farkımız "platformun sözünü tutmasına bağımlı olmayan üçüncü taraf/companion" konumlandırması — dürüstçe "ilk susturma fikri" değil, "NSosyal'in güvenilmezliğine mimari çözüm" olarak sunulmalı. |
| **Bluesky — Attie + Composable Moderation** | Mart 2026'da tanıtılan "Attie": doğal dilde tarif edilen bir feed'i AT Protocol üzerinde otomatik kurma. Ayrıca üçüncü taraf etiket servislerine (ör. "nefret söylemi" etiketi) abone olunabilen composable moderasyon. Felsefe: "algoritmik seçim" kullanıcıda. | NSosyal **kapalı/proprietary** (Ocak 2026'dan beri Mastodon'dan bile bağımsız kendi kod tabanı) — dışarıdan feed/algoritma değiştirme API'si yok, doğrulanamadı. Bu yüzden "gerçek algoritma kontrolü" sunan bir NSosyal aracı iddialı/yanıltıcı olur; en fazla **yapıştırılan içerik üzerinde analiz/farkındalık** sunulabilir, gerçek feed müdahalesi değil (bkz. Fikir 3'ün fizibilite kısıtı). |
| **Teyit.org (TR)** | Türkiye'nin en bilinen üçüncü taraf doğrulama/faktcheck platformu; insan editör + topluluk ihbarı modeli. | Platform-içi değil, ayrı bir web sitesi; NSosyal ile entegre değil. Türkçe, platform-gömülü bir "dil kalıbı farkındalık" katmanı hâlâ boş bir alan — ama bu alanın siyasi hassasiyeti yüksek (bkz. Fikir 6 risk notu). |
| **Botometer / bot-tespit araçları (global)** | Twitter/X hesapları için hesap yaşı, gönderi sıklığı, ağ yapısı gibi **platform-side** sinyallerle bot olasılığı hesaplıyor. | NSosyal'in genel API'si yok; kullanıcı tarafından girilen metin dışında hesap yaşı/ağ grafiği gibi güçlü sinyallere erişim mümkün değil. Gerçekçi bir NSosyal bot-tespit aracı sadece **dilsel şablon/tekrar benzerliği** (zayıf ama mevcut TF-IDF mimarisiyle ucuza eklenebilir bir proxy sinyal) sunabilir — "kesin bot tespiti" değil, "şüpheli kalıp farkındalığı" olarak dürüstçe çerçevelenmeli. |

**Genel çıkarım:** Büyük platformların hepsi "kullanıcı kontrolü" ve "şeffaflık" yönünde ilerliyor, ama hiçbiri NSosyal'in kendi somut, belgelenmiş güvenilirlik açığına (ayarın çalışmaması) yanıt vermiyor — çünkü bu NSosyal'e özgü bir arıza, jenerik bir platform sorunu değil. Bu, mevcut fikrin en savunulabilir farkı.

---

## 2. NSosyal'e özgü YENİ kanıt (önceki turda bulunmayanlar)

`docs/02-nsosyal-platform-analizi-ve-pivot.md` zaten Şikayetvar'ın bildirim/SMS/hesap-erişim şikayetlerini (27/100, 49 değerlendirme) belgelemişti. Bu turda **tekrarlanmadı**, yeni bulunanlar:

1. **Şikayetvar puanı kötüleşiyor — trend kanıtı:** Güncel tarama, **25/100, 78 şikayet, 16 değerlendirme** gösteriyor (önceki tur: 27/100, 49 değerlendirme, 119 şikayet farklı sayaç metodolojisiyle). Puan ve tekilleştirilmiş "genel değerlendirme" düşme eğiliminde — "tek seferlik kriz" değil, süregelen bir güven erozyonu olarak raporda kullanılabilir.
2. **YENİ — Sahte takipçi / spam içerik şikayeti (14 Ağustos 2025, Şikayetvar):** Bir kullanıcı, iki NSosyal hesabının "haksız yere takipçi kazandığını ve spam/sahte içerik paylaştığını" bildirdi; hesapların takipçi sayılarının incelenmesini ve kapatılmasını istedi. **Firma yanıtı YOK** (sayfada firma cevabı bulunmuyor — yine bir "platform sözünü tutmuyor" örüntüsü, bu kez bildirim değil, güven/moderasyon ekseninde). Kaynak: [sikayetvar.com/next-sosyal/sahte-takipci-ve-iceriklerle-platform-guvenilirliginin-zedelenmesi](https://www.sikayetvar.com/next-sosyal/sahte-takipci-ve-iceriklerle-platform-guvenilirliginin-zedelenmesi)
3. **YENİ — Pazarlama/gerçeklik uyuşmazlığı algısı (Ekşi Sözlük):** Platform kendini "bot hesaplardan ve manipülatif algoritmalardan arındırılmış" olarak tanıtıyor, ancak teknik olarak T3AI adlı bir öneri/moderasyon algoritması aktif çalışıyor. Kullanıcı tartışma başlıklarında bu ikilik ("algoritma yok diyorsun ama T3AI var") eleştiri konusu. Bu, "algoritманın ne yaptığını gösteren şeffaflık" ihtiyacına dolaylı ama gerçek bir kanıt sunuyor. Kaynak: [eksisozluk.com/next-sosyal--8007314](https://eksisozluk.com/next-sosyal--8007314)
4. **YENİ — Yasal fırsat penceresi (Kanun No. 7578):** TBMM'de 22 Nisan 2026'da kabul edilen, 1 Mayıs 2026'da Resmî Gazete'de yayımlanan yasa, 15 yaş altına sosyal medya hizmeti sunulmasını yasaklıyor; **yaş doğrulama, ebeveyn kontrol paneli, 15-18 yaş için farklılaştırılmış hizmet** zorunlu kılınıyor. Yürürlük: **1 Kasım 2026**. Haber taramasında NSosyal'in bu konuda özel bir hazırlık duyurusu **bulunamadı** — büyük, yaklaşan ve şu an görünürde karşılanmamış bir uyum boşluğu. Kaynak: [Hürriyet](https://www.hurriyet.com.tr/bilgi/galeri/15-yas-alti-sosyal-medya-yasagi-son-dakika-2026-15-yas-alti-sosyal-medya-yasagi-cikti-mi-ne-zaman-cikacak-icerigi-nedir-15-yas-alti-43142488), [HepsiVeri](https://hepsiveri.com/2026/01/turkiyede-15-yas-altina-sosyal-medya-yasagi-dijital-oyunlara-yas-derecelendirmesi-taslak-ne-getiriyor/)
5. **Aranıp bulunamayan (önemli negatif sonuç):** NSosyal'e özel, doğrudan "içerik ekonomisi/yaratıcı gelir modeli" şikâyeti veya haberi **bulunamadı** — platform şu an reklamsız/parasız konumlandığından (kendi pazarlamasına göre "reklamsız, ücretsiz"), İçerik Ekonomisi teması için NSosyal'e özgü kanıt zemini hâlâ zayıf; `docs/01` bulgusuyla tutarlı, bu turda da doğrulandı.

---

## 3. Akademik/teknik zemin (Sosyal YZ temasına uygulanabilirlik notlarıyla)

| Alan | Bulgu | Türkçe/4-gün uygulanabilirlik |
|---|---|---|
| **Bot/sahte hesap tespiti** | Literatür iki sinyal ailesi tanımlıyor: (a) dilsel (kelime çeşitliliği, tekrar oranı, şablon dil), (b) davranışsal (paylaşım sıklığı, mouse/tıklama dinamiği, ağ yapısı). | (a) kısmen uygulanabilir — mevcut TF-IDF motoru zaten kelime vektörleri üretiyor, cosine-similarity ile "metinler arası şablon tekrarı" ölçülebilir (ucuz ek modül). (b) uygulanamaz — davranışsal sinyaller platform-side veri gerektirir, NSosyal API'si yok. |
| **Türkçe deepfake/sentetik içerik tespiti** | Gerçek akademik literatür var (Politeknik Dergisi, İstanbul Barosu YZ ve Hukuk komisyonu raporu) ama çalışmalar görüntü/video sınıflandırma modelleri (CNN tabanlı) — veri seti bulma, etiketleme, eğitim süresi 4 günü fazlasıyla aşıyor. | **Uygun değil** bu sprint için — kapsam dışı bırakılmalı. |
| **Algoritmik şeffaflık/açıklanabilirlik** | Türkçe akademik yazın (İstanbul Kültür Üniv. — X'in algoritma açık kaynağı analizi, çeşitli dergipark makaleleri) şeffaflığı "opaklığı azaltan" bir çözüm olarak öneriyor ama somut, uygulanabilir bir Türkçe teknik model sunmuyor — daha çok kavramsal/hukuki tartışma. | Mevcut "kelime-katkı açıklaması" (lojistik regresyon şeffaflığı) zaten bu literatürün pratik, çalışan bir uygulaması — akademik zeminde nadir bulunan somut bir örnek, rapor için güçlü bir argüman. |
| **Kolektif doğrulama (community notes tarzı)** | Akademik/kavramsal düzeyde tartışılıyor (Teyit.org örneği literatürde referans veriliyor) ama Türkçe, platform-gömülü, çalışan bir açık kaynak örneği bulunamadı. | Teorik olarak özgün ama pratikte 4 günde gerçek "topluluk" dinamiği kurulamaz (bkz. Fikir 5). |

---

## 4. Fikirler (6) — fizibilite puanlı

> Puanlama: her kriter 1-10 (10=en güçlü). "Ağırlıklı Tahmini Puan", ilgili temanın `docs/00-sartname-ozeti.md`'deki resmi ağırlıklarıyla hesaplanan, 100 üzerinden öngörülen jüri puanı yaklaşımıdır (kaba tahmin, gerçek puan raporun/prototipin kalitesine bağlı).

### Fikir 1 — "Akış Aynası v2": Güven Katmanı + Kanıt Kutusu (BİRLEŞİK, GÜÇLENDİRİLMİŞ) ⭐ EN GÜÇLÜ ÖNERİ

**Ne:** Mevcut prototipin (toksisite sınıflandırıcı + Akış Günlüğü + Garanti Sessizlik + şeffaflık katmanı) üzerine, TF-IDF altyapısını yeniden kullanan **yeni bir modül** ekleniyor: "Kanıt Kutusu" — kullanıcının yapıştırdığı birden fazla gönderi/hesap açıklaması arasında **şablon/tekrar benzerliği** (cosine similarity) hesaplayıp "bu içerikler birbirine şüpheli derecede benziyor, kalıp/spam işareti olabilir" şeklinde damgalamayan bir farkındalık notu veriyor.

**Kanıt zinciri (üç ayrı, belgelenmiş NSosyal şikâyeti birleştiriliyor):**
- Bildirim/susturma ayarlarının çalışmaması (27→25/100, N Spor kanalı 5 ay boyunca susturulamadı) → **Garanti Sessizlik**
- İstenmeyen SMS'in hesap silindikten sonra bile gelmesi → platformun "sözünü tutmama" örüntüsünün ikinci örneği, aynı mimari argümanı güçlendiriyor
- Sahte takipçi/spam içerik şikâyeti, firma yanıtsız (14 Ağu 2025) → **Kanıt Kutusu** modülünün doğrudan gerekçesi

**Özgünlük cümlesi:** Threads'in Hidden Words'ü ve X'in Community Notes'u kavramsal olarak var, ama ikisi de **platformun kendi backend'ine güvenerek** çalışıyor. Bu proje, "platformun ayarına güvenmeden, cihazda her zaman tutarlı çalışan" bir üçüncü-taraf güven katmanı sunan **ilk NSosyal-özel** araç — çünkü NSosyal'in kendi ayarlarının güvenilmezliği (bizim iddiamız değil, Şikayetvar'da belgelenen, firma yanıtsız bir örüntü) mimari gerekçenin ta kendisi.

| Kriter | Puan (1-10) | Not |
|---|---|---|
| NSosyal kanıt gücü | 9 | 3 farklı, belgelenmiş, firma-yanıtsız şikâyet kategorisi tek çatı altında |
| Tema uyumu (Sosyal YZ) | 9 | Gerçek ML + yeni benzerlik modülü, %30 ağırlıklı "Teknik Yeterlilik" kriterini güçlü karşılıyor |
| Özgünlük/yerlilik | 8 | Kendi eğitilen Türkçe model = somut yerli bileşen; "platform-bağımsız garanti" mimarisi orijinal, ama "mute kelime" kavramı kendisi değil |
| Teknik fizibilite (4 gün) | 9 | ~%90 zaten inşa edilmiş; kalan iş cosine-similarity modülü + arayüz kartı |
| Mevcut altyapı sinerjisi | 10 | Doğrudan devamı, sıfır mimari değişiklik |
| **Ağırlıklı Tahmini Puan** | **~80/100** | Yenilik 20%×7 + Teknik 30%×9 + Problem 20%×9 + UX 10%×7 + Sunum 15%×8 + İş Modeli 5%×5 |
| KVKK/etik yük | Düşük | Hiç yeni PII yok; tüm veri cihazda kalmaya devam ediyor |
| Risk | Threads Hidden Words / X Community Notes ile "aynı şey" algısı — raporda mimari fark (platform-bağımsızlık) açıkça, dürüstçe vurgulanmalı, "ilk susturma fikri" gibi abartılı iddia kurulmamalı |

---

### Fikir 2 — Sahte Hesap/Spam Öz-Değerlendirme Asistanı (bağımsız, dar kapsamlı versiyon)

**Ne:** Fikir 1'deki Kanıt Kutusu modülünün, ayrı bir bağımsız ürün olarak öne çıkarıldığı versiyonu — kullanıcının bir profil biyografisi/birden fazla gönderi metnini yapıştırdığında dilsel şablon tekrarı + "şüpheli kalıp" skoru üreten, EĞİTİCİ (ihbar/damgalama değil, "dikkatli ol" bilgilendirmesi) bir araç.

**Kanıt:** Sahte takipçi/spam şikâyeti (14 Ağu 2025, firma yanıtsız) — tek doğrudan kanıt noktası, Fikir 1'e göre daha dar temelli.

| Kriter | Puan | Not |
|---|---|---|
| NSosyal kanıt gücü | 7 | Tek doğrudan şikâyet; genel "sahte hesap Türkiye'de yaygın sorun" ile destekleniyor ama NSosyal'e özgü değil |
| Tema uyumu (Sosyal YZ) | 7 | Bot/spam tespiti teması merkeze alınıyor ama sinyal zayıf (yalnız dilsel) |
| Özgünlük/yerlilik | 6 | Botometer vb. global örnekler var; Türkçe+client-side+NSosyal odaklı boşluk var ama "gerçek bot tespiti" iddiası abartılı olabilir |
| Teknik fizibilite (4 gün) | 6 | Uygulanabilir ama gerçek bot tespiti platform-side sinyal gerektirdiğinden iddia sınırlı tutulmalı |
| Mevcut altyapı sinerjisi | 7 | TF-IDF motoru kısmen yeniden kullanılabilir |
| **Ağırlıklı Tahmini Puan** | **~66/100** | |
| KVKK/etik yük | Düşük-orta | Üçüncü kişi hesap/profil metni işleniyor — kendi verisi değil, dikkatli çerçevelenmeli (ihbar aracı değil, farkındalık aracı) |
| Risk | Fikir 1'in bir alt-kümesi; ayrı ürün olarak sunulursa Fikir 1'den daha zayıf kanıt tabanına sahip — muhtemelen Fikir 1 içine modül olarak katılması daha güçlü |

---

### Fikir 3 — "Şeffaf Akış": Algoritma Etki Paneli (Kullanıcı Katılımı/UX temasına pivot)

**Ne:** Mevcut model motoru korunuyor ama çerçeveleme değişiyor: kullanıcının yapıştırdığı akış içeriğinin toksisite/duygu dağılımını görselleştiren + "algoritma neden bunu gösteriyor olabilir" açıklama katmanını öne çıkaran, temayı Sosyal YZ'den Kullanıcı Katılımı/UX'e taşıyan versiyon.

**Kanıt:** Ekşi Sözlük'teki "algoritma yok diyorsun ama T3AI var" pazarlama-gerçeklik uyuşmazlığı algısı — dolaylı, NSosyal'e özgü doğrudan bir "algoritma şikâyeti" şikâyet platformlarında bulunamadı.

| Kriter | Puan | Not |
|---|---|---|
| NSosyal kanıt gücü | 6 | Dolaylı (forum algısı), doğrudan şikâyet kanıtı yok |
| Tema uyumu (UX) | 6 | UX temasında Teknik ağırlık %20'ye düşüyor — Sosyal YZ'nin %30 avantajından vazgeçiliyor |
| Özgünlük/yerlilik | 6 | Bluesky zaten "algoritmik seçim" felsefesini uyguluyor; NSosyal'de API yokluğu nedeniyle gerçek kontrol sunulamıyor, sadece analiz |
| Teknik fizibilite (4 gün) | 7 | Mevcut motor yeniden kullanılabilir ama "algoritma etkisi" iddiası NSosyal'in gerçek algoritmasına erişim olmadan **yanıltıcı** olabilir — dikkatli çerçeveleme (sadece yapıştırılan içerik analizi) şart |
| Mevcut altyapı sinerjisi | 8 | Yüksek |
| **Ağırlıklı Tahmini Puan** | **~63/100** | Tema değişimi, %30→%20 teknik ağırlık kaybı nedeniyle Fikir 1'in altında |
| KVKK/etik yük | Düşük | |
| Risk | "Algoritma etkisi" adı yanıltıcı bulunabilir (gerçek algoritmaya erişim yok) — isim/pazarlama dilinde netlik şart |

---

### Fikir 4 — "Yaş Dostu Mod": 15 Yaş Altı Uyum Ön-Değerlendirme Aracı

**Ne:** Kanun No. 7578'in (1 Kasım 2026 yürürlük) getirdiği yaş doğrulama + ebeveyn kontrol paneli + 15-18 yaş farklılaştırılmış hizmet zorunluluklarına, NSosyal'in henüz kamuya açık bir hazırlığı görünmüyorken, tamamlayıcı bir ebeveyn-kontrol-paneli simülasyonu + içerik yaş-uygunluğu ön-değerlendirmesi sunan araç.

**Kanıt:** Çok güçlü ve taze bir yasal zorunluluk (Resmî Gazete, 1 Mayıs 2026) — ama NSosyal'e özgü şikâyet/haber kanıtı değil, **yaklaşan bir regülasyon fırsat penceresi**.

| Kriter | Puan | Not |
|---|---|---|
| NSosyal kanıt gücü | 8 | Yasal zorunluluk çok somut ve tarihli, ama "NSosyal bunu henüz çözmedi" iddiası negatif kanıta (haber bulunamadı) dayanıyor — ihtiyatlı sunulmalı |
| Tema uyumu | 7 | UX (ebeveyn paneli, adaptif arayüz) veya Sosyal YZ (yaş-uygunluk sınıflandırması) — iki temaya da kısmen hitap ediyor, ama hiçbirini tam doldurmuyor |
| Özgünlük/yerlilik | 7 | Türkiye'ye özgü, çok taze yasal bağlam; kimse henüz çözmemiş |
| Teknik fizibilite (4 gün) | **4** | Yaş doğrulama + ebeveyn paneli + içerik uygunluk sınıflandırması kapsamı geniş; sıfırdan yeni bir sınıflandırma problemi (mevcut toksisite modeli doğrudan taşınamaz) |
| Mevcut altyapı sinerjisi | 4 | Sınırlı — farklı bir problem alanı |
| **Ağırlıklı Tahmini Puan** | **~60/100** | Kanıt güçlü ama fizibilite/sinerji zayıf, 4 günde gerçekçi bir MVP riskli |
| KVKK/etik yük | **Yüksek** | Çocuk yaşı/kimliği en hassas veri kategorisi — yaş doğrulama simülasyonu bile "çocuk verisi" algısı yaratabilir, dikkatli/sembolik tutulmalı |
| Risk | Kapsam taşması + yüksek KVKK hassasiyeti; zaman baskısı altında en riskli seçenek |

---

### Fikir 5 — "Kolektif Bakış": Türkçe Community-Notes Simülasyonu

**Ne:** Kullanıcıların NSosyal gönderilerine (yapıştırılan metin) dair toplu bağlam notu ekleyebildiği, basit paylaşılabilir link mekanizmalı bir kolektif doğrulama katmanı.

**Kanıt:** Zayıf/dolaylı — NSosyal'e özgü doğrudan kanıt yok, global trend (X/Meta) referans alınıyor.

| Kriter | Puan | Not |
|---|---|---|
| NSosyal kanıt gücü | 4 | Dolaylı |
| Tema uyumu (Sosyal YZ) | 6 | |
| Özgünlük/yerlilik | 7 | Türkçe yerli platformda yok |
| Teknik fizibilite (4 gün) | **3** | Gerçek "topluluk" = çoklu kullanıcı + sunucu + oy uzlaşma algoritması gerektirir; tek geliştiricili 4 günlük sprintte gerçekçi bir çok-kullanıcılı demo kurulamaz, sahte/tek-kullanıcılı demo jüriyi ikna etmez |
| Mevcut altyapı sinerjisi | 4 | Client-side/localStorage mimarisiyle temelden çelişiyor (kolektif = paylaşılan state gerektirir) |
| **Ağırlıklı Tahmini Puan** | **~49/100** | Fizibilite en zayıf halka |
| KVKK/etik yük | Orta-yüksek | Çoklu kullanıcı verisi = sunucu + kimlik yönetimi gerekir, mevcut KVKK-minimal felsefeyle çelişir |
| Risk | 4 günde "gerçek" görünmeyen bir demo, işlevsellik puanını düşürür |

---

### Fikir 6 — "Netlik Notu": Manipülatif Dil Kalıbı Rozeti (DÜŞÜK ÖNCELİK — RİSKLİ)

**Ne:** Kullanıcının yapıştırdığı bir iddia/haber metninde abartı, aciliyet, duygusal yükleme gibi "manipülatif dil kalıplarını" işaretleyen bir sınıflandırıcı (teyit.org'a ilham, ama gerçek doğrulama iddiası yok).

**Kanıt:** Dolaylı — NSosyal'e özgü doğrudan kanıt yok.

| Kriter | Puan | Not |
|---|---|---|
| NSosyal kanıt gücü | 3 | |
| Tema uyumu | 6 | |
| Özgünlük/yerlilik | 6 | |
| Teknik fizibilite (4 gün) | 6 | Mevcut TF-IDF mimarisine benzer şekilde uygulanabilir |
| Mevcut altyapı sinerjisi | 6 | |
| **Ağırlıklı Tahmini Puan** | **~43/100** | |
| KVKK/etik yük | Düşük | |
| **Risk — YÜKSEK, ÖNERİLMİYOR** | NSosyal'de siyasi paylaşım yoğunluğu doğrulandı (Cumhurbaşkanlığı hesabından ABD ziyareti duyurusu örneği bulundu) — "dezenformasyon/manipülasyon" etiketleme aracı siyasi taraflılık algısı yaratma riski taşıyor. Proje ekibinin kendi önceki kararı (`docs/02`: "yerli/milli tartışmasına GİRİLMEYECEK") ile doğrudan gerilimli. Diskalifiye riski nedeniyle **TOP 3'e alınmadı**. |

---

## 5. Puan tablosu (özet)

| # | Fikir | Tema | Kanıt | Özgünlük | Fizibilite (4g) | Sinerji | Ağırlıklı Puan (/100) | KVKK Yük | Risk |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Akış Aynası v2 (Güven Katmanı+Kanıt Kutusu) | Sosyal YZ | 9 | 8 | 9 | 10 | **~80** | Düşük | Orta (Hidden Words benzerlik algısı) |
| 2 | Sahte Hesap Öz-Değerlendirme (bağımsız) | Sosyal YZ | 7 | 6 | 6 | 7 | ~66 | Düşük-orta | Fikir 1'in alt kümesi |
| 3 | Şeffaf Akış — Algoritma Etki Paneli | UX | 6 | 6 | 7 | 8 | ~63 | Düşük | Yanıltıcı isimlendirme riski |
| 4 | Yaş Dostu Mod (15 yaş altı uyum) | UX/Sosyal YZ | 8 | 7 | 4 | 4 | ~60 | **Yüksek** | Kapsam taşması |
| 5 | Kolektif Bakış (Community Notes TR) | Sosyal YZ | 4 | 7 | 3 | 4 | ~49 | Orta-yüksek | Gerçekçi demo kurulamaz |
| 6 | Netlik Notu (manipülatif dil rozeti) | Sosyal YZ | 3 | 6 | 6 | 6 | ~43 | Düşük | **Siyasi taraflılık — önerilmiyor** |

---

## 6. TOP 3 öneri ve gerekçe

### 🥇 EN GÜÇLÜ ÖNERİ: **Fikir 1 — Akış Aynası v2 (Güven Katmanı + Kanıt Kutusu)**
**Gerekçe:** En yüksek kanıt gücü (3 farklı, belgelenmiş, firma-yanıtsız NSosyal şikâyet kategorisi), en yüksek teknik fizibilite (mevcut altyapının ~%90'ı doğrudan kullanılıyor, kalan 4 günde rahatça tamamlanabilir bir modül eklemesi), en düşük KVKK yükü (hiçbir yeni PII yok), ve Sosyal YZ temasının %30 ağırlıklı "Teknik Yeterlilik" kriterini genuine bir ML bileşeniyle karşılıyor. Zaman baskısı altında (4 gün) risk-getiri dengesi en iyi seçenek. Tek dezavantajı, "kullanıcı tanımlı susturma" kavramının dünyada (Threads) örneği olması — ama bu, raporda mimari farkın (platform-bağımsız garanti) dürüstçe vurgulanmasıyla yönetilebilir bir risk, diskalifiye edici değil.

### 🥈 İKİNCİ: **Fikir 2 — Sahte Hesap Öz-Değerlendirme Asistanı**
**Gerekçe:** Fikir 1 ile aynı mimariyi paylaşıyor; Fikir 1'in kapsamı beklenenden dar kalırsa veya jüri/mentör "tek bir güçlü özelliğe odaklan" derse, bu fikir Fikir 1'in Kanıt Kutusu modülünün öne çıkarılmış, bağımsız bir pivotu olarak devreye alınabilir. Ayrı bir ürün olarak zayıf (kanıt tabanı dar) ama Fikir 1 içindeki bir modül olarak güçlü — bu yüzden "yedek/pivot" konumunda tutuluyor, ayrı geliştirme önerilmiyor.

### 🥉 ÜÇÜNCÜ (cesur alternatif, yüksek risk/yüksek potansiyel): **Fikir 4 — Yaş Dostu Mod**
**Gerekçe:** Kanıt gücü (taze, somut yasal zorunluluk) ve özgünlük yüksek — kimse henüz bu boşluğu doldurmadı ve zamanlama (1 Kasım 2026 yürürlük) jüri gözünde "gündemi yakalayan" bir izlenim bırakabilir. Ancak 4 günlük fizibilite ve KVKK yükü ciddi engeller; **yalnızca kullanıcı bu riski bilinçli olarak almak isterse ve kapsamı çok sembolik/dar tutmayı kabul ederse** (ör. gerçek yaş doğrulama YOK, yalnızca "ebeveyn bilgilendirme paneli" konsept düzeyinde) düşünülmeli. Şu anki 4 günlük sprint için önerilen birincil yol değil.

**Not — Fikir 3 ve 5 neden TOP 3 dışında kaldı:** Fikir 3, tema değişimiyle %30→%20 teknik ağırlık avantajını terk ediyor ve "algoritma etkisi" iddiası NSosyal API'sizliği nedeniyle yanıltıcı olma riski taşıyor. Fikir 5, mevcut KVKK-minimal/client-side mimariyle temelden çelişiyor ve 4 günde gerçekçi bir çok-kullanıcılı demo kurulamıyor — işlevsellik puanını düşürme riski yüksek. Fikir 6 ise siyasi taraflılık riski nedeniyle zaten TOP 3 dışında tutuldu (bkz. §4).

---

## 7. Kaynaklar

- [Şikayetvar — Next Sosyal genel sayfa](https://www.sikayetvar.com/next-sosyal) (25/100, 78 şikâyet, güncel tarama)
- [Şikayetvar — Next Sosyal, sahte takipçi/içerik şikâyeti, 14 Ağu 2025](https://www.sikayetvar.com/next-sosyal/sahte-takipci-ve-iceriklerle-platform-guvenilirliginin-zedelenmesi)
- [Ekşi Sözlük — next sosyal](https://eksisozluk.com/next-sosyal--8007314)
- [Hürriyet — 15 yaş altı sosyal medya yasağı, 2026](https://www.hurriyet.com.tr/bilgi/galeri/15-yas-alti-sosyal-medya-yasagi-son-dakika-2026-15-yas-alti-sosyal-medya-yasagi-cikti-mi-ne-zaman-cikacak-icerigi-nedir-15-yas-alti-43142488)
- [HepsiVeri — 15 yaş altı yasak taslak detayları](https://hepsiveri.com/2026/01/turkiyede-15-yas-altina-sosyal-medya-yasagi-dijital-oyunlara-yas-derecelendirmesi-taslak-ne-getiriyor/)
- [Webtekno — Next Sosyal Ağustos 2026 güncellemesi](https://www.webtekno.com/next-sosyal-yeni-ozellikler-h160273.html)
- [Engadget — Bluesky choose-your-own-algorithm](https://www.engadget.com/bluesky-now-lets-you-choose-your-own-algorithm-183824105.html)
- [TechBuzz — Bluesky Attie AI custom feed builder](https://www.techbuzz.ai/articles/bluesky-launches-attie-ai-powered-custom-feed-builder)
- [Social Media Today — Threads Hidden Words genişlemesi](https://www.socialmediatoday.com/news/threads-expands-hidden-words-feature-separate-from-instagram/751798/)
- [AA — Algoritmik şeffaflık tartışması: X'in hamlesi](https://www.aa.com.tr/tr/analiz/algoritmik-seffaflik-tartismasi-xin-hamlesi-ne-anlama-geliyor/3813938)
- [Politeknik Dergisi — Derin öğrenme ile deepfake video tespiti](https://dergipark.org.tr/tr/pub/politeknik/article/1063104)
- [Teyit — Bot hesaplar nasıl tespit edilir?](https://teyit.org/teyitpedia/bot-hesaplar-nasil-tespit-edilir)

---

## 8. Kullanıcıya not (karar kullanıcıya ait)

Bu tarama, mevcut "Akış Aynası" fikrini elemedi — tam tersine, üç ayrı NSosyal kanıtını (bildirim güvenilmezliği + SMS güvenilmezliği + sahte takipçi/spam şikâyeti) tek bir mimari argümanda birleştirip **güçlendirdi**. Önerilen yol, sıfırdan pivot değil, mevcut prototipe küçük ama kanıt-güçlendirici bir "Kanıt Kutusu" modülü eklemek (Fikir 1). Kullanıcı uyandığında üç seçenek var: (a) Fikir 1 ile devam — en düşük risk, en yüksek hazır-olma; (b) Fikir 4'e cesur pivot — yüksek potansiyel ama 4 günde ciddi kapsam disiplini gerektirir; (c) mevcut haliyle (Fikir 1'in temel hali, Kanıt Kutusu'suz) devam — hâlâ güçlü, sadece bir kanıt katmanı eksik kalır.
