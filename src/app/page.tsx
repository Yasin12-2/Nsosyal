import Link from "next/link";

const ozellikler = [
  {
    baslik: "Gerçek, açıklanabilir bir sınıflandırıcı",
    aciklama:
      "Türkçe akademik bir veri setiyle (OffensEval-TR, 2020) eğitilmiş TF-IDF + Lojistik Regresyon modeli, sosyal medya metnindeki toksisite olasılığını tahmin eder. Kara kutu değil: her skorun hangi kelimelerden geldiği görülebilir.",
  },
  {
    baslik: "Cihazda kalır, dışarı çıkmaz",
    aciklama:
      "Yazdığınız/yapıştırdığınız metin hiçbir sunucuya gönderilmez. Skorlama tamamen tarayıcınızda çalışır, günlük yalnızca bu cihazda saklanır.",
  },
  {
    baslik: "Örüntüyü gösterir, yargılamaz",
    aciklama:
      "Tek bir gönderi değil, zaman içindeki örüntü önemlidir. Akış Aynası son girdilerinizin genel tonunu size sade bir şekilde gösterir.",
  },
  {
    baslik: "Nazik bir hatırlatma, alarm değil",
    aciklama:
      "Olumsuz örüntü belirginleştiğinde damgalamayan, suçlamayan bir farkındalık/mola önerisi sunar — karar her zaman sizde kalır.",
  },
  {
    baslik: "Güven Kartı: taklit/kalıp içerik farkındalığı",
    aciklama:
      "NSosyal'in kendi vaadi olan 'taklit hesaplara hassasiyet'i, kullanıcı tarafında tamamlayan bağımsız bir modül: birden fazla metin arasındaki şablon benzerliğini ve bir profildeki taklit riski sinyallerini, gerekçesiyle birlikte gösterir.",
  },
];

export default function AnaSayfa() {
  return (
    <div className="flex flex-col flex-1">
      <section className="bg-gradient-to-b from-[#eef5f2] to-[var(--background)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24 flex flex-col gap-6">
          <span className="inline-flex w-fit items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-[var(--renk-sakin-koyu)] ring-1 ring-inset ring-[var(--renk-sakin)]/30">
            NSosyal İnovasyon Yarışması 2026 · Sosyal Yapay Zekâ
          </span>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-gray-900 max-w-2xl">
            Akışa <span className="text-[var(--renk-sakin-koyu)]">ayna</span>{" "}
            tutan, sizi yargılamayan bir farkındalık aracı.
          </h1>
          <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
            NSosyal&apos;in kendi bildirim/sessize alma ayarları
            güvenilmez olduğunda (bkz. aşağıda), kullanıcının elinde her
            zaman çalışan bir ikinci katman kalmalı. Akış Aynası,
            yapıştırdığınız gönderi ve yorumları cihazınızda analiz eder,
            zaman içindeki örüntüyü gösterir ve seçtiğiniz içerikleri
            <strong> sunucu ayarına bağlı olmadan</strong> sessize alır —
            verileriniz asla bu cihazdan çıkmaz.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/akis"
              className="rounded-full bg-[var(--renk-sakin)] px-6 py-3 text-white font-medium hover:bg-[var(--renk-sakin-koyu)] transition-colors"
            >
              Akış Günlüğünü Aç
            </Link>
            <Link
              href="/hakkinda"
              className="rounded-full border border-gray-300 px-6 py-3 text-gray-700 font-medium hover:bg-black/5 transition-colors"
            >
              Nasıl çalışır?
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--renk-sakin-koyu)] mb-2">
          Neden bu proje? — NSosyal&apos;in kendi verisi
        </h2>
        <p className="text-gray-700 max-w-2xl leading-relaxed mb-4">
          Şikayetvar&apos;daki güncel NSosyal şikayet verisine göre platform{" "}
          <strong>27/100</strong> puanda (119 şikayetten yalnızca 13&apos;ü
          çözülmüş). En büyük iki küme: <strong>bildirim/sessize alma
          ayarlarının çalışmaması</strong> (52+ şikayet — kullanıcılar
          susturduğu kanallardan aylarca bildirim almaya devam ediyor,
          hesabını sildikten sonra bile SMS gelmesi dahil) ve hesap
          erişimi/kimlik doğrulama sorunları (53+ şikayet). Platformun kendi
          T3AI botu moderasyonu backend/platform tarafında yapıyor; ama
          kullanıcının <strong>kendi</strong> tarafında, platformun sunucu
          ayarına bağımlı olmadan güvenilir şekilde çalışan bir kişisel
          kontrol katmanı yok.
        </p>
        <p className="text-gray-700 max-w-2xl leading-relaxed mb-10">
          Akış Aynası bu boşluğu, <strong>farkındalık ve şeffaflık</strong>{" "}
          üzerinden dolduruyor: önce gösterir, sonra nazikçe hatırlatır, ve
          seçtiğiniz kural/kelimeleri cihazınızda <strong>garanti</strong>{" "}
          şekilde uygular — asla suçlamaz, asla platformun kendi ayarının
          çalışıp çalışmadığına bel bağlamaz.
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          {ozellikler.map((o) => (
            <div
              key={o.baslik}
              className="rounded-xl border border-black/10 bg-white p-5 shadow-sm"
            >
              <h3 className="font-medium text-gray-900 mb-2">{o.baslik}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {o.aciklama}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-20">
        <div className="rounded-xl bg-[var(--renk-sakin-koyu)] text-white p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">Hemen deneyin</h2>
            <p className="text-white/80 text-sm max-w-md">
              Demo verisiyle veya kendi örnek metninizle Akış Günlüğü&apos;nü
              test edin — kayıt gerekmez, hiçbir şey sunucuya gönderilmez.
            </p>
          </div>
          <Link
            href="/akis"
            className="shrink-0 rounded-full bg-white px-6 py-3 text-[var(--renk-sakin-koyu)] font-medium hover:bg-gray-100 transition-colors text-center"
          >
            Akış Günlüğünü Aç
          </Link>
        </div>
      </section>
    </div>
  );
}
