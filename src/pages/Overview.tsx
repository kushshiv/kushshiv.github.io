import Gallery from '@/components/gallery/Gallery'
import { profile } from '@/content/load'

export default function Overview() {
  return (
    <main>
      <h1 className="sr-only">{profile.name}</h1>
      <Gallery />
    </main>
  )
}
