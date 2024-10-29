import { NextAuthOptions } from "next-auth";
import StravaProvider from "next-auth/providers/strava";
import CredentialsProvider from "next-auth/providers/credentials";
export const options: NextAuthOptions = {
    providers: [
        StravaProvider({
            clientId: process.env.STRAVA_CLIENT_ID as string,
            clientSecret: process.env.STRAVA_CLIENT_SECRET as string,
            authorization: {
                url: "https://www.strava.com/oauth/authorize",
                params: {
                    scope: "activity:read_all",
                }
            }
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "User",
                    type: "text",
                    placeholder: 'Enter username',
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: 'Enter password',
                }
            },
            // this is where we retrieve credentials from database
            async authorize(credentials) {
                const user = { id: "42", name: "Jevon", password: "Jevon" }
                if (credentials?.username === user.name && credentials?.password === user.password) {
                    return user
                } else {
                    return null
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token from a provider.
            session.accessToken = token.accessToken as string
            return session
        },
        async redirect({ url, baseUrl }) {
            return baseUrl // Redirects to the home page (`/`)
        },
    },
}