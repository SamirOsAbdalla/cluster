import GroupModel from "@/lib/mongo/models/GroupModel"
import mongoose from "mongoose"
interface RequestBody {
    userEmail: string,
    userName: string,
    groupId: string
}

export async function POST(request: Request) {
    const body: RequestBody = await request.json()

    const id = new mongoose.Types.ObjectId(body.groupId)
    const userObject = {
        memberEmail: body.userEmail,
        memberName: body.userName
    }
    const response = await GroupModel.findByIdAndUpdate(id,
        { $push: { members: userObject } })

    if (response) {
        return new Response(JSON.stringify(response))
    }
    return new Response(JSON.stringify(null))

}