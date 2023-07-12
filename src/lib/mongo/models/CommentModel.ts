import { Schema, model, connect, models } from 'mongoose';
export interface CommentInterface {
    message: string;
    creator: string;
    dateCreated: Date;
    taskId: string;
    _id?: string
}

const commentSchema = new Schema<CommentInterface>({
    message: { type: String, required: true },
    creator: { type: String, required: true },
    taskId: { type: String, required: true },
    dateCreated: { type: Date, default: new Date() }
})

const CommentModel = models.Comment || model<CommentInterface>("Comment", commentSchema)
export default CommentModel
