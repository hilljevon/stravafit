import NextAuth from "next-auth"
import StravaProvider from "next-auth/providers/strava";
import { options } from "./options";
const handler = NextAuth(options)

export { handler as GET, handler as POST }