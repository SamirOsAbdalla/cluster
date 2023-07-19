import InboxModel from "@/lib/mongo/models/InboxModel"
import { InboxInterface, InboxItemInterface } from "@/lib/mongo/models/InboxModel"
interface RequestBody {
    groupName: string,
    senderName: string,
    senderEmail: string,
    groupId: string,
    addedMembers: string[],
}

export async function POST(request: Request) {

    const body: RequestBody = await request.json()
    const inboxItemObject: InboxItemInterface = {
        groupName: body.groupName,
        senderName: body.senderName,
        senderEmail: body.senderEmail,
        groupId: body.groupId,
    }
    let members = body.addedMembers

    members.forEach(async (memberEmail) => {

        const response = await InboxModel.findOneAndUpdate(
            {
                "userEmail": memberEmail,
                "inboxItems.groupId": { $ne: body.groupId }
            },
            { $addToSet: { "inboxItems": inboxItemObject } })

    })

    return new Response(JSON.stringify({ msg: "Invites sent" }))
}