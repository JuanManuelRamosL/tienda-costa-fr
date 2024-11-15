import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from "next-auth/providers/github";

console.log(process.env.GOOGLE_ID)
const handler = NextAuth({
    providers:[ 
      GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET
      }), 
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID, 
        clientSecret: process.env.GITHUB_CLIENT_SECRET, 
        authorization: { params: { scope: 'read:user user:email' } },
      }),],
      pages: {
        signIn: '/auth/login', 
      }
})

export {handler as GET ,handler as POST}