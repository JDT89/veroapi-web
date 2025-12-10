import prisma from '../../../lib/prisma'

export default async function handler(req, res){
  const { id } = req.query
  if (req.method === 'GET'){
    const t = await prisma.template.findUnique({ where: { id }, include: { codes: true, variables: true, setupSteps: true } })
    if (!t) return res.status(404).json({ error: 'not found' })
    return res.json(t)
  }
  if (req.method === 'DELETE'){
    await prisma.template.delete({ where: { id } })
    return res.json({ ok: true })
  }
  res.status(405).end()
}
