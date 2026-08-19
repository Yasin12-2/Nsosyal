const bolumler = [
  {
    baslik: "Problem — NSosyal'in kendi verisi",
    icerik:
      "Şikayetvar'daki güncel NSosyal şikayet verisine göre platform 27/100 puanda (119 şikayetten yalnızca 13'ü çözülmüş). En büyük şikayet kümesi (52+ şikayet): bildirim/sessize alma ayarlarının çalışmaması — kullanıcılar susturduğu kanallardan aylarca bildirim almaya devam ediyor, hesabını sildikten sonra bile pazarlama SMS'i gelmeye devam ediyor. Platformun kendi T3AI botu moderasyonu platform tarafında yapıyor; ama kullanıcının kendi elinde, sunucu ayarına bağımlı olmayan bir kontrol katmanı yok. Bu prototip tam bu boşluğu dolduruyor.",
  },
  {
    baslik: "Garanti Sessizlik",
    icerik:
      "Akış Günlüğü'ndeki bir panelden, sessize almak istediğiniz kelime/kaynak etiketlerini (ör. \"N Spor\") tanımlayabilirsiniz. Bu kurallar sunucuya hiç gönderilmez; yalnızca bu cihazda, platformun kendi ayarı çalışsa da çalışmasa da her zaman uygulanır — Şikayetvar'daki belgelenen \"ayardan kapattım ama gelmeye devam ediyor\" örüntüsüne doğrudan yanıt.",
  },
  {
    baslik: "Model ve veri",
    icerik:
      "Skorlama, OffensEval 2020 Turkish veri setiyle (Çöltekin, 2020, LREC, CC-BY lisanslı; ~31,7 bin eğitim + ~3,5 bin test örneği) eğitilmiş bir TF-IDF + Lojistik Regresyon modeline dayanıyor. Gerçek eğitim/test metrikleri docs/model-egitim-raporu.md dosyasında; uydurulmuş sayı yok.",
  },
  {
    baslik: "Neden client-side (tarayıcıda çalışan) bir model?",
    icerik:
      "Model küçük (~4000 kelimelik budanmış kelime dağarcığı) olduğu için tamamen tarayıcıda, TypeScript ile çalışabiliyor. Bu sayede kullanıcının yazdığı metin hiçbir zaman bir sunucuya gönderilmiyor — KVKK yükü mimari olarak sıfırlanıyor, çünkü toplanan/işlenen bir 'gerçek kullanıcı verisi' yok.",
  },
  {
    baslik: "Şeffaflık",
    icerik:
      "Model doğrusal olduğu için her skor, kelime katkılarının toplamı olarak tam olarak açıklanabilir. Her girdide 'Neden bu skoru gördüm?' paneli, skoru en çok artıran/azaltan kelimeleri gösterir — bu gerçek bir açıklanabilirlik, dekoratif bir 'yapay zeka' süsü değil.",
  },
  {
    baslik: "Sınırlamalar (dürüst beyan)",
    icerik:
      "Bu bir teşhis veya terapi aracı değildir. Model ikili (toksik/değil) çalışır, ince taneli duygu analizi yapmaz. Veri seti 2020 tarihlidir, güncel argo/slang'ı tam yakalamayabilir. Gerçek NSosyal API/kaynak koduna erişim bu prototip aşamasında doğrulanamadı; bu yüzden bir tamamlayıcı (companion) araç olarak konumlandırılıyor — kullanıcı metni manuel yapıştırarak veya örnek verilerle test ediyor. Resmi entegrasyon, sonraki adım olarak (NSosyal ekibiyle ön görüşme) planlanıyor.",
  },
];

export default function HakkindaSayfasi() {
  return (
    <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 py-10 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Hakkında</h1>
        <p className="text-gray-600 mt-1">
          Akış Aynası, NSosyal İnovasyon Yarışması 2026 (Sosyal Yapay Zekâ
          teması) için geliştirilmiş bir prototiptir.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {bolumler.map((b) => (
          <section key={b.baslik}>
            <h2 className="font-medium text-gray-900 mb-2">{b.baslik}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {b.icerik}
            </p>
          </section>
        ))}
      </div>

      <section className="rounded-xl border border-black/10 bg-white p-5 text-sm text-gray-600">
        <h2 className="font-medium text-gray-900 mb-2">Veri ve gizlilik</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Girdiğiniz metin hiçbir sunucuya gönderilmez.</li>
          <li>
            Akış Günlüğü yalnızca bu tarayıcının localStorage&apos;ında
            saklanır; başka bir cihazdan görülemez.
          </li>
          <li>
            &quot;Tümünü temizle&quot; ile günlüğünüzü istediğiniz an tamamen
            silebilirsiniz.
          </li>
          <li>
            Prototipte hesap/oturum sistemi yoktur; gerçek kullanıcı verisi
            toplanmaz.
          </li>
        </ul>
      </section>
    </div>
  );
}
