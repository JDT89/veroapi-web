import prisma from '../../../lib/prisma'
import { getServerSession } from 'next-auth/next'
import authOptions from './auth/[...nextauth]'

export default async function handler(req, res){
  if (req.method === 'GET'){
    const templates = await prisma.template.findMany({ include: { codes: true } })
    return res.json(templates)
  }

  if (req.method === 'POST'){
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({error:'unauth'})
    const { name, description, codes } = req.body
    const created = await prisma.template.create({
      data: {
        name,
        description,
        category: 'Uncategorized',
        author: { connect: { email: session.user.email } },
        codes: { create: codes.map((c, idx) => ({ type: c.type, title: c.title, shareCode: c.shareCode, orderIndex: idx })) }
      },
      include: { codes: true }
    })
    return res.json(created)
  }

  res.status(405).end()
}
