"use client"
import { TaskInterface } from "@/lib/mongo/models/TaskModel"
import "./CompleteTaskModal.css"
import {
    Dispatch,
    SetStateAction,
    useState
} from "react"
import { AiFillCloseCircle } from "react-icons/ai"
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner"
import ModalWrapper from "../ModalWrapper/ModalWrapper"

interface Props {
    tasks: TaskInterface[],
    setTasks: Dispatch<SetStateAction<TaskInterface[]>>
    setCompleteTaskModalStatus: Dispatch<SetStateAction<"open" | "closed">>
    taskInfo: { taskName: string, taskId: string },
    memberEmail?: string
}

export default function CompleteTaskModal({
    tasks,
    setTasks,
    taskInfo,
    memberEmail,
    setCompleteTaskModalStatus
}: Props) {

    const [loading, setLoading] = useState<boolean>(false)
    const setButtonsDisabled = () => {
        const confirmButton = document.querySelector(".confirm__ct") as HTMLButtonElement
        const cancelButton = document.querySelector(".cancel__ct") as HTMLButtonElement
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

        const taskMemberStatusResponse = await fetch("/api/tasks/changeTaskMemberStatus", {
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

    const closeModal = () => {
        setCompleteTaskModalStatus("closed")
    }

    return (
        <ModalWrapper closeModal={closeModal}>
            <div className="modal">
                <AiFillCloseCircle className="ctmodal__close" onClick={() => setCompleteTaskModalStatus("closed")} />
                <div className="ctmodal__heading">
                    Are you sure <span>{taskInfo.taskName}</span> is completed?
                </div>
                <div className="ctmodal__buttons">
                    <button className="blue__button confirm__ct" onClick={() => updateTaskMemberStatus(taskInfo.taskId)}>
                        {loading ? <LoadingSpinner type="button" /> : "Confirm"}
                    </button>
                    <button className="cancel__ct" onClick={() => setCompleteTaskModalStatus("closed")}>
                        Cancel
                    </button>
                </div>
            </div>
        </ModalWrapper>

    )
}
