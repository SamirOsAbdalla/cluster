import { Schema, model, models } from 'mongoose';

export interface InboxItemInterface {
    _id?: string;
    groupName: string;
    senderEmail: string;
    senderName: string;
    groupId: string;
}
export interface InboxInterface {
    userEmail: string;
    inboxItems: InboxItemInterface[];
    _id?: string
}

const inboxItemSchema = new Schema<InboxItemInterface>({
    groupName: { type: String, required: true },
    groupId: { type: String, required: true },
    senderEmail: { type: String, required: true },
    senderName: { type: String, required: true },
})
const inboxSchema = new Schema<InboxInterface>({
    inboxItems: [inboxItemSchema],
    userEmail: { type: String, required: true },
})

const InboxModel = models.Inbox || model<InboxInterface>("Inbox", inboxSchema)
export default InboxModel