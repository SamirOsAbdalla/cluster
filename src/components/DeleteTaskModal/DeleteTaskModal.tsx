import "./DeleteTaskModal.css"
import { AiFillCloseCircle } from "react-icons/ai";

import React, { Dispatch, SetStateAction } from 'react'
import { TaskInterface } from "@/lib/mongo/models/TaskModel";

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

    const deleteTask = async () => {
        //make api call to backend to delete task
        if (!taskId) {
            return;
        }

        const deleteTaskBody = {
            taskId: taskId!
        }

        const deleteTaskResponse = await fetch("http://localhost:3000/api/tasks/deleteTask", {
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
    }

    return (
        <div className="dtmodal__wrapper">
            <AiFillCloseCircle onClick={() => setDeleteTaskModalStatus("closed")} className="dt__close" />
            <div className="dt__heading">
                Are you sure you want to delete {taskName}
            </div>
            <div className="dt__buttons">
                <button onClick={deleteTask} className="dt__button dt__confirm">
                    Confirm
                </button>
                <button onClick={() => setDeleteTaskModalStatus("closed")} className="dt__button dt__cancel">
                    Cancel
                </button>
            </div>
        </div>
    )
}
