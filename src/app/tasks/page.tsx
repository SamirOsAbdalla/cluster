"use client"

import React from 'react'
import "./task.css"
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { TaskInterface } from '@/lib/mongo/models/TaskModel'
import TaskTable from '@/components/TaskTable/TaskTable'
export default function Tasks() {

    const session = useSession()
    const userEmail = session.data?.user.email

    const [tasks, setTasks] = useState<TaskInterface[]>([])

    return (
        <div className="taskpage__wrapper">
            <TaskTable taskTableType="user" />
        </div>
    )
}
