import { Schema, model, connect, models } from 'mongoose';
import { MemberInterface, memberSchema } from './GroupModel';

export interface TaskInterface {
    projectId: string;
    name: string;
    description: string;
    creator: MemberInterface;
    dateCreated: Date;
    isUrgent: boolean;
    status: "Completed" | "In Progress";
    _id?: string
}
const taskSchema = new Schema<TaskInterface>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    creator: memberSchema,
    dateCreated: { type: Date, default: new Date() },
    isUrgent: { type: Boolean, default: false },
    status: { type: String, required: true },
    projectId: { type: String, required: true },
})

const TaskModel = models.Task || model<TaskInterface>("Task", taskSchema)
export default TaskModel