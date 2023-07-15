import { db } from "@/lib/mongo/util/connectMongo";
import GroupModel from "@/lib/mongo/models/GroupModel";
import mongoose from "mongoose";
interface RequestBody {
    groupId: string
}
export async function POST(request: Request) {
    await db.connect()
    const body: RequestBody = await request.json()

    const id = new mongoose.Types.ObjectId(body.groupId)
    const fetchedGroup = await GroupModel.findOne({ _id: id })
    if (fetchedGroup) {

        return new Response(JSON.stringify(fetchedGroup))
    }
    return new Response(JSON.stringify(null))
}