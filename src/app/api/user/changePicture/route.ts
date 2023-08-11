import { db } from "@/lib/mongo/util/connectMongo";
import UserModel from "@/lib/mongo/models/UserModel";
import GroupModel from "@/lib/mongo/models/GroupModel";
import cloudinary from "@/lib/mongo/util/cloudinary";

export async function POST(request: Request) {
    await db.connect()

    let { memberEmail, newPicture } = await request.json()

    try {
        const imageUploadResult = await cloudinary.uploader.upload(newPicture, {
            folder: "profilePictures"
        })
        const updatedPicture = {
            public_id: imageUploadResult.public_id,
            url: imageUploadResult.secure_url
        }
        const resp = await UserModel.findOneAndUpdate({ email: memberEmail }, {
            picture: updatedPicture
        })

        const resp2 = await GroupModel.updateMany(
            {},
            {
                $set: {
                    "members.$[element].profilePicture": updatedPicture
                }
            },
            {
                "arrayFilters": [
                    {
                        "element.memberEmail": memberEmail
                    }
                ]
            })

        return new Response(JSON.stringify(resp.picture))
    } catch (error: unknown) {
        return new Response(JSON.stringify(null))
    }
}