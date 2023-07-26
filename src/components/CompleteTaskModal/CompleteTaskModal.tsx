"use client"
import { TaskInterface } from "@/lib/mongo/models/TaskModel"
import "./CompleteTaskModal.css"
import { Dispatch, SetStateAction } from "react"
import { AiFillCloseCircle } from "react-icons/ai"
interface Props {
    tasks: TaskInterface[],
    setTasks: Dispatch<SetStateAction<TaskInterface[]>>
    setCompleteTaskModalStatus: Dispatch<SetStateAction<"open" | "closed">>
    taskInfo: { taskName: string, taskId: string },
    memberEmail?: string
}

export default function CompleteTaskModal({ tasks, setTasks, taskInfo, memberEmail, setCompleteTaskModalStatus }: Props) {
    const updateTaskMemberStatus = async (taskId: string) => {
        if (!memberEmail || !taskId) {
            return;
        }

        const taskMemberStatusBody = {
            taskId,
            memberEmail
        }

        const taskMemberStatusResponse = await fetch("http://localhost:3000/api/tasks/changeTaskMemberStatus", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskMemberStatusBody),
        })

        const taskMemberStatusResponseJSON = await taskMemberStatusResponse.json()
        if (!taskMemberStatusResponseJSON) {
            //throw error
        }

        const taskIndex = tasks.findIndex(task => task._id == taskId)
        if (taskIndex != -1) {

            const taskMemberIndex = tasks[taskIndex].members.findIndex(member => member.memberEmail == memberEmail)
            if (taskMemberIndex != -1) {
                let tempTasks = [...tasks]
                tempTasks[taskIndex].members[taskMemberIndex].status = "Resolved"
                setCompleteTaskModalStatus('closed')
                setTasks(tempTasks)
            }
        }
    }

    return (
        <div className="ctmodal__wrapper">
            <AiFillCloseCircle onClick={() => setCompleteTaskModalStatus("closed")} />
            <div>
                Are you sure {taskInfo.taskName} is completed?
            </div>
            <div>
                <button onClick={() => updateTaskMemberStatus(taskInfo.taskId)}>
                    Confirm
                </button>
                <button onClick={() => setCompleteTaskModalStatus("closed")}>
                    Cancel
                </button>
            </div>
        </div>
    )
}
