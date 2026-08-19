import { OruntuSonucu, TOKSIK_ESIK, PENCERE_BOYUTU } from "@/lib/oruntu";

/**
 * Son PENCERE_BOYUTU girdinin toksisite dağılımını sade bir çubuk grafikle
 * gösterir. Kasıtlı olarak ağır bir grafik kütüphanesi kullanılmadı — birkaç
 * <div> ile CSS tabanlı bir çubuk grafik yeterli ve daha hızlı yükleniyor
 * (çevrimdışı/performans önceliği).
 */
export default function OruntuPaneli({ oruntu }: { oruntu: OruntuSonucu }) {
  const { toplamGiris, toksikSayisi, toksikOran, pencereGirisleri } = oruntu;
  const yuzde = Math.round(toksikOran * 100);

  return (
    <section
      aria-label="Örüntü paneli"
      className="rounded-xl border border-black/10 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-medium text-gray-900">
          Son {toplamGiris > 0 ? toplamGiris : PENCERE_BOYUTU} girdinin örüntüsü
        </h2>
        <span className="text-sm text-gray-500">
          {toksikSayisi}/{toplamGiris} olumsuz (%{toplamGiris > 0 ? yuzde : 0})
        </span>
      </div>

      {toplamGiris === 0 ? (
        <p className="text-sm text-gray-400">
          Henüz girdi yok. Aşağıdan bir metin ekleyin veya örnek verilerle
          başlayın.
        </p>
      ) : (
        <>
          <div
            className="flex items-end gap-1 h-16"
            role="img"
            aria-label={`Son ${toplamGiris} girdiden ${toksikSayisi} tanesi eşik üzerinde`}
          >
            {pencereGirisleri.map((g) => (
              <div
                key={g.id}
                className={`flex-1 rounded-sm ${
                  g.skor >= TOKSIK_ESIK ? "bg-amber-400" : "bg-emerald-400"
                }`}
                style={{ height: `${Math.max(8, Math.round(g.skor * 100))}%` }}
                title={`%${Math.round(g.skor * 100)}`}
              />
            ))}
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all"
              style={{ width: `${yuzde}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Eşik: skor ≥ %{Math.round(TOKSIK_ESIK * 100)} olan girdiler
            &quot;olumsuz&quot; sayılır. Bu sadece bir örüntü göstergesidir,
            bir yargı değildir.
          </p>
        </>
      )}
    </section>
  );
}
