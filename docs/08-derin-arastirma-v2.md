# İkinci Tur Fikir Araştırması — Yapıştırma Sürtünmesi + "Companion Tool" Sorunu

> Tarih: 2026-08-23. Kullanıcı geri bildirimi: mevcut "Akış Aynası / Güven Kartı" fikri "aşırı mantıksız" geldi — özellikle (1) manuel yapıştırma UX'i pratik değil, (2) NSosyal'in kendisine değil, ayrı bir "companion tool"a bağlı olması fikri baştan zayıf geliyor. Kullanıcı toptan farklı bir temaya geçmek İSTEMEDİ — bu iki somut sorunu çözecek bir araştırma istedi. Rapor teslimi: **24 Ağustos 17:00 — yarın.** Bu doküman sadece araştırma/öneri; kod değişikliği YAPILMADI.

---

## 1. Araştırma bulguları

**NSosyal API/entegrasyon durumu (yeniden doğrulandı, bu turda):**
- Mobil (Android/iOS) ve web istemcisinin kaynak kodu **1 Ağustos 2025'te AGPLv3 ile yayınlandığı doğrulandı** (Webtekno, AA — bkz. kaynaklar). Ancak somut bir GitHub repo linki/adı bu turda da bulunamadı — arama sonuçları alakasız repoları getiriyor. Yani kod "açık" ama **keşfedilebilir/erişilebilir değil** kısa sürede.
- Genel kullanıcıya açık bir **API veya webhook dokümantasyonu yok**. Ocak 2026'da Mastodon altyapısından kendi (proprietary) koduna geçilmiş olması, resmi ActivityPub federasyon API'sinin de artık geçerli olmadığı anlamına geliyor (Mastodon tabanlıyken teorik olarak ActivityPub üzerinden entegrasyon mümkün olabilirdi, artık değil).
- **Sonuç:** Gerçek, resmi bir "platform API entegrasyonu" 1 günde (hatta muhtemelen hiç, izin/onay süreci olmadan) mümkün değil. Bu kısıt değişmedi.
- Sitenin (nextsosyal.co) ve muhtemelen uygulamanın modern bir SPA (React/Next.js benzeri) olduğu, gönderilerin standart `<article>/<div class="post">` benzeri tekrarlayan bir DOM yapısında render edildiği tahmin ediliyor (kesin selector'lar canlı siteye bakılmadan bilinmiyor — geliştirme sırasında doğrulanmalı).

**Emsal tarama — "tarayıcı uzantısı ile sosyal medya analiz" pattern'i:**
- Global örnekler (Twitter/X için "Bot Sentinel", "Block Party" gibi 3. parti uzantılar; Meta'nın kendi Hidden Words'ü hariç) tam olarak bu yöntemi kullanıyor: **resmi API yerine, kullanıcının kendi tarayıcısında DOM'u okuyan bir content script**. Bu, "companion tool" kısıtını ortadan kaldırmadan (hâlâ 3. parti bir araç), ama **kullanıcı deneyimini native/entegre hissettiren** kanıtlanmış bir mimari.
- NSosyal'e özel bir tarayıcı uzantısı örneği bulunamadı — bu alan boş, yani hem teknik hem özgünlük açısından uygulanabilir bir boşluk.

---

## 2. Önerilen çözüm: "Tek Tık Analiz" — Tarayıcı Uzantısına Geçiş

**Mevcut değer önerisi ve kanıt tabanı DEĞİŞMİYOR** (bkz. `docs/01`, `docs/02`, `docs/07`) — sadece **teslim mekanizması** değişiyor.

### Önce / Sonra

| | Şu anki (v3) | Önerilen (v4) |
|---|---|---|
| Kullanım | Ayrı web sayfasına git, metni kopyala, yapıştır, sonucu oku | NSosyal'i kullanırken her gönderinin yanında küçük bir 🪞 ikonu belirir, **tek tıkla** o gönderi analiz edilir, sonuç hemen yanında/overlay'de çıkar |
| Veri akışı | Kullanıcı elle taşıyor | Uzantı, sayfadaki metni **kendi tarayıcısında** (content script, hâlâ client-side) okuyor — sunucuya hiçbir şey gitmiyor, mimari ilke korunuyor |
| Hissiyat | "Ayrı bir araç kullanıyorum" | "NSosyal'in içinde bir özellik gibi" — gerçek entegrasyon hissi, resmi olmasa bile |
| Rıza/etik | Yapıştırma = zaten bilinçli eylem | Buton = yine **kullanıcının tıklamasıyla tetiklenen, açık rızalı** eylem (otomatik/gizli tüm akışı taramıyor — bu kritik, "gizlice izliyor" algısını önlüyor) |

### Neden bu, iki şikayeti de çözüyor
1. **Yapıştırma sürtünmesi → yok oldu.** Kopyala-yapıştır zinciri tamamen kalkıyor, tek tıkla analiz.
2. **"Companion tool" hissi → azalıyor (tam çözülmüyor, dürüst olmalıyız).** Uzantı hâlâ resmi bir NSosyal ürünü değil — ama artık ayrı bir sekmede/sitede değil, **doğrudan NSosyal'in kendi sayfası üstünde** çalışıyor. Raporda "NSosyal'e resmi entegre" diye ASLA yazılmayacak (yanıltıcı olur), ama "NSosyal deneyimine gömülü, gerçek zamanlı" diye dürüstçe ve güçlü şekilde yazılabilir.

### Teknik fizibilite (kalan ~1 gün için kritik)
- Mevcut model/mantık (TF-IDF + LojistikRegresyon, Güven Kartı benzerlik/taklit tespiti) **aynen taşınıyor** — sadece "nereden metin geliyor" değişiyor (input kaynağı: textarea → DOM'dan okunan post metni). Kod tabanının büyük kısmı (`src/lib/*`) yeniden kullanılabilir.
- Chrome Manifest V3 content script + basit bir buton enjeksiyonu, deneyimli bir geliştirme turunda **1 günde çalışan bir demo** olarak yapılabilir (tam ürünleşmiş bir Chrome Web Store yayını değil, ama jüriye canlı gösterilebilecek bir prototip).
- **Risk:** NSosyal'in gerçek DOM yapısı geliştirme sırasında ilk elden görülüp selector'lar buna göre yazılmalı — canlı siteye erişim gerekiyor (kullanıcının oturum açık NSosyal hesabı, önceki turda zaten kullanılmıştı).
- **Yedek plan:** Uzantı geliştirmesi öngörülemeyen bir DOM engeliyle karşılaşırsa (ör. sıkı CSP, sık değişen class adları), demo modunda "örnek NSosyal ekran görüntüsü + buton overlay simülasyonu" ile jüriye gösterilebilir — mevcut manuel yapıştırma modu da yedek/ikincil giriş yöntemi olarak koda kalabilir (kaybolmuyor, sadece birincil yöntem değişiyor).

---

## 3. Dürüst sınırlamalar (rapora böyle yazılacak)
- Resmi NSosyal entegrasyonu değil, kullanıcının kendi isteğiyle kurduğu bağımsız bir tarayıcı uzantısı.
- NSosyal'in DOM yapısı değişirse uzantının güncellenmesi gerekir (üçüncü taraf uzantıların ortak kısıtı, X/Twitter uzantılarında da aynı sorun var — literatürde bilinen bir trade-off).
- Chrome Web Store'a gerçek yayın (inceleme süreci) bu sprint kapsamı dışında — sprint çıktısı "yüklenebilir/unpacked extension" demo düzeyinde olacak, raporda böyle belirtilecek.

---

## 4. Kararın etkisi — puan/kapsam
- `docs/05`'teki Fikir 1 puanlaması (~80-85/100) değişmiyor çünkü kanıt tabanı ve teknik yeterlilik aynı kalıyor; **UX kriteri güçleniyor** (mevcut puan tablosunda UX ağırlığı %10 — "tek tık" deneyimi, "yapıştırma" deneyiminden objektif olarak daha güçlü bir puan alır).
- Özgünlük puanı da hafifçe güçlenir: "NSosyal'e özel tarayıcı uzantısı" hâlâ boş bir alan (emsal bulunamadı).

---

## 5. Kullanıcıya soru
Bu yön (aynı fikir + aynı kanıt tabanı, ama teslim mekanizması standalone web app'ten tarayıcı uzantısına geçiyor) onaylanırsa, `gelistirici` ajanını bugün bu dönüşüm için başlatabilirim. Zaman çok kısıtlı olduğundan mevcut manuel-yapıştırma modu YEDEK olarak kodda kalır, silinmez — risk azaltma.

---

## Kaynaklar
- [Webtekno — NEXT Sosyal'in Kaynak Kodları Herkese Açık Şekilde Yayımlandı](https://www.webtekno.com/next-sosyal-kaynak-kodlari-h160194.html)
- [AA — NEXT Sosyal mobil uygulamalarının kaynak kodları yayınlandı](https://www.aa.com.tr/tr/bilim-teknoloji/next-sosyal-mobil-uygulamalarinin-kaynak-kodlari-yayinlandi/3648604)
- [R10.net — NEXT Sosyal kaynak kodları yayınlandı](https://www.r10.net/teknoloji-haberleri/4520492-next-sosyal-kaynak-kodlari-yayinlandi128226128226.html)
- [Next Sosyal - Vikipedi](https://tr.wikipedia.org/wiki/Next_Sosyal)
