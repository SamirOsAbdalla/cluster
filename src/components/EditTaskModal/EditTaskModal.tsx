import { TaskInterface } from "@/lib/mongo/models/TaskModel"
import "./EditTaskModal.css"
import { Dispatch, SetStateAction } from "react"

interface Props {
    tasks: TaskInterface[]
    setTasks: Dispatch<SetStateAction<TaskInterface[]>>
    currentTask: TaskInterface
    taskEditModalStatus: Dispatch<SetStateAction<"open" | "closed">>

}

export default function EditTaskModal({ tasks, setTasks, currentTask, taskEditModalStatus }: Props) {
    return (
        <div className="etmodal__wrapper">

        </div>
    )
}
