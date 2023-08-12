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

interface Tmp {
    name: string,
    email: string,
    accessToken: string
}
const handler = NextAuth({
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            type: "credentials",
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "email", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {

                await db.connect()
                let email = credentials?.email;
                let password;
                if (credentials?.password) {
                    password = credentials.password
                } else {
                    password = ""
                }

                const user = await UserModel.findOne({ email })
                if (!user || !(await bcrypt.compare(password, user.password))) {
                    return null
                } else {
                    const { password, ...currentUser } = user._doc
                    const accessToken = signJwtAccessToken(currentUser)
                    return ({
                        ...currentUser,
                        accessToken
                    })
                }
            }
        })
    ],
    session: {
        // Set to jwt in order to CredentialsProvider works properly
        strategy: 'jwt'
    },
    callbacks: {
        async jwt({ token, trigger, user, session }) {
            if (trigger === 'update') {
                if (session.info) {
                    token.picture = session.info
                }
            }
            return { ...token, ...user };
        },
        async session({ session, token }) {
            session.user = token as any;
            return session;
        }
    },
    pages: {
        signIn: "/signIn",
    },
})

export { handler as GET, handler as POST }