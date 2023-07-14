import InboxModel, { InboxInterface } from "@/lib/mongo/models/InboxModel"
import { db } from "@/lib/mongo/util/connectMongo"
interface RequestBody {
    userEmail: string
}

export async function POST(request: Request) {
    await db.connect()
    const body: RequestBody = await request.json()

    const email = body.userEmail
    const response = await InboxModel.findOne({ userEmail: email })

    if (response) {
        return new Response(JSON.stringify(response as InboxInterface))
    }

    return new Response(JSON.stringify(null))

}