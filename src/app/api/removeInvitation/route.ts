import UserModel from "@/lib/mongo/models/UserModel"
import { InboxInterface } from "@/lib/mongo/models/UserModel"
import mongoose from "mongoose"
interface RequestBody {
    inviteId: string,
    userEmail: string,
}
export async function POST(request: Request) {

    const body: RequestBody = await request.json()
    const id = new mongoose.Types.ObjectId(body.inviteId)
    const response = await UserModel.findOneAndUpdate({ email: body.userEmail }, { $pull: { inbox: { _id: id } } })
    if (response) {
        return new Response(JSON.stringify(response))
    }

    return new Response(JSON.stringify({ msg: "Could not accept invite" }))
}