# PİVOT — NSosyal Platform Analizi ve Fikir Düzeltmesi

> Tarih: 2026-08-19 (aynı gün, ikinci tur). Kullanıcı kritik bir düzeltme yaptı: NSosyal soyut/hipotetik bir "sosyal medya" değil, **gerçek, yayında, T3 Vakfı/Baykar bağlantılı (2N Medya), 1,7M+ kullanıcılı, Mastodon altyapılı bir Türk sosyal medya platformu**. Yarışma, bu platforma somut, kanıta dayalı bir katma değer önerisi istiyor — soyut bir "yeni sosyal medya fikri" değil. `docs/01-fikir-ve-tema-karari.md`'deki "Akış Aynası" konsepti bu ışıkta GÜÇLENDİRİLİYOR (iptal değil — mimarisinin ~%90'ı doğrudan taşınabilir), ama artık somut, kaynaklı bir NSosyal problemine bağlanıyor.

## 1. NSosyal nedir (doğrulanmış gerçekler)

- **Geliştirici:** 2N MEDYA ANONIM ŞİRKETİ, T3 Vakfı öncülüğünde, Baykar bağlantılı. 23 Temmuz 2025'te yayına girdi.
- **Ölçek:** İlk haftasında on binlerce, hızla 1 milyonu aşan kullanıcı; App Store sosyal ağ kategorisinde 1 numaraya çıktı. Güncel: 1,7M+ kullanıcı (Şikayetvar özet verisine göre).
- **Mimari:** Başlangıçta Mastodon (ActivityPub, açık kaynak, AGPLv3) altyapısı üzerine inşa edildi, federasyon (Fediverse ile bağlantı) KAPALI, yerel veri merkezleri + özel arayüz + "T3 AI" entegrasyonu ile özelleştirildi. **Ocak 2026 itibarıyla Mastodon altyapısı tamamen kendi (proprietary) yazılımlarıyla değiştirildi** — yani platform artık Mastodon'dan bağımsız kendi kod tabanına sahip.
- **T3 AI / "Ahlaklı Yapay Zeka" botu:** Platform içinde zaten mevcut — moderasyon, spam/bot/manipülasyon tespiti için **backend/platform tarafında** çalışıyor.
- **Kaynak kodu:** Erken dönemde (Temmuz 2025) "yerli ve milli" iddiasıyla pazarlanıp aslında Mastodon kullandığı ortaya çıkınca kaynak kod paylaşılmadığı için eleştirildi (AGPLv3 ihlali iddiası); sonraki bir tarihte (Webtekno haberine göre) mobil uygulama kaynak kodlarının (Android/iOS/Web) yayımlandığı duyuruldu. **Ancak bu oturumda GitHub'da genel aramayla doğrudan bir "nsosyal" reposu bulunamadı** — kod hâlâ erişilebilir mi, hangi isim altında, net değil. Bu nedenle prototip planı **kaynak koda erişimi VARSAYMADAN** kuruldu (bulunursa bonus, gerçek entegrasyon güçlendirilebilir; bulunamazsa mevcut plan zaten kendi başına yeterli).

## 2. Gerçek, kanıtlanmış kullanıcı şikayetleri (Şikayetvar, 2026-08-19 itibarıyla)

**Genel puan: 27/100** (49 değerlendirme) | %54 yanıt oranı | 119 şikayetten yalnızca 13'ü çözülmüş.

| Kategori | Şikayet sayısı | Örnek |
|---|---|---|
| **Hesap erişimi/kimlik doğrulama** | 53+ | Kullanıcı adını hatırlayamama, "Medya yüklenemedi" hataları, şifre sıfırlama kodu gelmiyor |
| **İstenmeyen SMS/Spam** | 52+ | Rıza olmadan pazarlama mesajı; **hesap silindikten SONRA BİLE SMS gelmeye devam ediyor**; günlük/haftada 4-5 mesaj, bazıları 03:00-04:00 arası |
| **Destek/hesap silme** | 23+ | İletişim formu çalışmıyor, destek talepleri yanıtsız, hesap silme teknik hatayla başarısız |
| **Teknik aksaklık** | 6+ | "Unknown Error", mesajlaşma arızası, takip butonu tepkisiz |
| **Bildirimler** | (yukarıdaki kümelere dağılmış) | **Engellenen/susturulan bildirimler (N Haber, N Spor, N Ekonomi kanalları) ayarlardan kapatılamıyor, ~30 dakikada bir 5 AY BOYUNCA gelmeye devam etti** (Şikayetvar örneği) |

Kaynaklar: [Şikayetvar - NSosyal](https://www.sikayetvar.com/nsosyal), [Euronews - 10 soruda Next Sosyal](https://tr.euronews.com/next/2025/07/31/ovgu-elestiri-ve-tartismalar-10-soruda-next-sosyal-ve-next-mesajlasma), [Ekşi Sözlük - next sosyal](https://eksisozluk.com/next-sosyal--8007314)

## 3. Kritik gözlem — jüri için en güçlü açı

Platformun **kendi bildirim/sessize alma ayarları belgelenmiş biçimde GÜVENİLMEZ** (kullanıcı ayardan kapatıyor, sistem yine bildirim gönderiyor; hesap siliniyor, SMS yine geliyor). Bu, klasik bir "backend/sunucu tarafı ayar senkronizasyon hatası" — kullanıcı platforma güvenip ayar değiştiriyor ama platform sözünü tutmuyor.

**Buna karşın:** Platformun T3AI botu SADECE platform/backend tarafında moderasyon yapıyor (spam/bot tespiti) — kullanıcının **kendi tarafında**, kendi maruziyetini şeffaf şekilde görebildiği ve **platformun sunucu tarafı ayarlarına bağımlı olmadan, cihazında güvenilir şekilde çalışan** bir kişisel kontrol katmanı yok.

Bu tam olarak, yarışmanın kendi amaç bölümünde vurguladığı hedefle örtüşüyor: *"Güvenli, etik, şeffaf ve kullanıcı mahremiyetini ön planda tutan sosyal medya çözümlerinin geliştirilmesini desteklemek."* (Şartname, Bölüm 1 — Yarışma Amacı)

## 4. Fikir güncellemesi: "Akış Aynası" → NSosyal'e bağlı, kanıta dayalı bir güven katmanı

**Değişmeyen (zaten inşa edildi, korunuyor):**
- Client-side Türkçe toksisite sınıflandırıcısı (OffensEval-TR ile eğitildi, gerçek metrikler).
- Şeffaflık katmanı (kelime-katkı açıklaması — tam açıklanabilirlik).
- Akış günlüğü + örüntü paneli.
- Damgalamayan, seçim kullanıcıda bırakan müdahale banner'ı.

**Değişen/eklenen (çerçeveleme ve 1-2 hedefli özellik):**
1. **Problem tanımı artık NSosyal'e özel ve kaynaklı:** "genel dijital refah" yerine, "NSosyal'in kendi bildirim/tercih ayarlarının güvenilmez olduğu belgelenmiş (Şikayetvar: 52+ şikayet, 27/100 puan), kullanıcının buna karşı kendi elinde, her zaman çalışan bir kontrol katmanına ihtiyacı var" problemi.
2. **Yeni/vurgulanan özellik — "Garanti Sessizlik" katmanı:** Kullanıcının sessize aldığı/istemediği içerik türlerinin, platformun sunucu tarafı ayarına GÜVENMEDEN, cihazda (client-side) her zaman filtrelenmesini sağlayan ikinci bir güvenlik katmanı — platformun kendi ayarları çalışmasa bile kullanıcının sözü geçerli kalır. Bu, mevcut toksisite skorlama motorunun doğal bir uzantısı (aynı mimari, farklı eşik/kategori mantığı eklenmesi yeterli).
3. **Konumlandırma:** Prototip, gerçek bir NSosyal API entegrasyonu değil (API/kaynak koda erişim doğrulanamadı) — kullanıcının NSosyal'den kopyaladığı/gördüğü içeriği besleyebileceği bir **companion/tamamlayıcı araç** olarak sunuluyor; raporda bu dürüstçe belirtilecek, "NSosyal ekibiyle resmi entegrasyon görüşmesi" sonraki adım olarak önerilecek (önceki projedeki "YEDAM ile resmi iş birliği ön görüşmesi" ile aynı dürüst pragmatizm).

## 5. Rapor için kritik avantaj
Rubrik §2.1 (Problem Tanımı ve Mevcut Çözümler, 7 puan) kontrol maddesi "**En az bir resmî kaynak veya akademik veriyle desteklenmiş**" — Şikayetvar verisi (27/100 puan, kategorize edilmiş 100+ şikayet) tam bu ihtiyacı karşılıyor, üstelik **doğrudan hedef platformun kendi verisi** olduğu için "genel istatistik" değil, iddiamızı doğrudan destekleyen birincil kanıt niteliğinde.

## 6. Açık kalan riskler / dürüst sınırlamalar
- Gerçek NSosyal API/kaynak kod erişimi doğrulanamadı — prototip "companion tool" olarak konumlandırılacak, "NSosyal'in resmi bir parçası" gibi sunulmayacak (yanıltıcı olmaz).
- "Yerli/milli" tartışması (Mastodon kökeni) politik açıdan hassas — raporda BU TARTIŞMAYA girilmeyecek, sadece kullanıcı deneyimi/güven sorunlarına (bildirim, SMS, hesap işlemleri) odaklanılacak.
- Şikayetvar verisi ikincil/kamuya açık bir kaynak (Google Play yorumları gibi) — birincil kullanıcı araştırması değil, rapor bunu şeffaf şekilde belirtecek (önceki projedeki KVKK/kaynak dürüstlüğü yaklaşımıyla tutarlı).

## Sonraki adımlar
1. `docs/01-fikir-ve-tema-karari.md`'yi bu pivotla güncelle (üzerine yazma, çelişki varsa bu dosya esas alınsın diye not düş).
2. Prototip metinlerini/çerçevesini NSosyal'e referansla güncelle (kod mimarisi değişmiyor, çoğunlukla metin/konumlandırma).
3. "Garanti Sessizlik" özelliğini ekle (küçük, hedefli bir ek).
4. Rapor taslağına bu kanıt tabanını işle.
