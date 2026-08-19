# Model Eğitim Raporu — "Akış Aynası" Türkçe Toksisite Sınıflandırıcısı

> Bu dosya `scripts/train_model.py` çalıştırılarak OTOMATİK üretilir. Sayılar gerçek eğitim/test
> çıktısıdır, elle düzenlenmemiştir. Rapor yazımında (§3.2 Model ve Veri Doğrulama) doğrudan kaynak
> olarak kullanılabilir.

## Veri seti
- **Kaynak:** OffensEval 2020 Turkish Corpus (Çöltekin, Ç., 2020, "A Corpus of Turkish Offensive
  Language on Social Media", Proceedings of the 12th LREC, ELRA). Lisans: CC-BY.
- **Görev:** İkili sınıflandırma — `OFF` (saldırgan/toksik dil) vs `NOT` (saldırgan değil).
- **Split:** Veri setinin resmi orijinal training/test ayrımı kullanıldı (ek karıştırma yapılmadı —
  yayıncının belirlediği ayrım daha savunulabilir ve tekrarlanabilir sonuç verir).
- **Eğitim örnek sayısı:** 31756
- **Test örnek sayısı (etiketli):** 3528
- **Sınıf dağılımı (eğitim):** NOT: 25625 (%80.7), OFF: 6131 (%19.3) — dengesiz veri, bu yüzden
  `class_weight="balanced"` kullanıldı.

## Ön işleme
- Türkçe'ye duyarlı küçük harfe çevirme (İ→i, I→ı; standart `.lower()`'ın Türkçe'de İ/I harflerini
  hatalı dönüştürme sorununu önlemek için özel fonksiyon).
- `@USER` etiketleri ve URL'ler temizlendi (anonimleştirilmiş placeholder'lar, ayırt edici sinyal
  taşımıyor).
- Tokenizasyon: en az 2 karakterli, Türkçe karakter setini (`çğıöşü`) destekleyen regex tabanlı
  tokenizer — hem Python (eğitim) hem TypeScript (tarayıcı çıkarımı) tarafında BİREBİR aynı mantıkla
  uygulanıyor (bkz. `src/lib/scoring.ts`), aksi halde eğitim zamanı ile çıkarım zamanı TF-IDF
  vektörleri uyuşmaz.
- Vektörleştirme: TF-IDF, `sublinear_tf=True` (1+log(tf)), L2 normalizasyon (scikit-learn varsayılanı).

## Model 1 — Tam Model (referans, dışa aktarılmadı)
Bütün kelime dağarcığıyla (`min_df=3, max_df=0.9`) eğitilen Lojistik Regresyon. Bu model sadece
karşılaştırma/referans amaçlıdır; boyutu nedeniyle tarayıcıya gönderilmez.

- Kelime dağarcığı boyutu: **19195**
- Test doğruluğu (accuracy): **0.7959**
- OFF sınıfı — precision: 0.4978, recall: 0.6425, F1: 0.5610
- NOT sınıfı — precision: 0.9017, recall: 0.8350, F1: 0.8671

**Tam Model — Karışıklık Matrisi (satır=gerçek, sütun=tahmin)**

|            | Tahmin: NOT | Tahmin: OFF |
|---|---|---|
| Gerçek: NOT | 2348 | 464 |
| Gerçek: OFF | 256 | 460 |


```
              precision    recall  f1-score   support

         NOT       0.90      0.83      0.87      2812
         OFF       0.50      0.64      0.56       716

    accuracy                           0.80      3528
   macro avg       0.70      0.74      0.71      3528
weighted avg       0.82      0.80      0.80      3528

```

## Model 2 — Kompakt Model (GERÇEK DIŞA AKTARILAN, TARAYICIDA ÇALIŞAN MODEL)
Tam modelin katsayılarının mutlak değerine göre en etkili **4000** kelime seçilip
(chi2/frekans yerine katsayı büyüklüğü kullanıldı — model için gerçekten ayırt edici olan kelimeleri
doğrudan yansıtır), bu daraltılmış kelime dağarcığıyla YENİDEN eğitildi. `public/model/toksisite-model.json`
dosyasına yazılan ve `src/lib/scoring.ts` tarafından tarayıcıda çalıştırılan model budur — aşağıdaki
metrikler kullanıcının fiilen kullanacağı modele aittir.

- Kelime dağarcığı boyutu: **4000**
- Dışa aktarılan JSON dosya boyutu: **184.8 KB**
- Test doğruluğu (accuracy): **0.7846**
- OFF sınıfı — precision: 0.4780, recall: 0.6690, F1: 0.5576
- NOT sınıfı — precision: 0.9062, recall: 0.8140, F1: 0.8576

**Kompakt Model — Karışıklık Matrisi (satır=gerçek, sütun=tahmin)**

|            | Tahmin: NOT | Tahmin: OFF |
|---|---|---|
| Gerçek: NOT | 2289 | 523 |
| Gerçek: OFF | 237 | 479 |


```
              precision    recall  f1-score   support

         NOT       0.91      0.81      0.86      2812
         OFF       0.48      0.67      0.56       716

    accuracy                           0.78      3528
   macro avg       0.69      0.74      0.71      3528
weighted avg       0.82      0.78      0.80      3528

```

## Dışa aktarım doğrulaması
`toksisite-model.json` içindeki `{vocab, idf, weights, bias}` alanları kullanılarak elle
(numpy ile) yeniden hesaplanan olasılıklar, scikit-learn'ün `predict_proba` çıktısıyla 200 test
örneği üzerinde karşılaştırıldı. **Maksimum mutlak fark: 0.00000000** — pratikte sıfır, yani
JSON dosyasına yazılan sayılar tarayıcıda birebir aynı skorları üretir (TS implementasyonu Python
tokenizer/TF-IDF mantığını doğru izlediği sürece).

## Bilinen sınırlamalar (dürüst beyan)
- Veri seti 2020 tarihli Twitter/X verisidir; güncel argo/slang örüntülerini (özellikle 2024-2026
  arası yeni internet dili) tam yakalamayabilir. Rapora "sonraki adım: periyodik yeniden eğitim"
  olarak not düşülmeli.
- İkili sınıflandırma (OFF/NOT) yapıyor; ince taneli duygu analizi (öfke/kaygı/üzüntü ayrımı) YOK —
  MVP kapsamı kasıtlı olarak dar tutuldu (§ kapsam dışı: gelecekte çok sınıflı genişleme mümkün).
  "Akış Aynası" arayüzünde model çıktısı "toksisite olasılığı" olarak sunuluyor, "duygu analizi"
  olarak ABARTILMIYOR.
- Kompakt modelin doğruluğu tam modele çok yakın (0.7846 vs 0.7959)
  — kelime dağarcığı budamasının performans kaybı ihmal edilebilir düzeyde.
- Model tek bir akademik veri setiyle eğitildi; farklı platform/bağlamlarda (ör. YouTube yorumları)
  genelleme performansı test edilmedi.
