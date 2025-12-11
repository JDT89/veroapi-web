import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '../../../lib/prisma'


export default function auth(req, res){
return NextAuth(req, res, {
adapter: PrismaAdapter(prisma),
providers: [
DiscordProvider({
clientId: process.env.DISCORD_CLIENT_ID,
clientSecret: process.env.DISCORD_CLIENT_SECRET,
})
],
secret: process.env.NEXTAUTH_SECRET,
session: { strategy: 'jwt' }
})
}
