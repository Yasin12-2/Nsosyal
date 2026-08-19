# Tema ve Fikir Kararı — Akış Aynası

> Tarih: 2026-08-19. Onay: kullanıcı, sıkışık 5 günlük sprint nedeniyle tek-turlu hızlandırılmış onay süreciyle (bkz. CLAUDE.md'deki normal 2-kapılı süreç yerine burada tema+fikir birleştirilerek tek soruda onaylandı).
>
> **⚠️ GÜNCELLEME (aynı gün, 2. tur):** Kullanıcı kritik bir düzeltme yaptı — NSosyal soyut bir tema değil, GERÇEK, yayında, 1,7M+ kullanıcılı bir platform; yarışma bu platforma somut katkı istiyor. Aşağıdaki tema/mimari kararları GEÇERLİ ve KORUNUYOR, ama problem tanımı ve konumlandırma artık NSosyal'in gerçek, kanıtlanmış kullanıcı şikayetlerine bağlandı. Detay ve kanıt tabanı için MUTLAKA önce **`docs/02-nsosyal-platform-analizi-ve-pivot.md`** dosyasını oku — bu dosya güncellenmiş çerçeveyi içerir, çelişki varsa 02 esas alınır.

## Tema: Sosyal Yapay Zekâ

### Gerekçe (araştırma ajanı bulguları, 2026-08-19)
- **TÜİK 2025 Zaman Kullanım Araştırması:** 10+ yaş nüfusta son 4 haftada sosyal medya kullanımı %71,7 (2015: %33,9 — 10 yılda 2 katından fazla artış). [Erişim gerekli — kaynak: TC Lira haberi, TÜİK verisine dayanıyor]
- **We Are Social Digital 2026 Türkiye Raporu:** 62,3 milyon aktif sosyal medya kullanıcısı (+%8,3 yıllık), günlük ortalama internet kullanımı 6 saat 26 dk.
- **1 Kasım 2026'da** 15 yaş altı için sosyal medya erişim kısıtlaması yürürlüğe giriyor (yasal düzenleme, TÜHKE 2025 raporuna göre "teknik yasak bağımlılığı tek başına çözmüyor" eleştirisi var — bizim çözümümüzün konumlandığı boşluk tam burası: yasaktan bağımsız, farkındalık temelli bir katman).
- "Doomscrolling" kavramı Türkçe akademik/istatistiksel literatürde neredeyse hiç işlenmemiş — yerelleştirme fırsatı.
- **Rakip/emsal analizi:**
  - Kullanıcı Katılımı/UX teması (Opal, Forest, One Sec gibi emsaller) → "gamification paradox" riski: streak/rozet mekanikleri kaygı/suçluluk yaratabiliyor, YEDAM Kapısı'nın (önceki proje) kural-tabanlı/damgalamayan felsefesiyle gerilimli.
  - İçerik Ekonomisi teması → Türkiye'ye özgü net bir boşluk tespit edilemedi, doymuş alan (Patreon/Ko-fi/YouTube Fon zaten var).
  - Sosyal Yapay Zekâ teması → global mood-aware/moderasyon pazarı kalabalık (2025: 7,5 milyar $ → 2030: 18 milyar $ öngörüsü) ama **Türkçe dil-kültür + KVKK-minimal + damgalamayan dil** kombinasyonunda yerli bir emsal bulunamadı. Bu, YEDAM Kapısı deneyimiyle doğrudan örtüşen boşluk.
- **Puanlama avantajı:** Sosyal YZ temasında "Teknik Yeterlilik ve Uygulanabilirlik" %30 ağırlıkla en yüksek puanlı kriter — genuine bir YZ bileşeni bu kriteri güçlü karşılar.

## Fikir: "Akış Aynası" (çalışma adı — kesinleşmedi)

Sosyal medya akışının duygusal/toksik örüntüsüne kullanıcıya ayna tutan, KVKK-minimal, cihaz-ağırlıklı bir dijital farkındalık katmanı.

### Temel bileşenler
1. **Gerçek (küçük, dürüst, açıklanabilir) bir YZ sınıflandırıcısı** — Türkçe metin için toksisite/duygu tahmini. scikit-learn tarzı klasik ML (TF-IDF + Logistic Regression veya benzeri), gerçek train/test split, gerçek accuracy/F1/precision/recall metrikleriyle raporlanacak. Rubrik §3.2'yi (Model ve Veri Doğrulama, 6 puan) genuine biçimde karşılamak için — önceki projedeki "kural tabanlı, YZ değil" savunmasının aksine burada gerçek bir model var.
2. **Akış Günlüğü:** Kullanıcı gördüğü içerik metnini (yapıştırarak veya tarayıcı uzantısı ile) sisteme ekler; sistem zaman içindeki duygu/toksisite örüntüsünü gösterir ("son 1 saatte gördüklerinin %60'ı olumsuz/kaygı tetikleyici").
3. **JITAI tarzı aktif müdahale** — YEDAM Kapısı'nın dürtü-anı müdahale mimarisinden doğrudan uyarlanacak: olumsuz örüntü eşiği aşılınca nazik, damgalamayan bir mola/farkındalık önerisi devreye girer.
4. **Şeffaflık katmanı** — "Neden bu analizi gördüm?" açıklanabilirlik notu (önceki projedeki güven unsuru burada da uygulanacak).
5. **Mimari:** Next.js/TypeScript, veri ağırlıklı olarak cihazda/localStorage'da tutulur; sınıflandırıcı ya istemci tarafında (küçük model, ör. ONNX/TF.js ile) ya da minimal bir API endpoint üzerinden (barındırma gerekiyorsa) çalışabilir — teknik tasarımda netleştirilecek.

### Riskler ve azaltma
- **"Yine dijital bağımlılık/refah mı" algısı:** Farklı yarışma/jüri; gerçek ML bileşeni ve farklı tema (Sosyal YZ vs. önceki projenin sağlık/YEDAM odağı) ile yeterince ayrışıyor. Raporda önceki projeyle "aynı takım, farklı ürün, aktarılan mimari deneyim" çerçevesi kurulacak (dürüstlük + tutarlılık avantajı olarak sunulacak, gizlenmeyecek).
- **§3.2 (Model ve Veri Doğrulama) gerçekçiliği:** Veri seti kaynağı doğrulanmadan iddiada bulunulmayacak — ayrı bir araştırma turu bu konuda yürütülüyor (bkz. görev takibi).
- **Kapsam taşması:** Gerçek platform API entegrasyonu (Instagram/TikTok/X API'leri) 5 günde mümkün değil — prototip, kullanıcının içeriği manuel/yapıştırarak veya örnek veri setiyle beslediği bir demo kapsamında kalacak; raporda bu açıkça "sonraki adım: platform API entegrasyonu" olarak belirtilecek (dürüstlük, önceki projedeki "bir üst aşamada geliştirmeye açık yönler" bölümüyle tutarlı).

## Sonraki adımlar
1. Türkçe toksisite/duygu veri seti araştırması (ayrı ajan turu, sürüyor).
2. Teknik tasarım + prototip geliştirme (gelistirici ajanı).
3. GitHub/Bitbucket repo kurulumu (rapor için zorunlu — bu proje için ayrı, yeni bir repo).
4. Rapor taslağı (raportor ajanı) — 24 Ağustos 17:00 TSİ teslim tarihine göre geriye zaman planlaması yapılacak.
