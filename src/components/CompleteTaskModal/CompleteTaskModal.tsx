"use client"
import { TaskInterface } from "@/lib/mongo/models/TaskModel"
import "./CompleteTaskModal.css"
import { Dispatch, SetStateAction, useState } from "react"
import { AiFillCloseCircle } from "react-icons/ai"
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner"
interface Props {
    tasks: TaskInterface[],
    setTasks: Dispatch<SetStateAction<TaskInterface[]>>
    setCompleteTaskModalStatus: Dispatch<SetStateAction<"open" | "closed">>
    taskInfo: { taskName: string, taskId: string },
    memberEmail?: string
}

export default function CompleteTaskModal({ tasks, setTasks, taskInfo, memberEmail, setCompleteTaskModalStatus }: Props) {
    const [loading, setLoading] = useState<boolean>(false)
    const setButtonsDisabled = () => {
        const confirmButton = document.querySelector(".ctmodal__confirm") as HTMLButtonElement
        const cancelButton = document.querySelector(".ctmodal__cancel") as HTMLButtonElement
        confirmButton.disabled = true
        cancelButton.disabled = true
    }
    const updateTaskMemberStatus = async (taskId: string) => {
        if (!memberEmail || !taskId) {
            return;
        }

        setButtonsDisabled()
        setLoading(true)
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
        setLoading(false)
    }

    return (
        <div className="ctmodal__wrapper">
            <AiFillCloseCircle className="ctmodal__close" onClick={() => setCompleteTaskModalStatus("closed")} />
            <div className="ctmodal__heading">
                Are you sure <span>{taskInfo.taskName}</span> is completed?
            </div>
            <div className="ctmodal__buttons">
                <button className="ctmodal__button ctmodal__confirm" onClick={() => updateTaskMemberStatus(taskInfo.taskId)}>
                    {loading ? <LoadingSpinner type="button" /> : "Confirm"}
                </button>
                <button className="ctmodal__button ctmodal__cancel" onClick={() => setCompleteTaskModalStatus("closed")}>
                    Cancel
                </button>
            </div>
        </div>
    )
}
