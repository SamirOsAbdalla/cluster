"use client"

import React from 'react'
import "./task.css"
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { TaskInterface } from '@/lib/mongo/models/TaskModel'
import TaskTable from '@/components/TaskTable/TaskTable'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import Header from '@/components/Header/Header'
export default function Tasks() {

    const session = useSession()
    const userEmail = session.data?.user.email

    const [tasks, setTasks] = useState<TaskInterface[]>([])

    return (
        <PageWrapper>
            <div className="taskpage__wrapper">
                <Header headerText='TASKS' />
                <div className="taskpage__table">
                    <TaskTable taskTableType="user" />
                </div>
            </div>
        </PageWrapper>

    )
}
