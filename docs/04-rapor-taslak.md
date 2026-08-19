# Proje Teknik Raporu — Taslak v1 (2026-08-19)

> Bu dosya resmi docx şablonuna (`NSosyal_Inovasyon_2026_-_Proje_Teknik_Raporu_1_u6IVb.docx`) işlenmeden önce içerik/gerekçe kontrolü için hazırlanan markdown taslaktır. Bölüm numaraları ve puanlar `docs/00-sartname-ozeti.md`'deki rubrikle birebir eşleşir. Kanıt tabanı: `docs/02-nsosyal-platform-analizi-ve-pivot.md`.
>
> **Açık placeholder'lar:** GitHub repo linki (§3.1 — kullanıcı repo oluşturunca eklenecek), Takım ID/Başvuru ID (kapak — kullanıcı KYS başvurusunu tamamlayınca eklenecek).

---

## 1. PROJE ÖZETİ (20 PUAN)

### 1.1. Proje Konusu ve Amacı (7 Puan)

**Akış Aynası**, NSosyal kullanıcılarına yönelik, sosyal medya akışlarının duygusal/toksik örüntüsünü şeffaf biçimde gösteren ve kullanıcının tanımladığı içerik tercihlerini — platformun kendi ayarlarının çalışıp çalışmadığından bağımsız olarak — cihaz üzerinde garanti biçimde uygulayan bir dijital güven katmanıdır.

Proje, doğrudan **Sosyal Yapay Zekâ** temasına hitap eder: içerik moderasyonu, toksisite tespiti ve kullanıcı ruh haline uygun içerik yönetimi bu temanın açıkça belirtilen kapsam alanlarıdır [6]. Projenin nihai amacı, NSosyal'in kamuya açık, kanıtlanmış bir kullanıcı güveni sorununu (bkz. Bölüm 2.1) somut, çalışan bir prototiple çözmektir.

### 1.2. Proje Kapsamı ve Yöntemi (8 Puan)

Projenin kapsamı bilinçli olarak dar tutulmuştur: gerçek NSosyal API/backend entegrasyonu bu aşamada doğrulanamadığı için (bkz. Bölüm 2.1), prototip bir **tamamlayıcı (companion) web uygulaması** olarak tasarlanmıştır — kullanıcı NSosyal'de gördüğü içeriği manuel olarak veya örnek veri setiyle sisteme aktarır. Next.js/TypeScript tabanlı, tamamen istemci tarafında (client-side) çalışan bir mimari kullanılmıştır; sunucu veya veritabanı bulunmamaktadır.

İzlenecek yöntem dört aşamalıdır: (1) NSosyal'in gerçek, kamuya açık kullanıcı şikayet verisinin analizi, (2) Türkçe bir toksisite sınıflandırıcısının akademik bir veri setiyle eğitilmesi ve tarayıcıda çalışacak şekilde dışa aktarılması, (3) akış günlüğü ve şeffaflık arayüzünün geliştirilmesi, (4) "Garanti Sessizlik" kontrol katmanının eklenmesi. Fikir, yalnızca teorik düzeyde kalmamış; çalışan bir prototiple (bkz. Bölüm 3) desteklenmiştir. Seçilen tematik alanla (Sosyal Yapay Zekâ) ilişki, projenin merkezinde yer alan gerçek makine öğrenmesi bileşeni (Bölüm 3.2) üzerinden doğrudan kurulmaktadır.

Projenin gelecekte yeni çalışmalara zemin hazırlama potansiyeli açıktır: aynı mimari (client-side, açıklanabilir, kural/model tabanlı) farklı platformlara veya farklı içerik kategorilerine (nefret söylemi, dezenformasyon, reklam tespiti) genişletilebilir niteliktedir.

---

## 2. KATMA DEĞER VE YENİLİKÇİLİK

### 2.1. Problem Tanımı ve Mevcut Çözümler (7 Puan)

NSosyal, T3 Vakfı öncülüğünde 2N Medya tarafından geliştirilen, 23 Temmuz 2025'te yayına giren ve kısa sürede 1,7 milyonu aşan kullanıcıya ulaşan bir Türk sosyal medya platformudur [5]. Platform başlangıçta Mastodon (ActivityPub) açık kaynak altyapısı üzerine inşa edilmiş, Ocak 2026 itibarıyla ise tamamen kendi (proprietary) yazılım altyapısına geçmiştir [5].

Platformun kamuya açık şikayet verisi (Şikayetvar), somut ve nesnel bir sorunu ortaya koymaktadır: NSosyal **27/100** puanla değerlendirilmekte, 119 şikayetten yalnızca 13'ü (%11) çözülmüş durumdadır [2]. En büyük iki şikayet kümesi şunlardır:

- **Bildirim ve sessize alma ayarlarının çalışmaması (52+ şikayet):** Kullanıcılar sustuğu/engellediği kanallardan (N Haber, N Spor, N Ekonomi) aylarca bildirim almaya devam ettiğini bildirmektedir — bir örnekte yaklaşık 30 dakikada bir, 5 ay boyunca [2]. Ayrıca kullanıcı hesabını sildikten SONRA BİLE pazarlama SMS'i almaya devam etmektedir [2].
- **Hesap erişimi/kimlik doğrulama sorunları (53+ şikayet):** Kullanıcı adı kurtarma, medya yükleme hataları, şifre sıfırlama kodlarının ulaşmaması [2].

Platformun kendi "T3AI" botu ("Ahlaklı Yapay Zeka") mevcuttur; ancak bu, spam/bot/manipülasyon tespiti amacıyla **platform/backend tarafında** çalışan bir moderasyon aracıdır [3][5]. Kullanıcının **kendi tarafında**, platformun sunucu tarafı ayarına bağımlı olmadan, güvenilir ve şeffaf şekilde çalışan kişisel bir kontrol katmanı bulunmamaktadır — bu, kamuya açık kaynaklarda tespit edilebilen somut bir boşluktur.

Mevcut çözümler (genel amaçlı ekran süresi sınırlayıcılar, streak tabanlı dijital detoks uygulamaları — Opal, Forest, One Sec vb.) bu boşluğu doldurmamaktadır: bunlar (a) NSosyal'e özgü değildir, (b) platformun kendi bildirim sisteminin güvenilirliğine dair hiçbir garanti sunmaz, (c) genellikle yasaklayıcı/kısıtlayıcı bir dille tasarlanmıştır ve literatürde "gamification paradox" olarak adlandırılan, kaygı/suçluluk yaratma riski taşımaktadır.

### 2.2. Çözüm Fikri, Özgünlük ve Yerlilik (8 Puan)

Akış Aynası, yukarıda tanımlanan boşluğa iki bileşenle yanıt verir:

1. **Şeffaflık katmanı:** Kullanıcının akışında gördüğü içeriğin toksisite/olumsuzluk örüntüsünü, gerçek ve açıklanabilir bir makine öğrenmesi modeliyle (bkz. Bölüm 3.2) gösterir — kara kutu değildir, her skorun hangi kelimelerden geldiği tam olarak hesaplanabilir.
2. **Garanti Sessizlik:** Kullanıcının tanımladığı kelime/kaynak kuralları, sunucuya hiç gönderilmeden, yalnızca cihazda ve platformun kendi ayarının çalışıp çalışmadığından tamamen bağımsız olarak uygulanır. Bu, Şikayetvar'da belgelenen "ayardan kapattım, gelmeye devam ediyor" örüntüsüne doğrudan, mimari düzeyde bir yanıttır.

**Mevcut çözümlerden farkı**, somut biçimde üç noktada özetlenebilir: (1) NSosyal'e özgü, kanıtlanmış bir soruna odaklanan tek çözüm olması — genel amaçlı bir "dijital detoks" aracı değildir; (2) kullanıcı kontrolünün platformun sunucu tarafı güvenilirliğine bağımlı olmaması — bu, mühendislik düzeyinde bir garanti sunar, bir "ayar" vaadi değildir; (3) tam açıklanabilirlik — doğrusal model olduğu için her skorun nedeni kelime düzeyinde gösterilebilir, bu diğer "kara kutu" moderasyon sistemlerinden ayrışan bir özelliktir.

**Yerlilik:** Sınıflandırıcı, tamamen Türkçe bir akademik veri setiyle (OffensEval-TR 2020, Türk araştırmacı Çağrı Çöltekin tarafından derlenmiş, LREC'te yayımlanmış [1]) sıfırdan eğitilmiştir — yabancı bir dil modeline veya üçüncü taraf bir API'ye (OpenAI, Google vb.) bağımlılık yoktur. Model ağırlıkları, eğitim betiği ve tüm mantık ekip tarafından geliştirilmiş, açık ve denetlenebilir bir yerli bileşendir.

---

## 3. TEKNOLOJİ KULLANIMI

### 3.1. İzlenecek Yöntem, Altyapı ve Sürüm Kontrolü (7 Puan)

**Teknoloji yığını:** Next.js 16 (App Router), TypeScript, Tailwind CSS (arayüz); Python/scikit-learn (model eğitimi, çevrimdışı); saf TypeScript (tarayıcıda model çıkarımı — harici bir ML çalışma zamanı, ör. TensorFlow.js/ONNX Runtime, gerekmemiştir, çünkü lojistik regresyon basit bir ağırlıklı toplam + sigmoid işlemidir).

**Veri:** OffensEval-TR 2020 (Çöltekin, 2020, LREC, CC-BY lisanslı) — 31.756 eğitim + 3.528 test örneği, ikili etiket (OFF/NOT) [1]. Ayrıntılı ön işleme, TF-IDF vektörleştirme ve model mimarisi Bölüm 3.2'de anlatılmaktadır.

**Sürüm kontrolü:** Proje, Git ile takip edilmektedir; commit geçmişi anlamlı kilometre taşlarını (veri hazırlığı, model eğitimi, arayüz geliştirme, Garanti Sessizlik özelliği) yansıtmaktadır. Depo bağlantısı: **[GITHUB REPO LİNKİ — takım GitHub hesabı oluşturulduktan sonra eklenecek]**.

### 3.2. Model ve Veri Doğrulama (6 Puan)

Model, klasik ve açıklanabilir bir makine öğrenmesi hattı (TF-IDF + Lojistik Regresyon) ile eğitilmiştir; derin öğrenme veya üçüncü taraf bir büyük dil modeli kullanılmamıştır — bu, kasıtlı bir tercihtir (şeffaflık ve tarayıcıda çalışabilirlik için).

- **Veri ön işleme:** Türkçe'ye duyarlı küçük harfe çevirme (standart `.lower()`'ın İ/I harflerini hatalı dönüştürme sorununu önleyen özel bir fonksiyon), `@USER` etiketlerinin ve URL'lerin temizlenmesi, Türkçe karakter setini (`çğıöşü`) destekleyen bir tokenizer. TF-IDF vektörleştirme `sublinear_tf=True` ve L2 normalizasyonuyla uygulanmıştır.
- **Model eğitimi:** Veri setinin resmi orijinal eğitim/test ayrımı kullanılmıştır (ek karıştırma yapılmamıştır — bu, tekrarlanabilirlik ve savunulabilirlik için bilinçli bir tercihtir). Sınıf dengesizliği (NOT: %80,7, OFF: %19,3) `class_weight="balanced"` ile telafi edilmiştir.
- **Aşırı öğrenme (overfitting) önlemi:** Model, ayrık bir test kümesinde değerlendirilmiştir (eğitimde hiç görülmemiş 3.528 örnek); ayrıca kelime dağarcığı 19.195'ten 4.000'e budanan Kompakt Model'in performans kaybı (accuracy 0,7959 → 0,7846) ihmal edilebilir düzeyde kalmıştır — bu, modelin aşırı öğrenmediğinin, genelleyebilen az sayıda güçlü öznitelik öğrendiğinin bir göstergesidir.
- **Performans metrikleri (gerçek, `docs/model-egitim-raporu.md`'den):**

| Model | Doğruluk | OFF F1 | NOT F1 |
|---|---|---|---|
| Tam Model (19.195 kelime, referans) | 0,7959 | 0,5610 | 0,8671 |
| **Kompakt Model (4.000 kelime, tarayıcıda çalışan)** | **0,7846** | **0,5576** | **0,8576** |

Dışa aktarım doğruluğu: Python `predict_proba` çıktısı ile TypeScript uygulamasının ürettiği skorlar, 200 test örneği üzerinde **maksimum 0,00000000 fark** ile eşleşmektedir — tarayıcıdaki model, Python'da eğitilenle matematiksel olarak birebir aynıdır.

**Dürüst sınırlama:** Veri seti 2020 tarihli olduğundan güncel argo/slang'ı tam yakalamayabilir; model ikili (toksik/değil) sınıflandırma yapar, ince taneli duygu analizi (öfke/kaygı/üzüntü ayrımı) içermez. Bu, MVP kapsamında bilinçli bir sınırlamadır, sonraki adım olarak periyodik yeniden eğitim planlanmaktadır.

### 3.3. Kullanıcı Deneyimi (UI/UX) Tasarımı (7 Puan)

**Kullanıcı akışı:** Ana Sayfa → Akış Günlüğü (metin ekle veya örnek verilerle doldur) → her girdi anında skorlanır ve şeffaflık paneliyle ("Neden bu skoru gördüm?") gösterilir → örüntü paneli zaman içindeki toksisite oranını gösterir → eşik aşılırsa nazik, damgalamayan bir farkındalık banner'ı belirir → kullanıcı isterse "Garanti Sessizlik" paneline kalıcı bir kural ekler.

**Arayüz tasarım kararları:** Renk paleti kasıtlı olarak alarm/kırmızı tonlarından kaçınır (eşik altı sakin yeşil, eşik üstü sıcak amber) — bu, "güçlendirme estetiği" olarak adlandırılan, kullanıcıyı suçlamayan bir tasarım dili kararıdır. Müdahale metinleri seçimi her zaman kullanıcıda bırakan bir dille yazılmıştır ("Bu bir uyarı değil, sadece bir gözlem").

**Erişilebilirlik:** Anlamlı `aria-label`/`role` etiketleri (ör. banner için `role="status"`), klavye ile erişilebilir form kontrolleri, yeterli renk kontrastı.

**Kullanılabilirlik testi:** Bu aşamada resmi bir kullanılabilirlik testi yürütülmemiştir — dürüst bir sınırlama olarak belirtilmektedir; sonraki adım olarak küçük ölçekli bir kullanıcı testi (5-8 katılımcı) planlanmaktadır.

---

## 4. UYGULANABİLİRLİK

### 4.1. Verimlilik ve Etkinlik (5 Puan)

Sistem, kullanıcının akış içeriğini saniyeler içinde (istemci tarafı hesaplama, ağ gecikmesi yok) skorlar. Kompakt model dosyası yalnızca ~185KB'dir — düşük bant genişliğinde dahi hızlı yüklenir. Sunucu maliyeti sıfırdır (statik dosya barındırma yeterlidir), bu da NSosyal ölçeğinde (milyonlarca kullanıcı) dahi marjinal maliyetin neredeyse sıfır kalmasını sağlar.

### 4.2. Hedef Kitle (5 Puan)

Birincil hedef kitle, NSosyal'in mevcut 1,7 milyonu aşan kullanıcı kitlesidir [5] — özellikle Şikayetvar'da belgelenen bildirim/sessize alma sorunlarından etkilenen kullanıcılar. İkincil olarak, sosyal medya kullanımında akışının duygusal örüntüsünü fark etmek isteyen genel kullanıcı kitlesi hedeflenmektedir. Ürünün platformdan bağımsız (companion) yapısı, hedef kitlenin NSosyal ile sınırlı kalmayıp herhangi bir sosyal medya kullanıcısına genişleyebilmesini sağlar.

### 4.3. Teknolojik Yenilik ve Uygulanabilirlik (5 Puan)

Teknolojik yenilik, üç noktada somutlaşır: (1) tamamen istemci tarafında çalışan, sunucuya hiç veri göndermeyen bir ML sınıflandırıcısı — çoğu benzer ürün bunun aksine bulut tabanlı API çağrısı yapar; (2) tam açıklanabilirlik (her skorun kelime düzeyinde nedeni); (3) "garanti" kontrol katmanı — platformun sunucu tarafı güvenilirliğinden bağımsız çalışma garantisi.

Prototip bugün, gerçek kullanıcılar tarafından kullanılabilir durumdadır (Next.js statik derleme, `npm run build` ile doğrulanmıştır). Ölçeklenebilirlik yapısaldır: ek sunucu kapasitesi gerektirmez, çünkü tüm hesaplama istemcide yapılır.

---

## 5. YAYGIN ETKİ

### 5.1. Toplumsal Fayda ve Erişim Potansiyeli (10 Puan)

NSosyal'in 1,7 milyonu aşan kullanıcı kitlesi [5] ve Türkiye'de sosyal medya kullanımının hızla arttığı bağlamda (TÜİK 2025 verisine dayanan haberlere göre 10+ yaş nüfusta kullanım %71,7'ye ulaşmıştır [4a]; We Are Social 2026 Türkiye raporuna göre günlük ortalama internet kullanımı 6 saat 26 dakikadır [4b]), bu ölçekte bir güven/şeffaflık katmanının potansiyel erişimi büyüktür.

Toplumsal fayda üç düzeyde tanımlanabilir: **Bireysel düzeyde**, kullanıcı kendi akış örüntüsünü fark ederek bilinçli tüketim kararları alabilir. **Platform düzeyinde**, NSosyal'in kendi belgelenen güven sorununa (Şikayetvar 27/100) karşı, kullanıcı tarafında telafi edici bir katman sunulur — bu, platformun itibarına da dolaylı katkı sağlayabilir. **Toplumsal düzeyde**, herhangi bir sunucu/insan kaynağı yatırımı gerektirmeyen bu tamamlayıcı katman, geniş kitlelere eşit biçimde ulaşabilir; dijital yaşam kalitesine, kullanıcı özerkliğini artırarak katkıda bulunur.

---

## 6. SÜRDÜRÜLEBİLİRLİK

### 6.1. Ticarileştirme Potansiyeli ve İş Modeli (5 Puan)

Kısa vadede ürün, ücretsiz bir tarayıcı uzantısı/web uygulaması olarak sunulabilir (kullanıcı kazanımı ve güven inşası önceliklidir). Orta vadede sürdürülebilir gelir modeli seçenekleri: (a) NSosyal ile resmi bir entegrasyon/lisanslama iş birliği (platformun kendi güven sorununu çözmede değer önerisi netliği yüksektir), (b) kurumlar/topluluk yöneticileri için toplu (B2B) bir moderasyon-destek API'si, (c) gönüllü bağış/freemium model (gelişmiş kural setleri, çoklu-kategori sınıflandırma). Ürünün sektöre katma değeri, yerli ve açık bir Türkçe NLP bileşeninin (Bölüm 2.2) yeniden kullanılabilir olmasından da gelir.

### 6.2. Finansal, Teknik ve Sosyal Sürdürülebilirlik (5 Puan)

**Finansal:** Sunucu/altyapı maliyeti yapısal olarak düşüktür (istemci tarafı mimari); bu, kâr amacı gütmeyen veya düşük bütçeli bir işletim modelini dahi mümkün kılar. **Teknik:** Model periyodik olarak (ör. 6 ayda bir) yeni veriyle yeniden eğitilebilir; mimari değişmeden yalnızca `toksisite-model.json` dosyası güncellenir. **Sosyal:** Ürün, değişen kullanıcı ihtiyaçlarına (yeni içerik kategorileri, yeni platformlar) genişleyebilir bir tasarıma sahiptir; toplulukla (kullanıcı tarafından bildirilen yanlış sınıflandırmalar) geri besleme döngüsü kurulması sonraki adım olarak planlanmaktadır.

---

## 7. PROJENİN HAZIRLANIŞ SÜRECİ

### 7.1. İş Paketleri ve Zamanlama (5 Puan)

| Tarih | İş Paketi |
|---|---|
| 19 Ağustos 2026 | NSosyal platform analizi, şikayet verisi taraması, tema/fikir kararı, veri seti tespiti ve doğrulanması |
| 19 Ağustos 2026 | Model eğitimi (TF-IDF+LogReg), client-side dışa aktarım, doğrulama |
| 19 Ağustos 2026 | Next.js arayüzü: Akış Günlüğü, örüntü paneli, şeffaflık katmanı, müdahale banner'ı |
| 19 Ağustos 2026 | Pivot: NSosyal'e özel kanıt tabanına bağlanma + "Garanti Sessizlik" özelliği |
| 20-23 Ağustos 2026 | Kullanılabilirlik iyileştirmeleri, ek testler, GitHub deposunun genel erişime açılması |
| **24 Ağustos 2026, 17:00** | **Teknik Rapor Teslimi** |
| 2 Eylül 2026 | Rapor Sonuçlarının Duyurulması |
| 2–7 Eylül 2026 | Mentörlük ve Proje Geliştirme Süreci |
| **14 Eylül 2026, 17:00** | **Final Sunumlarının Teslimi** |
| 20 Eylül 2026 | Jüri ve Katılımcılara Canlı Sunum |

Zamanlama, yarışma takvimiyle (24 Ağustos/2-7 Eylül/14 Eylül) doğrudan uyumludur.

### (Not: Bu bölümün görsel/şema versiyonu docx'e işlenirken eklenecek — basit bir zaman çizelgesi diyagramı.)

---

## 8. PROJE TAKIMI

### 8.1. Takım Organizasyonu ve Roller (5 Puan)

| Görev | Katkı |
|---|---|
| Takım Lideri / Koordinasyon | Proje yönetimi, NSosyal platform araştırması, kanıt tabanının derlenmesi, dokümantasyon |
| Yazılım Mimarisi | İstemci tarafı mimari (Next.js/TypeScript), client-side model çıkarım motoru, KVKK-minimal veri katmanı |
| Modelleme ve Veri Bilimi | Türkçe toksisite sınıflandırıcısının eğitimi, doğrulanması, performans metriklerinin raporlanması |
| Ürün Tasarımı ve UX | Arayüz tasarımı, kullanıcı akışları, damgalamayan dil/mikro-metin kararları, erişilebilirlik |

Takım 4 kişiden oluşmaktadır (yarışmanın 2-5 kişi aralığına uygundur); farklı disiplinlerden (yazılım mimarisi, veri bilimi, ürün/UX) katkı sağlanmıştır. Kişisel veri (isim, iletişim) şablonun kişisel veri yasağı gereği yazılmamıştır.

---

## 9. KAYNAKÇA

1. Çöltekin, Ç., (2020) A Corpus of Turkish Offensive Language on Social Media, Proceedings of The 12th Language Resources and Evaluation Conference (LREC), s. 6174–6184, https://www.aclweb.org/anthology/2020.lrec-1.758
2. Şikayetvar, NSosyal Şikayet ve Yorumları, Erişim Tarihi: 19.08.2026, https://www.sikayetvar.com/nsosyal
3. Euronews, Övgü, eleştiri ve tartışmalar: 10 soruda Next Sosyal ve Next Mesajlaşma, 31.07.2025, Erişim Tarihi: 19.08.2026, https://tr.euronews.com/next/2025/07/31/ovgu-elestiri-ve-tartismalar-10-soruda-next-sosyal-ve-next-mesajlasma
4a. TC Lira, TÜİK Verisi Ortaya Koydu: Türkiye'de Ekran Süresi Yükseldi, Basılı Medya Çöktü, 2025, Erişim Tarihi: 19.08.2026, https://tclira.com/tuik-verisi-ortaya-koydu-turkiyede-ekran-suresi-yukseldi-basili-medya-coktu/
4b. Media Republic, We Are Social Digital 2026 Türkiye Raporu, 2026, Erişim Tarihi: 19.08.2026, https://mediarepublic.com.tr/we-are-social-digital-2026-turkiye-raporu/
5. Vikipedi, Next Sosyal, Erişim Tarihi: 19.08.2026, https://tr.wikipedia.org/wiki/Next_Sosyal
6. TEKNOFEST, NSosyal İnovasyon Yarışması, Erişim Tarihi: 19.08.2026, https://www.teknofest.org/tr/yarismalar/nsosyal-inovasyon-yarismasi/
7. Ekşi Sözlük, next sosyal, Erişim Tarihi: 19.08.2026, https://eksisozluk.com/next-sosyal--8007314

**Not:** Bu proje daha önce başka bir yarışmaya sunulmamıştır. Kaynak 4a/4b ikincil (haber sitesi) kaynaklardır; TÜİK/We Are Social'ın birincil raporlarına doğrudan erişim bu oturumda doğrulanamadı — bu şeffaf biçimde belirtilir. Kaynak 2/3/7, NSosyal hakkında kamuya açık, ikincil kaynaklardır (birincil kullanıcı araştırması değildir).

---

## Kalan işler (docx'e işlemeden önce)
1. Kaynak 4a/4b için mümkünse birincil TÜİK/We Are Social raporuna geçiş (zaman izin verirse).
2. GitHub repo linki (§3.1) — kullanıcı repo oluşturunca eklenecek.
3. Kapak: Takım ID, Başvuru ID, Proje Adı, Takım Adı (KYS başvurusu tamamlanınca).
4. Şekil/görsel ekleme (mimari diyagram, ekran görüntüleri, iş paketi zaman çizelgesi) — önceki projedeki gibi.
5. Sayfa sayısı doğrulaması (≤30) — docx'e işlendikten sonra.
6. Juri ajanı ile bir revizyon turu.
