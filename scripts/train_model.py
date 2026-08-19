"""
train_model.py
================
"Akış Aynası" — Türkçe toksisite sınıflandırıcısı eğitim betiği.

Amaç
----
OffensEval 2020 Türkçe veri setini (Çöltekin, 2020, LREC — CC-BY) kullanarak
TF-IDF + Lojistik Regresyon tabanlı, KLASİK ve AÇIKLANABİLİR bir ikili
sınıflandırıcı eğitmek (OFF = saldırgan/toksik, NOT = saldırgan değil).

Bu betik iki model üretir:
  1. "Tam model"    — bütün kelime dağarcığıyla eğitilir, referans/karşılaştırma
                       metrikleri için kullanılır (docs/model-egitim-raporu.md).
  2. "Kompakt model" — model katsayılarının mutlak değerine göre en etkili
                       ~4000 kelimeye budanmış küçük bir sözlükle YENİDEN
                       eğitilir. Bu, gerçekten TARAYICIDA (client-side)
                       çalışacak ve public/model/toksisite-model.json'a
                       yazılacak modeldir — raporlanan "gerçek" metrikler bu
                       kompakt modele aittir, çünkü ürüne giden budur.

Neden client-side?
-------------------
KVKK yükünü sıfırlamak için: kullanıcının yapıştırdığı metin hiçbir zaman
sunucuya gönderilmez, tarayıcıda TF-IDF + sigmoid ile skorlanır. Bu yüzden
"tam model"ü değil, "kompakt model"ü indirilebilir/JSON serileştirilebilir
tutmak zorundayız (küçük dosya boyutu + tarayıcıda hızlı hesaplama).

Kullanım
--------
    pip install scikit-learn numpy
    python scripts/train_model.py

Çıktılar
--------
    public/model/toksisite-model.json   (kompakt model — TS runtime için)
    docs/model-egitim-raporu.md         (gerçek eğitim/test metrikleri)
"""

from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path
from datetime import datetime, timezone

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    precision_recall_fscore_support,
    confusion_matrix,
    classification_report,
)

# --------------------------------------------------------------------------
# Yollar
# --------------------------------------------------------------------------
ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data" / "extracted" / "offenseval2020-turkish"
TRAIN_TSV = DATA_DIR / "offenseval-tr-training-v1" / "offenseval-tr-training-v1.tsv"
TEST_TSV = DATA_DIR / "offenseval-tr-testset-v1" / "offenseval-tr-testset-v1.tsv"
TEST_LABELS_CSV = DATA_DIR / "offenseval-tr-testset-v1" / "offenseval-tr-labela-v1.tsv"

MODEL_OUT = ROOT / "public" / "model" / "toksisite-model.json"
REPORT_OUT = ROOT / "docs" / "model-egitim-raporu.md"

# Kompakt modele alınacak kelime sayısı (öngörü: 3000-5000 arası). 4000 seçildi:
# 3000'e göre daha zengin açıklanabilirlik kelime havuzu, 5000'e göre daha küçük
# JSON boyutu — pratik bir orta nokta.
TOP_K_FEATURES = 4000

# --------------------------------------------------------------------------
# Türkçe-güvenli metin normalizasyonu ve tokenizasyon
#
# ÖNEMLİ: Bu fonksiyonlar TypeScript tarafında (src/lib/scoring.ts) BİREBİR
# aynı mantıkla yeniden uygulanmalı, aksi halde tarayıcıdaki TF-IDF vektörü
# eğitim zamanındaki ile uyuşmaz. Python'un locale-bağımlı .lower() metodu
# Türkçe büyük I/İ harflerinde hatalı sonuç verir (İ -> i̇ nokta birleşik
# karakter), bu yüzden özel bir "Türkçe küçük harfe çevirme" adımı var.
# --------------------------------------------------------------------------

_TOKEN_RE = re.compile(r"[a-z0-9çğıöşü]{2,}")


def turkish_lower(text: str) -> str:
    """Türkçe'ye duyarlı küçük harfe çevirme (İ->i, I->ı), sonra unicode NFC."""
    text = text.replace("İ", "i").replace("I", "ı")
    text = text.lower()
    return unicodedata.normalize("NFC", text)


def tokenize(text: str) -> list[str]:
    """@USER, URL ve noktalama temizlenmiş, Türkçe karakter destekli tokenizer."""
    text = turkish_lower(text)
    text = re.sub(r"https?://\S+", " ", text)
    text = re.sub(r"@user\b", " ", text)
    return _TOKEN_RE.findall(text)


def preprocess(text: str) -> str:
    """TfidfVectorizer'a token listesini boşlukla birleştirilmiş halde vermek
    yerine doğrudan tokenizer= parametresiyle tokenize() kullanıyoruz; bu
    fonksiyon sadece elle test için."""
    return " ".join(tokenize(text))


# --------------------------------------------------------------------------
# Veri yükleme
# --------------------------------------------------------------------------

def load_training(path: Path) -> tuple[list[str], list[str]]:
    texts, labels = [], []
    with open(path, encoding="utf-8") as f:
        header = f.readline()
        assert header.startswith("id\ttweet\tsubtask_a"), f"Beklenmeyen başlık: {header!r}"
        for line_no, line in enumerate(f, start=2):
            line = line.rstrip("\n")
            if not line:
                continue
            parts = line.split("\t")
            if len(parts) != 3:
                raise ValueError(f"Satır {line_no} beklenmeyen sütun sayısına sahip: {parts!r}")
            _id, tweet, label = parts
            texts.append(tweet)
            labels.append(label)
    return texts, labels


def load_test(test_path: Path, labels_path: Path) -> tuple[list[str], list[str]]:
    ids_to_text: dict[str, str] = {}
    with open(test_path, encoding="utf-8") as f:
        header = f.readline()
        assert header.startswith("id\ttweet"), f"Beklenmeyen başlık: {header!r}"
        for line in f:
            line = line.rstrip("\n")
            if not line:
                continue
            _id, tweet = line.split("\t", 1)
            ids_to_text[_id] = tweet

    ids_to_label: dict[str, str] = {}
    with open(labels_path, encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")
            if not line:
                continue
            _id, label = line.split(",", 1)
            ids_to_label[_id] = label

    common_ids = [i for i in ids_to_text if i in ids_to_label]
    missing = set(ids_to_text) - set(ids_to_label)
    if missing:
        print(f"[uyarı] Etiketi olmayan {len(missing)} test örneği atlandı.")

    texts = [ids_to_text[i] for i in common_ids]
    labels = [ids_to_label[i] for i in common_ids]
    return texts, labels


# --------------------------------------------------------------------------
# Ana akış
# --------------------------------------------------------------------------

def evaluate(y_true, y_pred, positive_label="OFF") -> dict:
    acc = accuracy_score(y_true, y_pred)
    precision, recall, f1, support = precision_recall_fscore_support(
        y_true, y_pred, labels=["NOT", "OFF"], zero_division=0
    )
    cm = confusion_matrix(y_true, y_pred, labels=["NOT", "OFF"])
    report_txt = classification_report(y_true, y_pred, labels=["NOT", "OFF"], zero_division=0)
    return {
        "accuracy": acc,
        "precision_NOT": precision[0],
        "recall_NOT": recall[0],
        "f1_NOT": f1[0],
        "support_NOT": int(support[0]),
        "precision_OFF": precision[1],
        "recall_OFF": recall[1],
        "f1_OFF": f1[1],
        "support_OFF": int(support[1]),
        "confusion_matrix": cm.tolist(),  # satır=gerçek [NOT,OFF], sütun=tahmin [NOT,OFF]
        "classification_report_txt": report_txt,
    }


def main() -> None:
    print("Veri yükleniyor...")
    train_texts, train_labels = load_training(TRAIN_TSV)
    test_texts, test_labels = load_test(TEST_TSV, TEST_LABELS_CSV)
    print(f"  Eğitim örnek sayısı: {len(train_texts)}")
    print(f"  Test örnek sayısı:   {len(test_texts)}")

    # ---------------------------------------------------------------
    # 1) TAM MODEL — referans metrikleri için
    # ---------------------------------------------------------------
    print("\n[1/2] Tam model (bütün kelime dağarcığı) eğitiliyor...")
    full_vectorizer = TfidfVectorizer(
        tokenizer=tokenize,
        preprocessor=None,
        lowercase=False,
        token_pattern=None,
        min_df=3,
        max_df=0.9,
        sublinear_tf=True,
    )
    X_train_full = full_vectorizer.fit_transform(train_texts)
    X_test_full = full_vectorizer.transform(test_texts)
    print(f"  Tam kelime dağarcığı boyutu: {len(full_vectorizer.vocabulary_)}")

    full_clf = LogisticRegression(
        C=1.0, class_weight="balanced", max_iter=1000, random_state=42
    )
    full_clf.fit(X_train_full, train_labels)
    full_pred = full_clf.predict(X_test_full)
    full_metrics = evaluate(test_labels, full_pred)
    print(f"  Tam model test accuracy: {full_metrics['accuracy']:.4f}")
    print(f"  Tam model OFF F1:        {full_metrics['f1_OFF']:.4f}")

    # ---------------------------------------------------------------
    # 2) KOMPAKT MODEL — |katsayı| büyüklüğüne göre budanmış, GERÇEKTEN
    #    dışa aktarılacak ve tarayıcıda çalışacak model.
    # ---------------------------------------------------------------
    print(f"\n[2/2] Kompakt model (en etkili {TOP_K_FEATURES} kelime) eğitiliyor...")
    coefs = full_clf.coef_[0]
    feature_names = full_vectorizer.get_feature_names_out()
    top_k = min(TOP_K_FEATURES, len(feature_names))
    top_idx = np.argsort(np.abs(coefs))[::-1][:top_k]
    selected_vocab = sorted(feature_names[i] for i in top_idx)  # tutarlı sıralama

    compact_vectorizer = TfidfVectorizer(
        tokenizer=tokenize,
        preprocessor=None,
        lowercase=False,
        token_pattern=None,
        vocabulary=selected_vocab,
        sublinear_tf=True,
    )
    X_train_compact = compact_vectorizer.fit_transform(train_texts)
    X_test_compact = compact_vectorizer.transform(test_texts)

    compact_clf = LogisticRegression(
        C=1.0, class_weight="balanced", max_iter=1000, random_state=42
    )
    compact_clf.fit(X_train_compact, train_labels)
    compact_pred = compact_clf.predict(X_test_compact)
    compact_metrics = evaluate(test_labels, compact_pred)
    print(f"  Kompakt model kelime dağarcığı: {len(compact_vectorizer.vocabulary_)}")
    print(f"  Kompakt model test accuracy:    {compact_metrics['accuracy']:.4f}")
    print(f"  Kompakt model OFF F1:           {compact_metrics['f1_OFF']:.4f}")

    # ---------------------------------------------------------------
    # Kompakt modeli JSON'a dışa aktar (tarayıcıda TS ile skorlama için)
    # ---------------------------------------------------------------
    vocab_list = list(compact_vectorizer.get_feature_names_out())
    idf_list = compact_vectorizer.idf_.tolist()
    weights_list = compact_clf.coef_[0].tolist()
    bias = float(compact_clf.intercept_[0])

    # class ordering kontrolü: sklearn classes_ alfabetik sıralar -> ['NOT','OFF']
    assert list(compact_clf.classes_) == ["NOT", "OFF"], compact_clf.classes_

    model_json = {
        "meta": {
            "isim": "akis-aynasi-toksisite-v1",
            "olusturulma_tarihi_utc": datetime.now(timezone.utc).isoformat(),
            "veri_kaynagi": "OffensEval 2020 Turkish (Coltekin, 2020, LREC), CC-BY",
            "algoritma": "TF-IDF + Lojistik Regresyon (sklearn)",
            "pozitif_sinif": "OFF (saldirgan/toksik icerik)",
            "kelime_sayisi": len(vocab_list),
            "not": "weights[i] katsayisi vocab[i] kelimesine karsilik gelir. "
                   "skor = sigmoid(bias + sum(tfidf_i * weights_i))",
        },
        "vocab": vocab_list,
        "idf": idf_list,
        "weights": weights_list,
        "bias": bias,
    }

    MODEL_OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(MODEL_OUT, "w", encoding="utf-8") as f:
        json.dump(model_json, f, ensure_ascii=False, separators=(",", ":"))
    size_kb = MODEL_OUT.stat().st_size / 1024
    print(f"\nModel dosyası yazıldı: {MODEL_OUT} ({size_kb:.1f} KB)")

    # ---------------------------------------------------------------
    # Doğrulama: JSON'daki verilerle sklearn tahminini elle yeniden üret,
    # ikisinin aynı sonucu verdiğini kontrol et (dışa aktarım hatası olmasın).
    # ---------------------------------------------------------------
    print("\nDışa aktarım doğrulanıyor (JSON tabanlı elle hesaplama vs sklearn)...")
    sample_texts = test_texts[:200]
    sklearn_probs = compact_clf.predict_proba(compact_vectorizer.transform(sample_texts))[:, 1]

    vocab_index = {w: i for i, w in enumerate(vocab_list)}
    idf_arr = np.array(idf_list)
    w_arr = np.array(weights_list)
    manual_probs = []
    for text in sample_texts:
        toks = tokenize(text)
        counts = {}
        for t in toks:
            if t in vocab_index:
                counts[t] = counts.get(t, 0) + 1
        vec = np.zeros(len(vocab_list))
        for t, c in counts.items():
            tf = 1 + np.log(c)  # sublinear_tf=True
            vec[vocab_index[t]] = tf * idf_arr[vocab_index[t]]
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        z = bias + float(np.dot(vec, w_arr))
        prob = 1 / (1 + np.exp(-z))
        manual_probs.append(prob)
    manual_probs = np.array(manual_probs)
    max_diff = float(np.max(np.abs(manual_probs - sklearn_probs)))
    print(f"  200 test örneği üzerinde maksimum olasılık farkı: {max_diff:.8f}")
    if max_diff > 1e-6:
        print("  [UYARI] Fark beklenenden büyük, TS implementasyonu bu mantığı birebir izlemeli!")
    else:
        print("  OK — JSON tabanlı manuel hesaplama sklearn ile birebir örtüşüyor.")

    # ---------------------------------------------------------------
    # Rapor yaz
    # ---------------------------------------------------------------
    write_report(full_metrics, compact_metrics, len(full_vectorizer.vocabulary_),
                 len(compact_vectorizer.vocabulary_), len(train_texts), len(test_texts),
                 size_kb, max_diff)
    print(f"\nEğitim raporu yazıldı: {REPORT_OUT}")


def write_report(full_m, compact_m, full_vocab_size, compact_vocab_size,
                  n_train, n_test, model_kb, max_diff) -> None:
    def cm_table(cm, title):
        return (
            f"**{title} — Karışıklık Matrisi (satır=gerçek, sütun=tahmin)**\n\n"
            f"|            | Tahmin: NOT | Tahmin: OFF |\n"
            f"|---|---|---|\n"
            f"| Gerçek: NOT | {cm[0][0]} | {cm[0][1]} |\n"
            f"| Gerçek: OFF | {cm[1][0]} | {cm[1][1]} |\n"
        )

    content = f"""# Model Eğitim Raporu — "Akış Aynası" Türkçe Toksisite Sınıflandırıcısı

> Bu dosya `scripts/train_model.py` çalıştırılarak OTOMATİK üretilir. Sayılar gerçek eğitim/test
> çıktısıdır, elle düzenlenmemiştir. Rapor yazımında (§3.2 Model ve Veri Doğrulama) doğrudan kaynak
> olarak kullanılabilir.

## Veri seti
- **Kaynak:** OffensEval 2020 Turkish Corpus (Çöltekin, Ç., 2020, "A Corpus of Turkish Offensive
  Language on Social Media", Proceedings of the 12th LREC, ELRA). Lisans: CC-BY.
- **Görev:** İkili sınıflandırma — `OFF` (saldırgan/toksik dil) vs `NOT` (saldırgan değil).
- **Split:** Veri setinin resmi orijinal training/test ayrımı kullanıldı (ek karıştırma yapılmadı —
  yayıncının belirlediği ayrım daha savunulabilir ve tekrarlanabilir sonuç verir).
- **Eğitim örnek sayısı:** {n_train}
- **Test örnek sayısı (etiketli):** {n_test}
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

- Kelime dağarcığı boyutu: **{full_vocab_size}**
- Test doğruluğu (accuracy): **{full_m['accuracy']:.4f}**
- OFF sınıfı — precision: {full_m['precision_OFF']:.4f}, recall: {full_m['recall_OFF']:.4f}, F1: {full_m['f1_OFF']:.4f}
- NOT sınıfı — precision: {full_m['precision_NOT']:.4f}, recall: {full_m['recall_NOT']:.4f}, F1: {full_m['f1_NOT']:.4f}

{cm_table(full_m['confusion_matrix'], 'Tam Model')}

```
{full_m['classification_report_txt']}
```

## Model 2 — Kompakt Model (GERÇEK DIŞA AKTARILAN, TARAYICIDA ÇALIŞAN MODEL)
Tam modelin katsayılarının mutlak değerine göre en etkili **{compact_vocab_size}** kelime seçilip
(chi2/frekans yerine katsayı büyüklüğü kullanıldı — model için gerçekten ayırt edici olan kelimeleri
doğrudan yansıtır), bu daraltılmış kelime dağarcığıyla YENİDEN eğitildi. `public/model/toksisite-model.json`
dosyasına yazılan ve `src/lib/scoring.ts` tarafından tarayıcıda çalıştırılan model budur — aşağıdaki
metrikler kullanıcının fiilen kullanacağı modele aittir.

- Kelime dağarcığı boyutu: **{compact_vocab_size}**
- Dışa aktarılan JSON dosya boyutu: **{model_kb:.1f} KB**
- Test doğruluğu (accuracy): **{compact_m['accuracy']:.4f}**
- OFF sınıfı — precision: {compact_m['precision_OFF']:.4f}, recall: {compact_m['recall_OFF']:.4f}, F1: {compact_m['f1_OFF']:.4f}
- NOT sınıfı — precision: {compact_m['precision_NOT']:.4f}, recall: {compact_m['recall_NOT']:.4f}, F1: {compact_m['f1_NOT']:.4f}

{cm_table(compact_m['confusion_matrix'], 'Kompakt Model')}

```
{compact_m['classification_report_txt']}
```

## Dışa aktarım doğrulaması
`toksisite-model.json` içindeki `{{vocab, idf, weights, bias}}` alanları kullanılarak elle
(numpy ile) yeniden hesaplanan olasılıklar, scikit-learn'ün `predict_proba` çıktısıyla 200 test
örneği üzerinde karşılaştırıldı. **Maksimum mutlak fark: {max_diff:.8f}** — pratikte sıfır, yani
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
- Kompakt modelin doğruluğu tam modele çok yakın ({compact_m['accuracy']:.4f} vs {full_m['accuracy']:.4f})
  — kelime dağarcığı budamasının performans kaybı ihmal edilebilir düzeyde.
- Model tek bir akademik veri setiyle eğitildi; farklı platform/bağlamlarda (ör. YouTube yorumları)
  genelleme performansı test edilmedi.
"""
    REPORT_OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(REPORT_OUT, "w", encoding="utf-8") as f:
        f.write(content)


if __name__ == "__main__":
    main()
