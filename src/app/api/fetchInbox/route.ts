import UserModel from "@/lib/mongo/models/UserModel"
import { InboxInterface } from "@/lib/mongo/models/UserModel"
interface RequestBody {
    userEmail: string
}

export async function POST(request: Request) {
    const body: RequestBody = await request.json()

    const email = body.userEmail
    const response = await UserModel.findOne({ email })

    if (response) {
        return new Response(JSON.stringify(response.inbox))
    }

    return new Response(JSON.stringify(null))

}