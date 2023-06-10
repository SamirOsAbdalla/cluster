import { Schema, model, connect } from 'mongoose';

interface InboxInterface {
    message: string;
    projectName: string;
    sender: string;
}

const inboxSchema = new Schema<InboxInterface>({
    message: { type: String, required: true },
    projectName: { type: String, required: true },
    sender: { type: String, required: true }
})

export interface UserInterface {
    name: string;
    email: string;
    password: string;
    picture: string;
    inbox?: InboxInterface[]
}

export const userSchema = new Schema<UserInterface>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    picture: { type: String, required: false },
    inbox: { type: inboxSchema }
})

//add password validation
export const UserModel = model<UserInterface>("User", userSchema)