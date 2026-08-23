# Jüri Değerlendirmesi — TUR 2 — "Akış Aynası – Güven Kartı" (Takım: Eşik)

**Kaynak:** `docs/00-sartname-ozeti.md` (rubrik) + güncel `NSosyal_Inovasyon_2026_-_Proje_Teknik_Raporu_1_u6IVb.pdf` (13 sayfa, baştan sona tam metin okundu, tur 1'deki gibi kör kopyalama yapılmadan yeniden puanlandı) + `README.md`, `docs/model-egitim-raporu.md`, `src/` klasörü çapraz kontrolü.

## Yönetici Özeti

**Yeni toplam puan: 91/100** (Tur 1: 81/100 → **+10**).

Bu, sıra dışı derecede etkili bir revizyon turu. 11 maddenin **9'u gerçekten rubrik puanını hareket ettirdi**, 2'si kısmi/kozmetik kaldı. En kritik nokta — 5.1 Toplumsal Fayda (10 puan, en yüksek ağırlıklı tekil kriter) — artık savunma iddiasını gerçekten üstleniyor, kaçmıyor. 3.2'deki (Sosyal YZ temasının %30 ağırlıklı ekseni) performans analizi artık akademik düzeyde: precision/recall/karışıklık matrisi + yanlış pozitif-negatif etik tartışması var. Kaynak çelişkisi ([7][8]) ve yetim kaynak ([9]) düzeltildi, TOC hizalandı, Şekil 2 (Gantt) eklendi, Figure 1'deki üçüncü taraf hesapları bulanıklaştırıldı.

Rapor artık **teslime hazır** — ama iki uyarı ile (bkz. Nihai Tavsiye).

## Değişim Tablosu — 16 Alt Kriter

| # | Kriter | Maks | Tur 1 | Tur 2 | Δ | Gerekçe (tur 2) |
|---|---|---|---|---|---|---|
| 1.1 | Proje Konusu ve Amacı | 7 | 6 | **6** | 0 | Kapsam/amaç ayrımı artık temiz (tur 1'deki "1.2 ile iç içe geçme" sorunu çözülmüş — 1.1 saf problem/amaç, 1.2 saf yöntem). Ama hâlâ ölçeğin (1,7M kullanıcı) tek kanıtı Wikipedia [6] — bu, tur 1'de not edilen zayıflık, dokunulmamış. |
| 1.2 | Proje Kapsamı ve Yöntemi | 8 | 6 | **8** | **+2** | [7][8] çelişkisi tam düzeltildi: cümle artık "kaynak kodu yayımlandığı duyuruldu AMA keşfedilebilir depo linki bu turda bulunamadı" diyor — [7][8]'in gerçek içeriğiyle (duyuru haberleri) birebir uyumlu. Dört aşamalı yöntem + tarayıcı uzantısı yol haritası net. Tam puan. |
| 2.1 | Problem Tanımı ve Mevcut Çözümler | 7 | 6 | **7** | **+1** | Şekil 1'deki ilgisiz üçüncü taraf hesapları artık görsel olarak bulanıklaştırılmış/kırpılmış (görsel doğrulandı) — tur 1'in tek kırılma nedeni ortadan kalktı. İçerik zaten güçlüydü. |
| 2.2 | Çözüm Fikri, Özgünlük ve Yerlilik | 8 | 7 | **7** | 0 | Değişmedi. "Özgünlük" hâlâ iyi mühendislik + düşünsel sıçrama arasında biraz iddialı çerçevelenmiş; bu revizyon turunda dokunulmamış (zaten düşük öncelikliydi). |
| 3.1 | Yöntem, Altyapı, Sürüm Kontrolü | 7 | 7 | **7** | 0 | Zaten tam puandı; gerçek repo linki mevcut, yerel `src/` yapısı (rotalar, test dosyaları) rapordaki iddialarla tutarlı. |
| 3.2 | Model ve Veri Doğrulama | 6 | 5 | **6** | **+1** | En güçlü tekil revizyon: OFF sınıfı precision 0,478/recall 0,669, NOT sınıfı precision 0,906/recall 0,814, tam karışıklık matrisi (716 OFF'tan 237 yanlış negatif = %33; 2812 NOT'tan 523 yanlış pozitif = %19) ve bunun kullanıcı güveni/etik açıdan yorumu eklendi. `docs/model-egitim-raporu.md` ile birebir örtüşüyor — uydurma değil. Tam puan. |
| 3.3 | Kullanıcı Deneyimi (UI/UX) | 7 | 6 | **6** | 0 | Değişmedi — dogfooding ötesinde resmî/harici kullanılabilirlik testi hâlâ yok. Tur 1'de bilerek düşük öncelikli bırakılmıştı, beklendiği gibi dokunulmamış. |
| 4.1 | Verimlilik ve Etkinlik | 5 | 5 | **5** | 0 | Zaten tam puan. |
| 4.2 | Hedef Kitle | 5 | 5 | **5** | 0 | Zaten tam puan; küçük netleştirme eklenmiş (şikâyet-türetilmiş özellik eşlemesi). |
| 4.3 | Teknolojik Yenilik ve Uygulanabilirlik | 5 | 4 | **5** | **+1** | Artık 2.2/3.1'e "(bkz. Bölüm X)" çapraz referanslarla bağlanıyor ve somut yeni bir hesap ekliyor ("1,7M kullanıcı aynı anda kullansa dahi ek sunucu maliyeti sıfır"). Tam tekrar değil, gerçek ek değer. Cümle düzeyinde hâlâ hafif örtüşme var (185KB, sıfır sunucu maliyeti üç yerde geçiyor) ama artık çapraz referans disipliniyle kabul edilebilir düzeyde. |
| 5.1 | **Toplumsal Fayda ve Erişim Potansiyeli** | **10** | **6** | **8** | **+2** | Raporun en kritik kriteri, en büyük iyileşme. Artık "kopyala-yapıştır sürtünmesi ile erişim iddiası arasındaki gerilim" doğrudan adlandırılıyor ve savunuluyor (düşük sıklık/yüksek değer, hedefli kullanım anı çerçevesi) + tarayıcı uzantısına somut, tarihli (mentörlük 2-7 Eylül) bir yol haritası bağlanıyor. Tam puan değil çünkü "kullanıcı zaten şüphelenince kullanır" iddiası hâlâ ampirik değil, retorik bir savunma — davranış verisiyle desteklenmiyor. Yine de tur 1'deki "hiç ele alınmamış" durumundan "ciddiyetle ele alınmış" durumuna geçiş büyük bir kazanım. |
| 6.1 | Ticarileştirme Potansiyeli ve İş Modeli | 5 | 4 | **4** | 0 | Kullanım-bazlı fiyatlandırma çerçevesi eklendi (istenen revizyon uygulandı) ama hâlâ hiçbir rakam/pazar büyüklüğü tahmini yok — nitel kalmaya devam ediyor, tam puana çıkmadı. |
| 6.2 | Finansal/Teknik/Sosyal Sürdürülebilirlik | 5 | 4 | **4** | 0 | Değişmedi — somut yeniden eğitim tetikleyici eşiği hâlâ tanımsız. Tur 1'de düşük öncelikli bırakılmıştı. |
| 7.1 | İş Paketleri ve Zamanlama | 5 | 3 | **4** | **+1** | Şekil 2 (görsel Gantt) eklendi — şartnamenin "GÖRSEL takvim" isteği artık karşılanıyor. Ayrıca "4-5 günlük yoğun tempo, ekibin önceki proje deneyimiyle açıklanabilir" dürüstlük cümlesi eklendi. Tam puan değil çünkü bu açıklama hâlâ **iddia** düzeyinde — 19 Ağustos öncesine ait tarihli hiçbir kanıt (ör. ön araştırma notu, GitHub'da 19 Ağustos öncesi commit) sunulmuyor; tabloda hâlâ sıfır ön-planlama süresi görünüyor. |
| 8.1 | Takım Organizasyonu ve Roller | 5 | 4 | **5** | **+1** | "KYS başvurusu tamamlanmış... kesinleşmiştir" — tur 1'deki tereddüt izlenimi veren belirsiz ifade tamamen giderildi. Disiplinlerarasılık zayıflığı (4 üyenin 3'ü EE, 1'i Makine Müh., psikoloji/PDR/tasarım diploması yok) hâlâ geçerli ama bu yumuşak bir gözlemdi, kural ihlali değildi; kişisel veri kuralına tam uyum + artık kesin ifade tam puanı hak ediyor. |
| 9 | Kaynakça — Formata Uygunluk | 5 | 3 | **4** | **+1** | [9] artık 2.1'de T3 AI cümlesine bağlı (yetim değil). [7][8] içerik-metin uyumu düzeltildi. Tek kalan zayıflık: [4]/[5] (TC Lira, Media Republic) hâlâ TÜİK/We Are Social'ın **ikincil** kaynakları — raporun kendi "Kalan işler" listesinde "zaman izin verirse" olarak işaretlenmiş bir maddeydi, ele alınmamış. Bu yüzden tam puan değil. |
| | **TOPLAM** | **100** | **81** | **91** | **+10** | |

## Revizyon Maddelerinin Etkinlik Değerlendirmesi (Tur 1'in 11 maddesi)

| # | Madde | Durum | Değerlendirme |
|---|---|---|---|
| 1 | [7][8] kaynak çelişkisi | ✅ Gerçek düzeltme | Cümle yeniden yazılmış, atıfların gerçek içeriğiyle tam uyumlu. |
| 2 | 5.1 erişim/benimseme savunması + tarayıcı uzantısı yol haritası | ✅ Gerçek, en etkili revizyon | Raporun en zayıf noktasını doğrudan göğüslüyor, kaçmıyor. |
| 3 | 3.2 precision/recall/karışıklık matrisi + FP/FN tartışması | ✅ Gerçek, akademik düzeyde | Sayılar `model-egitim-raporu.md` ile birebir örtüşüyor — uydurma risk yok. |
| 4 | Yetim [9] kaynağı bağlandı | ✅ Gerçek düzeltme | Metinde doğrulandı (2.1, T3 AI cümlesi). |
| 5 | 4.3 tekrar azaltma + somut ölçekleme rakamı | ✅ Kısmi ama gerçek | Çapraz referans disiplini var, yeni hesap eklendi; ufak düzeyde fakt tekrarı (185KB, sıfır maliyet) hâlâ 3 bölümde geçiyor — kozmetik kalan artık kalıntı düzeyinde. |
| 6 | 6.1 kullanım-bazlı fiyatlandırma çerçevesi | ⚠️ Kısmen kozmetik | Terim eklendi ama nicel referans (rakam/pazar büyüklüğü) hâlâ yok — rubrik puanını hareket ettirmedi. |
| 7 | 7.1 Şekil 2 + dürüstlük cümlesi | ✅ Gerçek ama tam değil | Görsel talebi tam karşılıyor; "inandırıcılık" iddiası hâlâ kanıtsız retorik — puanı 1 artırdı, 2 artırmadı. |
| 8 | 8.1 belirsizlik netleştirildi | ✅ Gerçek düzeltme | "Kesinleşmiştir" ifadesi tereddüt izlenimini tamamen kaldırdı. |
| 9 | Şekil 1 üçüncü taraf hesapları bulanıklaştırıldı | ✅ Gerçek düzeltme, KVKK açısından önemli | Görsel doğrulandı: iki hesap artık siyah kutuyla kapatılmış, yalnızca analize konu olan hesaplar (@selcukbayraktar, @nsosyal, @realelonmusk) görünür. |
| 10 | İçindekiler sayfa numaraları hizalandı | ✅ Gerçek düzeltme | TOC'daki sayfa numaraları (3,4,5,7,8,9,10,11,12) fiili bölüm başlangıçlarıyla birebir eşleşiyor. |
| 11 | README.md eklendi | ✅ Gerçek, iyi yazılmış | Rapor iddialarıyla (49/49 test, model boyutu, modüller) tam tutarlı; kurulum/kalite kapıları net. |

**Sonuç: 9/11 madde gerçek puan etkisi yarattı, 2/11 (madde 6 ve kısmen 7) rubrik açısından kozmetik/kısmi kaldı ama zararsız.** Bu, "yüzeysel cila" değil, gerçek bir revizyon turu — ekip geri bildirimi doğru önceliklendirmiş (en yüksek puan etkili maddelere odaklanmış).

## Etik / Uygunluk Kontrolü (Tekrar)

- **KVKK — Şekil 1:** Tur 1'de "orta düzey uyarı" olarak işaretlenen üçüncü taraf hesap ifşası (Melik, Büşra Akipek) **çözülmüş görünüyor** — güncel görselde bu alanlar siyah kutuyla bulanıklaştırılmış, yalnızca analize doğrudan konu olan 3 hesap (kurucu, resmî hesap, taklit hesap örneği) görünür bırakılmış. Diskalifiye riski taşımayan bu nokta artık tamamen temiz.
- **Takım üyesi kişisel verisi:** Hâlâ yok, kural tam uyumlu; ifade artık daha kesin ("kesinleşmiştir").
- **Damgalayıcı dil:** Hâlâ yok; tasarım felsefesi (alarm renklerinden kaçınma, "uyarı değil gözlem") korunmuş.
- **Kaynak disiplini:** [7][8] ve [9] düzeltildi; [4]/[5] hâlâ ikincil kaynak — bu bir intihal/etik ihlali değil, sadece akademik titizlik eksikliği, düşük risk.
- **Yeni ortaya çıkan risk yok.** Diskalifiye edici bir husus tespit edilmedi.

**Sonuç: Rapor uygunluk ön incelemesinden geçer, tur 1'e göre daha temiz.**

## GitHub Reposu Kontrolü — ÖNEMLİ SINIRLAMA

Bu oturumda **WebFetch/tarayıcı erişimi araçları mevcut değildi** (yalnızca Read/Write/Glob), bu yüzden `https://github.com/Yasin12-2/Nsosyal` linkine canlı olarak gidip genel erişime açık mı / commit geçmişi rapordaki iddiaları yansıtıyor mu doğrudan doğrulanamadı — bu, tur 1'in 1 numaralı en yüksek öncelikli maddesiydi ve **hâlâ bağımsız olarak teyit edilmemiş durumda.**

Dolaylı kanıt güçlü: yerel `src/` klasörü rapordaki iddialarla birebir örtüşüyor — 4 test dosyası (`scoring.test.ts`, `oruntu.test.ts`, `sessiz-kurallar.test.ts`, `guven-karti.test.ts`) rapordaki 4 modülle (Akış Günlüğü, örüntü paneli, Garanti Sessizlik, Güven Kartı) tam eşleşiyor; rotalar (`/`, `/akis`, `/guven`, `/hakkinda`) rapordaki "5 route" iddiasıyla uyumlu; `docs/model-egitim-raporu.md`'deki precision/recall/karışıklık matrisi rakamları raporun 3.2 bölümündeki rakamlarla **birebir** aynı — bu, sayıların uydurulmadığının güçlü bir işareti. Ancak yerel klasörde `.git` dizini bulunamadı, dolayısıyla commit geçmişinin gerçekten var olduğu ve GitHub'a gerçekten push edildiği bu oturumda doğrulanamadı.

**Eylem gerekli (5 dakika, teslimden önce):** Takımdan biri linke tarayıcıdan bizzat girip (a) reponun public olduğunu, (b) README'nin göründüğünü, (c) commit geçmişinin boş olmadığını gözle teyit etmeli. Bu, en düşük maliyetli, en yüksek riskli kalan kontrol noktasıdır — repo boş/özel çıkarsa 3.1 (7 puan) ve dolaylı olarak raporun genel güvenilirlik izlenimi anında çöker.

## Kalan Riskler

### Gerçekten kritik (teslimden önce kontrol edilmeli)
1. **GitHub repo canlı doğrulaması** (yukarıda) — tek gerçek "blocker" risk, ama düzeltmesi rapor metnini değiştirmek değil, sadece bir tık kontrolü.

### Mentörlük sürecine bırakılabilir (düşük öncelik, bugün dokunmaya gerek yok)
- 6.1: İş modeline nicel pazar büyüklüğü/rakam eklenmesi.
- 6.2: Somut yeniden eğitim tetikleyici eşiği tanımlanması.
- 3.3: Harici, çok katılımcılı kullanılabilirlik testi (5-8 kişi) — zaten rapor bunu "sonraki adım" olarak dürüstçe işaretlemiş.
- 9: [4]/[5] için TÜİK/We Are Social birincil kaynağına geçiş.
- 2.2: "Özgünlük" çerçevelemesinin biraz daha alçakgönüllü/hassas ifade edilmesi (iyi mühendislik ile düşünsel sıçrama arasındaki ayrımı rapor kendi içinde daha net kabul edebilir) — puan kaybettirmiyor ama jüri sunumunda sözlü savunmada bu ayrımı netleştirmeye hazır olunmalı (bkz. olası soru "bu bir inovasyon mu, iyi mühendislik mi?").
- 7.1: Zaman kalırsa, 19 Ağustos öncesine ait somut bir tarih/kanıt (ör. ilk commit saat damgası) eklenirse 7.1 tam puana çıkabilir — ama bu bugün için gerekli değil.

## Nihai Tavsiye

**Rapor bu haliyle teslime hazır.** 91/100, tur 1'e göre +10 puanlık, gerçek ve ölçülebilir bir iyileşme; en yüksek ağırlıklı/en riskli kriterler (5.1 Toplumsal Fayda, 3.2 Model Doğrulama — ki bu ikincisi Sosyal YZ temasının %30 ağırlıklı Teknik Yeterlilik ekseniyle doğrudan örtüşüyor) somut biçimde güçlendirildi. Etik/uygunluk kontrolünden temiz geçiyor, KVKK uyarısı (Şekil 1) görsel olarak çözülmüş görünüyor.

**Tek şart:** Teslimden önce GitHub linkinin bizzat, tarayıcıdan bir kez tıklanıp kontrol edilmesi — bu, metne dokunmayan, 5 dakikalık ama en yüksek riskli kalan adımdır. Bunun dışında son bir metin müdahalesi **zorunlu değildir**; kalan zayıflıkların tamamı düşük öncelikli ve mentörlük sürecinde (2-7 Eylül) doğal olarak ele alınabilir nitelikte.
