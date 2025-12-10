import Link from 'next/link'
import TemplateGrid from '../components/TemplateGrid'

export default function Home(){
  return (
    <div>
      <header className="text-center my-8">
        <h1 className="text-4xl font-bold">BotGhost Template Hub</h1>
        <p className="mt-2 text-gray-500">Discover and share BotGhost multi-code templates.</p>
      </header>

      <section>
        <TemplateGrid />
      </section>
    </div>
  )
}
