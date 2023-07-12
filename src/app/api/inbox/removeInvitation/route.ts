import InboxModel from "@/lib/mongo/models/InboxModel"
import mongoose from "mongoose"
interface RequestBody {
    inviteItemId: string,
    userEmail: string,
}
export async function POST(request: Request) {

    const body: RequestBody = await request.json()
    const id = new mongoose.Types.ObjectId(body.inviteItemId)
    const response = await InboxModel.findOneAndUpdate({ userEmail: body.userEmail }, { $pull: { inboxItems: { _id: id } } })
    if (response) {
        return new Response(JSON.stringify(response))
    }

    return new Response(JSON.stringify({ msg: "Could not accept invite" }))
}