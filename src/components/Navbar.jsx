import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Navbar(){
  const { data: session } = useSession()
  return (
    <nav className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <Link href="/"><a className="text-2xl font-bold">BotGhost Hub</a></Link>
        <Link href="/templates"><a>Templates</a></Link>
        <Link href="/upload"><a>Upload</a></Link>
      </div>
      <div>
        {session ? (
          <div className="flex items-center gap-4">
            <img src={session.user.image} alt="avatar" className="w-8 h-8 rounded-full" />
            <button onClick={() => signOut()} className="btn">Sign out</button>
          </div>
        ) : (
          <button onClick={() => signIn('discord')} className="btn">Sign in</button>
        )}
      </div>
    </nav>
  )
}
