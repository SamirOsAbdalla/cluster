import { Schema, model, connect, models } from 'mongoose';
import { MemberInterface, memberSchema } from './GroupModel';

export type TaskPriority = "low" | "medium" | "high" | "urgent"
export interface TaskInterface {
    groupId: string;
    name: string;
    priority: TaskPriority
    description: string;
    creator: MemberInterface;
    dateCreated: Date;
    isUrgent: boolean;
    _id?: string
}
const taskSchema = new Schema<TaskInterface>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    creator: memberSchema,
    dateCreated: { type: Date, default: new Date() },
    isUrgent: { type: Boolean, default: false },
    priority: { type: String, required: true },
    groupId: { type: String, required: true },
})

const TaskModel = models.Task || model<TaskInterface>("Task", taskSchema)
export default TaskModel