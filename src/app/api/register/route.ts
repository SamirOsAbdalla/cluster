import { MemberInterface } from "@/lib/mongo/models/GroupModel";
import UserModel from "@/lib/mongo/models/UserModel";
import InboxModel from "@/lib/mongo/models/InboxModel";
import { InboxInterface, InboxItemInterface } from "@/lib/mongo/models/InboxModel";
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
        if (userResult) {
            return new Response(JSON.stringify(null))
        } else {
            let user = await UserModel.create({
                name,
                email,
                password,
                picture: {
                    public_id: "",
                    url: ""
                }
            })

            if (user) {
                console.log("User:", user)
                const inboxResult = await InboxModel.create({
                    inboxItems: [],
                    userEmail: email
                })

                const { password, ...result } = user;
                return new Response(JSON.stringify(result))
            }
        }
    }
    catch (error: unknown) {
        console.log(error + "in register");
        throw new Error("User creation error")
    }


}