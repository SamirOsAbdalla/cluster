import GroupModel from "@/lib/mongo/models/GroupModel"
import mongoose from "mongoose"
interface RequestBody {
    groupId: string
    userEmail: string,
}
export async function POST(request: Request) {

    const body: RequestBody = await request.json()
    const id = new mongoose.Types.ObjectId(body.groupId)
    const response = await GroupModel.findOneAndUpdate({ _id: id }, { $pull: { members: { memberEmail: body.userEmail } } })
    console.log(response)
    if (response) {
        return new Response(JSON.stringify(response))
    }

    return new Response(JSON.stringify(null))
}