import InboxModel, { InboxInterface } from "@/lib/mongo/models/InboxModel"
interface RequestBody {
    userEmail: string
}

export async function POST(request: Request) {
    const body: RequestBody = await request.json()

    const email = body.userEmail
    const response: InboxInterface | null = await InboxModel.findOne({ userEmail: email })

    if (response) {
        return new Response(JSON.stringify(response as InboxInterface))
    }

    return new Response(JSON.stringify(null))

}