import NextAuth from "next-auth/next";
import { InboxInterface } from "../mongo/models/UserModel";
declare module 'next-auth' {
    interface Session {
        user: {
            name: string,
            email: string,
            accessToken: string
        }
    }
}