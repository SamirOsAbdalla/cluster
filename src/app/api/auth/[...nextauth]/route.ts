import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials"
import UserModel from "@/lib/mongo/models/UserModel";
import { db } from "@/lib/mongo/util/connectMongo";
import { signJwtAccessToken } from "@/lib/jwt";
import * as bcrypt from "bcrypt"

interface ReqBody {
    email: string;
    password: string;
}
const handler = NextAuth({
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "email", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // console.log("Authorize")
                // const res = await fetch("http://localhost:3000/api/login", {
                //     method: 'POST',
                //     body: JSON.stringify({
                //         email: credentials?.email,
                //         password: credentials?.password
                //     }),
                //     headers: { "Content-Type": "application/json" }
                // })

                await db.connect()
                let email = credentials?.email;
                let password;
                if (credentials?.password) {
                    password = credentials.password
                } else {
                    password = ""
                }

                const user = await UserModel.findOne({ email })

                if (user && (await bcrypt.compare(password, user.password))) {
                    const { password, ...userWithoutPassword } = user;
                    const accessToken = signJwtAccessToken(userWithoutPassword)
                    const result = {
                        ...userWithoutPassword,
                        accessToken
                    }
                    return result

                } else {
                    return null
                }
                // // If no error and we have user data, return it
                // if (res.ok && user) {

                //     return user
                // }
                // // Return null if user data could not be retrieved
                // return null
            }
        })
    ],
    session: {
        // Set to jwt in order to CredentialsProvider works properly
        strategy: 'jwt'
    },
    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user }
        },
        async session({ session, token }) {
            session.user = token as any
            return session
        }
    },
    pages: {
        signIn: "/signIn"
    },
})

export { handler as GET, handler as POST }