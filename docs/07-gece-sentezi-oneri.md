# Gece Sentezi — Nihai Öneri (2026-08-20 gece → sabah)

> Bu doküman, gece boyunca yapılan iki paralel araştırmayı ("fikir-avcisi" ajanının rakip/kanıt taraması → `docs/05-derin-fikir-taramasi.md` + canlı hesap üzerinden birincil kanıt taraması → `docs/06-canli-hesap-bulgulari.md`) TEK bir nihai öneride birleştiriyor. Kullanıcı uyandığında okuması gereken TEK dosya budur — diğer ikisi detay/kanıt referansı olarak arkada duruyor. Karar kullanıcıya ait; hiçbir kod değişikliği/pivot commit'i YAPILMADI, sadece araştırma ve öneri hazırlandı.

---

## Kısa cevap

**Mevcut "Akış Aynası" fikri elenmedi — güçlendirildi.** İki araştırma da birbirini besleyerek aynı sonuca vardı: sıfırdan pivot YAPMAYIN, mevcut prototipin (~%90 hazır) üzerine, kanıt gücünü ciddi biçimde artıran **tek yeni bir modül** ekleyin: **"Güven Kartı" (Kanıt Kutusu + Taklit Riski birleşimi)**.

Rapor teslimine kalan süre: **24 Ağustos 2026 17:00 — 4 gün.**

---

## Neden bu ikisi birleşince daha güçlü

`docs/05` (ajan, dış kaynak taraması) "Kanıt Kutusu" modülünü önerdi: yapıştırılan metinler arasında **şablon/spam benzerliği** (TF-IDF cosine similarity) — kanıtı Şikayetvar'daki tek, imzasız bir "sahte takipçi" şikâyetiydi (kanıt gücü: orta).

`docs/06` (bu oturum, canlı hesap taraması) bunu ÇOK daha güçlü, GÖRSEL, tartışılamaz bir kanıtla destekliyor:
- NSosyal'in kurucusu **Selçuk Bayraktar**'ın kendi launch sözü: *"Sahte hesapların... olmadığı... dijital iklim."*
- Resmi **@nsosyal** hesabının kendi kuralı: *"Fan hesabı adı altında popüler kişiler adına açılan sahte hesaplar konusunda hassasız... tespit ederek askıya alıyoruz."*
- Buna rağmen, platformda arattığınızda ("sahte hesap") en üstte çıkan, **gerçek Elon Musk fotoğrafını kullanan, doğrulanmamış, 1 yılı aşkındır aktif ve askıya alınmamış** bir `@realelonmusk` hesabı — biyografisinde alaycı biçimde *"Kesinlikle sahte bir hesap değildir"* yazıyor, platformun doğrulanmış Galatasaray hesabıyla bile organik etkileşime girmiş.
- Ayrıca gerçek bir kullanıcının (@alparslanvefa), bir impersonation vakasına karşı topluluğu manuel toplu şikâyete çağıran GÜNCEL (bu hafta) viral gönderisi — platformun "Bildir" mekanizmasına duyulan güvensizliğin doğrudan kanıtı.
- Kanıt görseli hazır: `docs/kanit-gorselleri/01-nsosyal-arama-sahte-hesap-elonmusk.jpg` (kurucunun sözü + Elon Musk sahte hesabı TEK ekranda, yan yana).

Bu, önceki projedeki "Şikayetvar 27/100" stratejisiyle AYNI desen (vaat/gerçeklik boşluğu) ama kaynak çok daha güçlü: üçüncü taraf yorum sitesi değil, **platformun kendi kurucusunun ve resmi hesabının sözü**, canlı ve ekran görüntüsüyle çürütülüyor.

---

## Nihai önerilen kapsam: "Akış Aynası v3 — Güven Kartı"

Mevcut modüller (korunuyor, dokunulmuyor):
- Türkçe toksisite sınıflandırıcı (client-side TF-IDF + LojistikRegresyon)
- Akış Günlüğü, Örüntü Paneli, şeffaflık katmanı ("neden bu skoru gördüm")
- Garanti Sessizlik (platform-bağımsız susturma katmanı — bildirim/SMS güvenilmezliği kanıtına dayanıyor, bkz. `docs/02`)

**Yeni modül — Güven Kartı** (aynı TF-IDF/açıklanabilirlik mimarisi yeniden kullanılıyor, KVKK-minimal korunuyor — kullanıcı sadece yapıştırdığı metni/profil bilgisini analiz ediyor, NSosyal'den veri çekilmiyor):
1. **Şablon/spam benzerliği** (`docs/05`'in önerisi): birden fazla gönderi/hesap açıklaması yapıştırıldığında aralarındaki metin benzerliğini (cosine similarity) hesaplayıp "kalıp içerik" farkındalık notu.
2. **Taklit/kimlik riski göstergesi** (`docs/06`'nın bulgusuyla güçlendirilmiş yeni özellik): kullanıcı bir profil adı/biyografisi yapıştırdığında:
   - Bilinen kamu figürü/marka isimlerine yakınlık (basit edit-distance/isim listesi eşleştirmesi — küçük, elle derlenmiş bir "tanınmış isimler" listesiyle, ML gerekmez, hızlı uygulanabilir),
   - "Bu hesap sahte değildir" tarzı öz-savunma dil kalıpları (gerçek, gözlemlenmiş bir sinyal — `@realelonmusk` örneği tam olarak bunu yapıyor),
   - Doğrulama rozeti yokluğu + yüksek tanınırlık iddiası arasındaki tutarsızlık.
   - Sonuç: damgalamayan, "bu hesapla etkileşime girmeden önce dikkatli ol" tarzı bir farkındalık notu — İHBAR aracı değil, KULLANICI FARKINDALIĞI aracı (etik çerçeve, önceki projedeki "damgalamayan dil" ilkesiyle tutarlı).

**Rapor anlatısı (flagship kanıt):** Kurucunun kendi sözü + resmi hesabın kendi kuralı + canlı, ekran görüntülü, 1 yıllık ihlal örneği → jüriye en güçlü, en akılda kalıcı, en az itiraz edilebilir "sorun tanımı" sayfası.

---

## Puan etkisi (tahmini, `docs/05`'in metodolojisiyle)

`docs/05`'teki Fikir 1 zaten ~80/100 tahmin edilmişti (kanıt gücü 9/10). Bu sentezle "kanıt gücü" kriteri gerçekçi biçimde 9→10'a, "özgünlük/yerlilik" 8→9'a çıkar (Threads Hidden Words benzerliği eleştirisi zayıflar — çünkü "taklit hesap tespiti" Hidden Words'te YOK, bu gerçekten NSosyal'e özgü, yeni bir katman). Diğer kriterler (fizibilite, sinerji, KVKK yükü) değişmiyor — hâlâ mevcut mimarinin doğrudan devamı, 4 günde rahatça tamamlanabilir.

**Güncellenmiş tahmini puan: ~83-85/100.**

---

## Bu gece yapılanlar (özet, kod/pivot commit'i YOK)

1. `docs/05-derin-fikir-taramasi.md` — fikir-avcisi ajanı, dış kaynak taraması (rakip analiz, Şikayetvar/Ekşi Sözlük yeni kanıt, akademik zemin, 6 fikir + puan tablosu). Apify kullanılmadı.
2. `docs/06-canli-hesap-bulgulari.md` — canlı NSosyal hesabı üzerinden birincil kanıt taraması (kurucu sözü, resmi hesap kuralı, `@realelonmusk` vakası, `berkan ağa` viral şikâyeti, "Onaylı Hesap Talebi" sayfası metni).
3. `docs/kanit-gorselleri/01-nsosyal-arama-sahte-hesap-elonmusk.jpg` — flagship kanıt görseli, rapora doğrudan konabilir.
4. Bu doküman — ikisinin sentezi + tek net öneri.

**Ayarlara dokunulmadı** (bir tıklama güvenlik sınıflandırıcısı tarafından engellendi, hesap ayarı değişikliği riski nedeniyle — sadece görüntüleme yapıldı, hiçbir toggle bilerek değiştirilmedi).

---

## Sabah ne olacak

Kullanıcı üç net seçenekle karşılaşıyor:
1. **Önerilen (bu doküman):** Akış Aynası v3 — Güven Kartı ile devam. En düşük risk, en yüksek hazır-olma, en güçlü kanıt.
2. `docs/05`'teki Fikir 4 (Yaş Dostu Mod — 15 yaş altı uyum, 1 Kasım 2026 yasası): cesur, yüksek potansiyel ama 4 günde fizibilite/KVKK riski yüksek.
3. Mevcut haliyle (Güven Kartı'sız, sadece Garanti Sessizlik) devam — hâlâ güçlü ama yeni kanıtın gücünden yararlanmamış olur.

Kullanıcı onayı geldiğinde: `gelistirici` ajanı Güven Kartı modülünü ekler → `docs/03-teknik-tasarim.md`'ye günlük olarak loglanır → `docs/04-rapor-taslak.md` yeni kanıt ve modülle güncellenir → resmi docx şablonuna işlenir (bkz. bekleyen: KYS başvurusu + GitHub repo linki, hâlâ kullanıcıdan bekleniyor).
