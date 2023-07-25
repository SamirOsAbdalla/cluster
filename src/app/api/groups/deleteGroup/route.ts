import { db } from "@/lib/mongo/util/connectMongo";
import GroupModel from "@/lib/mongo/models/GroupModel";
import mongoose from "mongoose"

interface ReqBody {
    groupId: string
}
export async function POST(request: Request) {
    await db.connect()


    let body: ReqBody = await request.json()

    if (body.groupId) {
        const id = new mongoose.Types.ObjectId(body.groupId)
        const response = await GroupModel.deleteOne({ _id: id })
        if (response) {
            return new Response(JSON.stringify(response))
        }
    }
    return new Response(JSON.stringify(null))
}