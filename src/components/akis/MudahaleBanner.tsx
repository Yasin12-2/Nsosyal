/**
 * Aktif müdahale (JITAI-benzeri) banner'ı. Dil bilinçli olarak damgalamayan,
 * güçlendirici bir tonda yazıldı: "bağımlısınız", "tehlikedesiniz" gibi
 * ifadeler YOK; seçim her zaman kullanıcıda bırakılıyor.
 */
export default function MudahaleBanner({
  toksikOran,
  onKapat,
}: {
  toksikOran: number;
  onKapat: () => void;
}) {
  const yuzde = Math.round(toksikOran * 100);

  return (
    <div
      role="status"
      className="rounded-xl border border-amber-300 bg-amber-50 p-5 flex flex-col sm:flex-row sm:items-center gap-4"
    >
      <div className="flex-1">
        <h2 className="font-medium text-amber-900">
          Son girdilerinizin yaklaşık %{yuzde}&apos;i olumsuz görünüyor
        </h2>
        <p className="text-sm text-amber-800/90 mt-1 leading-relaxed">
          Bu bir uyarı değil, sadece bir gözlem. İsterseniz kısa bir mola
          verip farklı bir şeyle ilgilenebilir, isterseniz akışa devam
          edebilirsiniz — karar tamamen size ait.
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          type="button"
          onClick={onKapat}
          className="rounded-full border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100 transition-colors"
        >
          Gördüm, teşekkürler
        </button>
      </div>
    </div>
  );
}
