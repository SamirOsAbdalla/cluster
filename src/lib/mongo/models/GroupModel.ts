import { Schema, model, connect, models } from 'mongoose';
import { UserInterface, userSchema } from './UserModel';
import { FcDataEncryption } from 'react-icons/fc';




export interface MemberInterface {
    memberEmail: string;
    memberName: string;
    profilePicture?: string
}

export const memberSchema = new Schema<MemberInterface>({
    memberEmail: { type: String, required: true },
    memberName: { type: String, required: true },
    profilePicture: { type: String, required: false, default: "" }
})


export interface GroupInterface {
    _id?: string;
    name: string;
    creator: MemberInterface;
    description: string;
    members: MemberInterface[];
    dateCreated: Date;
}

const groupSchema = new Schema<GroupInterface>({
    name: { type: String, required: true },
    creator: memberSchema,
    description: { type: String, required: true },
    members: [memberSchema],
    dateCreated: { type: Date, default: new Date() },
})

const GroupModel = models.Group || model<GroupInterface>("Group", groupSchema)
export default GroupModel