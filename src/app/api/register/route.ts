import { MemberInterface } from "@/lib/mongo/models/ProjectModel";
import UserModel, { InboxInterface } from "@/lib/mongo/models/UserModel";
import { db } from "@/lib/mongo/util/connectMongo";
import mongoose from 'mongoose';

interface RequestBody {
    name: string;
    email: string;
    password: string;
}

export async function POST(request: Request) {
    await db.connect()
    try {
        const { name, email, password } = await request.json()
        const userResult = await UserModel.findOne({ email })

        let inbox: InboxInterface[] = []
        if (userResult) {
            console.log("hi")
            throw new Error("User already exists")
        } else {
            let user = await UserModel.create({
                name,
                email,
                password,
                inbox: inbox
            })

            if (user) {
                const { password, ...result } = user;
                return new Response(JSON.stringify(result))
            }
        }
    }
    catch (error: unknown) {
        console.log(error);
        throw new Error("error")
    }


}