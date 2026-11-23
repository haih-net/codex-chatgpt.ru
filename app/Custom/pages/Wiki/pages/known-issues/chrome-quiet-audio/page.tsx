import type { WikiPageMetadata } from 'app/Custom/pages/Wiki/model'

export const metadata: WikiPageMetadata = {
  date: 1795381200000,
  title: 'Chrome играет тихо при громкости 100% в Linux',
  description:
    'Как обнаружить и восстановить заниженный Props.volume в PipeWire, когда системные звуки громкие, а Chrome почти не слышно.',
  intro: (
    <>
      Системные звуки играют нормально, но Chrome едва слышно даже при
      максимальном уровне в микшере. Причиной может быть отдельный коэффициент
      усиления PipeWire, который обычный ползунок не показывает.
    </>
  ),
}
