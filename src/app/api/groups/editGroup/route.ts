import { db } from "@/lib/mongo/util/connectMongo";
import GroupModel from "@/lib/mongo/models/GroupModel";
import mongoose from "mongoose";
import TaskModel from "@/lib/mongo/models/TaskModel";

interface RequestBody {
    oldName?: string;
    groupId: string;
    didNameChange: boolean
    didDescriptionChange: boolean
    newName: string;
    newDescription: string
}

export async function POST(request: Request) {
    await db.connect()
    const { groupId, didNameChange, didDescriptionChange, newName, newDescription, oldName } = await request.json()
    const id = new mongoose.Types.ObjectId(groupId)
    let response;
    if (didNameChange && didDescriptionChange) {
        response = await GroupModel.findOneAndUpdate({ _id: id }, { name: newName, description: newDescription })
    } else if (didNameChange) {
        response = await GroupModel.findOneAndUpdate({ _id: id }, { name: newName })

    } else if (didDescriptionChange) {
        response = await GroupModel.findOneAndUpdate({ _id: id }, { description: newDescription })
    }

    if (response) {
        if (oldName) {
            let taskResponse = await TaskModel.updateMany(
                { groupName: oldName },
                { groupName: newName }
            )
        }
        return new Response(JSON.stringify(response))
    } else {
        return new Response(JSON.stringify(null))
    }
}