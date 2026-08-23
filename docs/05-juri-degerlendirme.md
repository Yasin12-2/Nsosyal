# Jüri Değerlendirmesi — "Akış Aynası – Güven Kartı" (Takım: Eşik)

**Değerlendiren:** TEKNOFEST/NSosyal jüri simülasyonu (akademisyen + mühendis çift bakış açısı)
**Kaynak:** `docs/00-sartname-ozeti.md` (rubrik, 100 puan) + `NSosyal_Inovasyon_2026_-_Proje_Teknik_Raporu_1_u6IVb.pdf` (12 sayfa, tam metin okundu)
**Tema:** Sosyal Yapay Zekâ — Teknik Yeterlilik %30 ağırlıkla bu temada en kritik eksen

## Yönetici Özeti

**Toplam Puan: 81/100.** Bu, ortalamanın belirgin biçimde üzerinde, "mentörlük sürecine geçme" ihtimali yüksek ama finalistlik garanti etmeyen bir rapor. Raporun güçlü yanı **teknik dokümantasyon derinliği** (3.1, 3.2, 4.1) — bu tam da Sosyal YZ temasının en ağırlıklı ekseni (%30) olduğu için stratejik olarak doğru yerde güçlü. Raporun en zayıf yanı ise **en yüksek puanlı tekil kriter olan 5.1 Toplumsal Fayda/Erişim Potansiyeli (10 puan)** — çünkü ürünün "companion/copy-paste" doğası ile "geniş kitleye erişim" iddiası arasındaki gerilim raporda gerçekten çözülmemiş, sadece es geçilmiş. İkinci ciddi sorun, 1.2 bölümündeki bir **kaynak çelişkisi** ([7][8] atıfları, iddia ettikleri şeyin tam tersini söylüyor) — bu, dikkatli bir jüri üyesinin ilk okumada yakalayacağı türden bir hata ve raporun genelindeki titizlik izlenimini zedeliyor.

Ekip bu raporu iddiaya göre 19-23 Ağustos (4-5 gün) içinde hazırlamış görünüyor; bu hem etkileyici bir hız hem de bir güvenilirlik riski — jüri "bu kadar kapsamlı doğrulama gerçekten bu sürede mi yapıldı" sorusunu sorabilir.

## Etik ve Uygunluk Kontrolü

**Diskalifiye edici bir ihlal tespit edilmedi.** Ayrıntılar:

- **Takım üyesi kişisel verisi:** Bölüm 8.1'de isim/iletişim/fotoğraf **yok** — kurala tam uyum. Rapor bunu açıkça da belirtmiş ("Değerlendirme esasları gereği... kişisel verilerine yer verilmemiştir"). Uygun.
- **Damgalayıcı dil:** Yok — tam tersine, ekip bilinçli olarak damgalamayan bir tasarım dili benimsemiş (kırmızı/alarm renklerinden kaçınma, "Bu bir uyarı değil, sadece bir gözlem" gibi ifadeler). Bu, ruh sağlığı/dijital refah perspektifinden **olumlu** bir puan.
- **Kaynaksız/abartılı iddia:** Genel olarak iddialar kaynaklı (Şikayetvar, TÜİK, LREC bildirisi, GitHub repo linki). Ancak iki noktada zayıflık var: (a) [4] ve [5] kaynakları TÜİK/We Are Social'ın **birincil** raporları değil, bu verileri aktaran ikincil haber/blog siteleri; (b) 1.2'deki [7][8] atıfı ile metindeki iddia birbiriyle çelişiyor (bkz. Revizyon #3). Bu bir "yalan" değil ama bir **tutarsızlık/özensizlik** izlenimi yaratıyor — intihal değil ama kaynak kullanımı disiplini sorgulanabilir.
- **KVKK/gizlilik — orta düzey uyarı (diskalifiye değil, ama düzeltilmeli):** Şekil 1 ekran görüntüsünde, konuyla doğrudan ilgili olmayan üçüncü taraf kullanıcı hesapları (ör. "Melik @veribas_melik", "BÜŞRA AKİPEK") kullanıcı adı ve takipçi sayılarıyla birlikte bulanıklaştırılmadan görünüyor. Şartnamenin açık kuralı yalnızca **takım üyelerinin** kişisel verisini yasaklıyor, dolayısıyla bu teknik bir ihlal değil (veri zaten NSosyal'de herkese açık) — ama profesyonel/etik bir rapor, analize konu olmayan üçüncü taraf hesapları kırpar/bulanıklaştırır. Bu, jüri tarafından "özensiz kanıt sunumu" olarak okunabilir; düşük maliyetli, kolay düzeltilebilir bir husus.
- **Ürünün kendisi etik açıdan iyi tasarlanmış:** İstemci tarafı (client-side) mimari, sunucuya veri göndermeme, "Güven Kartı"nın bir "ihbar" değil "farkındalık" aracı olarak çerçevelenmesi — bunlar hem KVKK-minimal hem de damgalamayan bir yaklaşımın işaretleri. Ancak modelin OFF-sınıfı F1 skorunun görece düşük olması (bkz. 3.2 değerlendirmesi), yanlış pozitif/negatif riskinin rapor içinde yeterince tartışılmamış olması, "etik sorumluluk" açısından bir eksiklik (bkz. Revizyon #4).

**Sonuç: Rapor uygunluk ön incelemesinden GEÇER.** Diskalifiye riski yok, ancak jüri notlarında "özensizlik" izlenimi bırakabilecek 2-3 nokta var.

## Detaylı Puan Tablosu

| # | Kriter | Maks | Puan | Gerekçe (özet) |
|---|---|---|---|---|
| 1.1 | Proje Konusu ve Amacı | 7 | **6** | Problem/amaç net, tema uyumu şartname atfıyla kanıtlanmış, hedef kitle tanımlı. Ancak bölüm "kapsam" içeriğiyle biraz iç içe geçmiş ve tekil kanıt olarak Wikipedia kullanılmış (zayıf kaynak). |
| 1.2 | Proje Kapsamı ve Yöntemi | 8 | **6** | Dört aşamalı yöntem net, "companion app" kararı dürüstçe gerekçelendirilmiş. Ancak [7][8] kaynak çelişkisi (bkz. Revizyon #3) bu bölümün güvenilirliğini doğrudan zedeliyor. |
| 2.1 | Problem Tanımı ve Mevcut Çözümler | 7 | **6** | Rapordaki en güçlü bölümlerden biri: somut istatistik (27/100, 13/119), belgelenmiş örnek (5 ay bildirim), görsel kanıt (Şekil 1), rakip kıyası (Opal/Forest/One Sec). Şekil 1'deki üçüncü taraf veri temizliği eksikliği nedeniyle 1 puan kırıldı. |
| 2.2 | Çözüm Fikri, Özgünlük ve Yerlilik | 8 | **7** | Farklılaşma 3 noktada somut (a/b/c), yerlilik unsuru (kendi eğitilen model, yabancı LLM'e bağımlılık yok) şartname gereksinimini karşılıyor. Ama "özgünlük" temelde klasik ML + kural tabanlı iki modülün birleşimi — düşünsel sıçrama değil, iyi mühendislik. Bu ayrım rapor içinde biraz fazla iddialı sunulmuş. |
| 3.1 | Yöntem, Altyapı, Sürüm Kontrolü | 7 | **7** | Somut teknoloji yığını, gerçek GitHub linki, ölçülebilir kalite kapıları (tsc/eslint/vitest, 49 test, `next build`). Bu, Sosyal YZ temasının en ağırlıklı ekseni (%30 Teknik Yeterlilik) için tam isabet — raporun en güçlü bölümü. |
| 3.2 | Model ve Veri Doğrulama | 6 | **5** | Şartnamenin istediği her maddeye (ön işleme, sınıf dengesizliği, overfitting kontrolü, performans metrikleri) değinilmiş — nadir görülen bir titizlik. Ancak OFF-sınıfı F1 skoru (0,56-0,58) düşük/orta düzeyde ve bu, precision/recall ayrımı yapılmadan, yanlış pozitif/negatif riski tartışılmadan geçiştirilmiş. |
| 3.3 | Kullanıcı Deneyimi (UI/UX) | 7 | **6** | Kullanıcı akışı, tasarım felsefesi (damgalamayan dil, renk paleti), erişilebilirlik detaylı ve düşünülmüş. Ama resmî kullanılabilirlik testi yok — yalnızca ekip içi "dogfooding". Dürüstçe belirtilmiş olması takdire değer ama puanı düşürüyor. |
| 4.1 | Verimlilik ve Etkinlik | 5 | **5** | Somut, ölçülebilir, doğrulanabilir metrikler (185KB model boyutu, 0 fark doğrulaması, 49/49 test). Tam puan. |
| 4.2 | Hedef Kitle | 5 | **5** | Birincil/ikincil kitle net, kullanıcı şikâyetlerinden türetilmiş — varsayımsal değil. Tam puan. |
| 4.3 | Teknolojik Yenilik ve Uygulanabilirlik | 5 | **4** | İçerik doğru ama 2.2/3.1/5.1 ile ciddi cümle/argüman tekrarı var (şartname "cümleler tekrar olmamalı" diyor) — bu bölüm yeni bilgi eklemek yerine önceki bölümleri yeniden ifade ediyor. |
| **5.1** | **Toplumsal Fayda ve Erişim Potansiyeli** | **10** | **6** | **En yüksek puanlı tekil kriter, en büyük risk burada.** İstatistiksel bağlam (TÜİK, kullanıcı sayısı) ve 3 somut senaryo iyi ama ürünün "kullanıcı içeriği elle kopyala-yapıştır" modeliyle gerçek kullanıcı benimsemesi/erişim arasındaki sürtünme hiç ele alınmamış. "Sunucu maliyeti sıfır → erişim büyük" mantığı **teknik ölçeklenebilirlik** ile **fiili kullanıcı benimsemesini** birbirine karıştırıyor — bunlar aynı şey değil. |
| 6.1 | Ticarileştirme Potansiyeli ve İş Modeli | 5 | **4** | Üç seçenek (B2B API, freemium, NSosyal lisanslama) mantıklı ama tamamen nitel — hiçbir rakam/pazar büyüklüğü tahmini yok. |
| 6.2 | Finansal/Teknik/Sosyal Sürdürülebilirlik | 5 | **4** | Mantıklı ve tutarlı ama jenerik; somut tetikleyiciler (ne zaman yeniden eğitim, hangi eşikte) tanımlanmamış. |
| 7.1 | İş Paketleri ve Zamanlama | 5 | **3** | Takvim resmi tarihlerle çelişmiyor (kural karşılanmış) ama TÜM geliştirme 19-23 Ağustos'a (4-5 gün) sıkıştırılmış görünüyor; öncesinde hiçbir ideation/planlama kaydı yok — bu inandırıcılığı zedeliyor. Ayrıca düz tablo sunulmuş, "GÖRSEL takvim" beklentisi (Gantt vb.) karşılanmamış. |
| 8.1 | Takım Organizasyonu ve Roller | 5 | **4** | Kişisel veri kuralına tam uyum, roller net. Ama 4 üyenin tamamı mühendislik kökenli (3x EE, 1x Makine Müh.) — "ürün/UX" ve "veri bilimi" unvan bazında ayrılmış olsa da disiplinlerarasılık zayıf. "Kesin üye sayısı KYS'de netleşecek" ifadesi bu denli son ana yakın belirsizlik izlenimi veriyor. |
| 9 | Kaynakça — Formata Uygunluk | 5 | **3** | Köşeli parantez formatı doğru uygulanmış. Ama [9] (Ekşi Sözlük) kaynakçada var, metin içinde hiçbir yerde atıf edilmemiş (yetim kaynak); [4]/[5] birincil değil ikincil kaynak; [7][8] içerik-metin uyumsuzluğu (bkz. Revizyon #3). |
| | **TOPLAM** | **100** | **81** | |

## Tema Ağırlıklarına Göre Kritik Alan Analizi

Sosyal YZ temasında jüri, nihai (rapor+prototip+final) değerlendirmede şu ağırlıkları kullanıyor: **Teknik Yeterlilik %30**, Yenilikçilik/Özgünlük %20, Problemi Çözme Başarısı %20, Sunum/Prototip %15, UX %10, İş Modeli %5. Bu, raporun 1.1-9 alt kriterlerinden farklı bir eksen olsa da, hangi bölümlere orantısız efor harcanması gerektiğini gösteriyor:

- **En kritik yatırım alanı — Teknik Yeterlilik (%30) → Bölüm 3.1/3.2/4.3:** Bu ekip burada zaten görece güçlü (3.1=7/7, 3.2=5/6). Stratejik olarak doğru yerde güçlüler; kalan tek gerçek açık, 3.2'deki performans analizinin sığlığı (Revizyon #4) — bu, %30 ağırlıklı eksende görünür bir zafiyet olduğu için diğer düşük puanlı ama düşük ağırlıklı kriterlerden (ör. 6.1 İş Modeli %5) daha önce düzeltilmeli.
- **İkinci kritik alan — Problemi Çözme Başarısı (%20) → Bölüm 2.1/2.2/5.1:** 2.1/2.2 güçlü, ama 5.1'deki erişim/benimseme sorunu tam da "bu çözüm gerçekten problemi çözüyor mu, yoksa teorik bir prototip mi" sorusunun kalbinde — bu nedenle Revizyon #1 en yüksek öncelikli.
- **Düşük öncelik — UX (%10) ve İş Modeli (%5):** 3.3 ve 6.1/6.2'deki eksiklikler gerçek ama düşük ağırlıklı; zaman kısıtlıysa (rapor teslimi yarın) buraya minimum efor (kozmetik/hızlı düzeltme) yeterli, üzerine çok zaman harcanmamalı.
- **Sunum/Prototip Kalitesi (%15):** Bu aşamada video istenmiyor, ancak GitHub reposunun gerçekten canlı, jüri tarafından incelenebilir, iddia edilen commit geçmişini/test sayısını yansıtan bir depo olması bu ekseni doğrudan besliyor — bkz. Revizyon #1 (en yüksek öncelik).

## Kullanıcının Sorduğu Özel Sorulara Yanıt

**(a) Özgünlük gerçek mi, iddialı ama kanıtsız mı?**
Orta yol: **kanıtsız değil ama abartılı çerçevelenmiş.** Ekip, iddialarını somut kanıtlarla destekliyor (gerçek model, gerçek repo, gerçek testler) — bu iyi. Ama "özgünlük" olarak sunulan şey aslında iki bilinen tekniğin (TF-IDF+LogReg toksisite sınıflandırması, TF-IDF kosinüs benzerliği ile şablon tespiti) NSosyal'e özgü bir probleme **iyi mühendislikle uygulanması**. Bu meşru bir değer ama "düşünsel özgünlük" iddiasıyla eşdeğer değil. Jüri muhtemelen "bu bir inovasyon mu yoksa iyi bir mühendislik projesi mi" ayrımını sorgulayacaktır.

**(b) Yerlilik vurgusu yeterli mi?**
Şartnamenin "en az bir yerli bileşen" gereksinimini **harfiyen karşılıyor**: Türkçe akademik veri seti, sıfırdan eğitilmiş model, yabancı LLM API'sine bağımlılık yok. Ancak bu "yerlilik" mütevazı düzeyde — 2020 tarihli, halka açık bir akademik veri setinin üzerine klasik bir sınıflandırıcı eğitmek, "yerli teknoloji geliştirme" vitrini için asgari düzeyde yeterli ama parlak değil. Rapor bunu dürüstçe bir sınırlama olarak da belirtmiş (veri setinin güncel olmaması) — bu tutarlılık takdire değer.

**(c) Teknik derinlik jüriyi ikna eder mi?**
Evet, raporun **en güçlü** yönü bu — 3.1/3.2/4.1 gerçek, doğrulanabilir, sayısal iddialar içeriyor (0,00000000 fark doğrulaması, 49/49 test, model boyutu). Bir mühendis jüri üyesi için bu, çoğu rakip rapordan daha ikna edici olacaktır. Tek zayıf nokta: performans metriklerinin (özellikle OFF F1) yorumlanmasının yüzeysel kalması (Revizyon #4).

**(d) "Companion web app" (resmi entegrasyon değil) riski yeterince ele alınmış mı?**
**Kısmen.** 1.2'de bu sınırlama dürüstçe kabul edilip gerekçelendirilmiş (API/webhook yok) — bu iyi bir kriz yönetimi. Ancak bu kararın **sonuçları** (kullanıcı benimseme sürtünmesi, "neden biri her gün ayrı bir siteye metin kopyalayıp yapıştırsın" sorusu) hiçbir yerde açıkça tartışılmamış; tarayıcı uzantısı fikri yalnızca "sonraki adım" olarak geçiştirilmiş, oysa bu asıl **çözümün merkezine** taşınmalı (bkz. Revizyon #1). Bu, raporun en büyük stratejik açığı.

**(e) 5.1 Yaygın Etki gerçekten güçlü mü?**
Hayır, **görünüşte güçlü ama temelde kırılgan.** İstatistiksel bağlam ve senaryo örnekleri iyi yazılmış, okuyucuyu ilk okumada ikna edebilir. Ama dikkatli bir jüri üyesi "sunucu maliyeti sıfır = erişim potansiyeli büyük" mantığının bir **teknik ölçeklenebilirlik** argümanı olduğunu, bir **kullanıcı benimseme/erişim** argümanı olmadığını fark edecektir. En yüksek puanlı (10/100) tekil kriter olduğu için bu, raporun tek en önemli revizyon noktasıdır.

## Öncelik Sıralı Revizyon Listesi (10 madde)

1. **[EN YÜKSEK ÖNCELİK — doğrulanabilirlik riski] GitHub reposunu kontrol edin.** `https://github.com/Yasin12-2/Nsosyal` genel erişime açık mı, commit geçmişi rapordaki iddiaları (veri hazırlığı → model eğitimi → arayüz → Garanti Sessizlik → Güven Kartı kilometre taşları, 49 test) gerçekten yansıtıyor mu, README var mı? Jüri bu linke tıklayacaktır — repo boş/özel/iddialarla uyumsuzsa rapordaki tüm teknik güvenilirlik anında çöker. Teslimden önce bizzat kontrol edilmeli.

2. **[EN YÜKSEK ÖNCELİK — 10 puanlık kriter] 5.1'e erişim/benimseme sürtünmesini ele alan bir paragraf ekleyin.** Şu an "kullanıcı elle kopyala-yapıştır yapmalı" modeli ile "geniş erişim potansiyeli" iddiası arasındaki çelişki hiç tartışılmıyor. Ya (a) bu modelin neden hedefli/bilinçli kullanım için yeterli olduğunu somut bir kullanıcı senaryosuyla savunun, ya da (b) tarayıcı uzantısı fikrini "sonraki adım" satırından çıkarıp 5.1'in merkezi bir parçası, somut bir yol haritası olarak sunun.

3. **[YÜKSEK — tutarlılık] 1.2'deki [7][8] kaynak çelişkisini düzeltin.** Metin "kaynak kodu bulunamadı" diyor, [7][8] başlıkları "kaynak kodu yayımlandı" diyor. Ya cümleyi [7][8]'in gerçekte söylediğiyle uyumlu hale getirin (ör. "kaynak kodu Ağustos 2025'te yayımlandı ancak resmî bir API/webhook sözleşmesi bulunmuyor"), ya da bu atıfları farklı, tutarlı bir cümleye taşıyın.

4. **[YÜKSEK — %30 ağırlıklı eksen] 3.2'de model performansını derinleştirin.** OFF-sınıfı F1 (0,56-0,58) için ayrı precision/recall değerleri, bir karışıklık matrisi (confusion matrix) ve yanlış pozitif/negatif senaryolarının kullanıcı güvenine etkisi eklenmeli. Bu, hem teknik jüri hem de "yanlış pozitifte etik sorumluluk" sorusunu soracak akademisyen jüri üyesi için kritik.

5. **[ORTA-YÜKSEK] 7.1 zaman çizelgesini güçlendirin.** 19 Ağustos öncesine ait bir fikir/planlama aşaması ekleyin (varsa gerçek tarihlerle, yoksa en azından "ön araştırma/literatür taraması" olarak çerçeveleyin) ve tabloyu görsel bir Gantt şemasına dönüştürün — şartname "GÖRSEL takvim" istiyor, düz tablo bunu tam karşılamıyor.

6. **[ORTA] Kaynakça tutarlılığını düzeltin.** [9] (Ekşi Sözlük) metinde hiç atıf edilmiyor — ya metne bir atıf ekleyin ya da kaynakçadan çıkarın. Mümkünse [4]/[5] için TÜİK/We Are Social'ın birincil raporlarına doğrudan atıf yapın.

7. **[ORTA] Şekil 1'i düzenleyin.** Konuyla ilgisiz üçüncü taraf hesapları (Melik, Büşra Akipek) bulanıklaştırın/kırpın; yalnızca @selcukbayraktar, @nsosyal ve @realelonmusk görünür kalsın. Kolay, hızlı, düşük maliyetli bir düzeltme.

8. **[ORTA] 4.3'teki tekrarları azaltın.** 2.2/3.1/5.1 ile örtüşen cümleleri kısaltıp "(bkz. Bölüm 2.2)" gibi çapraz referanslarla değiştirin; boşalan yere yeni bir açı (ör. somut ölçeklenme hesabı: "X kullanıcıda tahmini maliyet Y") ekleyin.

9. **[DÜŞÜK-ORTA, düşük ağırlık ama kolay kazanım] 3.3'e mini bir pilot test ekleyin.** Zaman izin veriyorsa 2-3 kişilik informal bir kullanılabilirlik testi (arkadaş/aile) yapıp "n=3 informal pilot, X/3 kullanıcı akışı sorunsuz tamamladı" gibi bir cümle eklemek, "dürüst sınırlama" ifadesini somut bir kanıta dönüştürür.

10. **[DÜŞÜK, %5 ağırlık] 6.1'e nicel bir referans noktası ekleyin.** En azından kaba bir karşılaştırma (ör. benzer B2B moderasyon API'lerinin fiyat aralığı) — 2-3 cümle yeterli, fazla zaman harcamayın.

11. **[DÜŞÜK, kozmetik] 8.1'deki belirsizlik ifadesini netleştirin.** "Kesin üye sayısı KYS başvurusu tamamlandığında netleşecektir" — teslim tarihine bu kadar yakın bu ifade tereddüt izlenimi veriyor; mümkünse kesin bir ifadeyle değiştirin.

## Sonuç

81/100, mentörlük aşamasına geçme ihtimali yüksek, finalistlik için sınırda bir rapor. Zaman çok kısıtlı olduğundan (teslim yarın), **1, 2 ve 3 numaralı maddeler mutlaka** ele alınmalı — bunlar hem en yüksek puan etkisine sahip hem de görece hızlı düzeltilebilir (repo kontrolü + bir paragraf + bir cümle düzeltmesi). 4 ve 5 numaralı maddeler zaman kalırsa eklenmeli. Geri kalanlar mentörlük sürecine bırakılabilir.
