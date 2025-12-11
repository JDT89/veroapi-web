import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    const templates = await prisma.template.findMany({
      where: { userId: session.user.id },
    });
    return res.json(templates);
  }

  if (req.method === "POST") {
    const { name, shareCodes } = req.body;

    const template = await prisma.template.create({
      data: {
        name,
        shareCodes,
        userId: session.user.id,
      },
    });

    return res.status(201).json(template);
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}

