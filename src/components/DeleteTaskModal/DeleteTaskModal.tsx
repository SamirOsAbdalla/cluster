import "./DeleteTaskModal.css"
import { AiFillCloseCircle } from "react-icons/ai";

import React, { Dispatch, SetStateAction, useState } from 'react'
import { TaskInterface } from "@/lib/mongo/models/TaskModel";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
interface Props {
    taskName: string
    taskId?: string
    tasks: TaskInterface[]
    setTasks: Dispatch<SetStateAction<TaskInterface[]>>
    setDeleteTaskModalStatus: Dispatch<SetStateAction<"open" | "closed">>
    setCurrentPage: Dispatch<SetStateAction<number>>,
    tasksPerPage: number
    currentPage: number
}
export default function DeleteTaskModal({ currentPage, tasksPerPage, setCurrentPage, taskName, taskId, setDeleteTaskModalStatus, tasks, setTasks }: Props) {

    const [loading, setLoading] = useState<boolean>(false)

    const setButtonsDisabled = () => {
        const confirmButton = document.querySelector(".dt__confirm") as HTMLButtonElement
        const cancelButton = document.querySelector(".dt__cancel") as HTMLButtonElement
        confirmButton.disabled = true
        cancelButton.disabled = true
    }
    const deleteTask = async () => {
        //make api call to backend to delete task
        if (!taskId) {
            return;
        }
        setButtonsDisabled()
        setLoading(true)
        const deleteTaskBody = {
            taskId: taskId!
        }

        const deleteTaskResponse = await fetch("/api/tasks/deleteTask", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(deleteTaskBody),
        })

        const deleteTaskResponseJSON = await deleteTaskResponse.json()
        if (!deleteTaskResponseJSON) {
            //throw error
        }
        const filteredTasks = tasks.filter(task => task._id != taskId)
        if (filteredTasks.length % tasksPerPage == 0 && filteredTasks.length > 1 && currentPage != 1) {
            setCurrentPage((prevState) => prevState - 1)
        }
        setTasks(filteredTasks)
        setDeleteTaskModalStatus("closed")
        setLoading(false)
    }

    const closeModal = () => {
        setDeleteTaskModalStatus("closed")
    }
    return (
        <ModalWrapper closeModal={closeModal}>
            <div className="modal">
                <AiFillCloseCircle onClick={() => setDeleteTaskModalStatus("closed")} className="dt__close" />
                <div className="dt__heading">
                    Are you sure you want to delete <span>{taskName} </span>
                </div>
                <div className="dt__buttons">
                    <button onClick={deleteTask} className="dt__button dt__confirm blue__button">
                        {loading ? <LoadingSpinner type="button" /> : "Confirm"}
                    </button>
                    <button onClick={() => setDeleteTaskModalStatus("closed")} className="dt__cancel dt__button cancel">
                        Cancel
                    </button>
                </div>
            </div>
        </ModalWrapper>

    )
}
