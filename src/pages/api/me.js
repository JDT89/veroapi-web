import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'

export default async function handler(req,res){
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ user: null })
  return res.json({ user: session.user })
}
