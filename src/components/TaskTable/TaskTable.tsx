"use client"
import "./TaskTable.css"
import React from 'react'
import { useState } from "react"
import NewTaskModal from "../NewTaskModal/NewTaskModal"

interface Props {
    groupId: string
}
export default function TaskTable({ groupId }: Props) {
    const [newTaskModalStatus, setNewTaskModalStatus] = useState<"open" | "closed">("closed")
    return (
        <main className="tasktable__wrapper">
            <section className="tasktable__header">
                <h1>Tasks</h1>
                <button onClick={() => setNewTaskModalStatus("open")}>New Task</button>
            </section>
            {newTaskModalStatus == "open" &&
                <NewTaskModal
                    setNewTaskModalStatus={setNewTaskModalStatus}
                    groupId={groupId}
                />
            }
            <section className="tasktable__body">
                <table className="tasktable__table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th className="tasktable__expand">Description</th>
                            <th>Creator</th>
                            <th>Priority</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-cell="name: ">Test Task</td>
                            <td data-cell="description: ">This is a test task</td>
                            <td data-cell="creator: ">Testo</td>
                            <td>
                                <button>
                                    Urgent
                                </button>
                            </td>
                            <td>
                                <button>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </main>
    )
}
