import React, { Dispatch, SetStateAction } from 'react'
import "./DisplayedTask.css"
import { TaskInterface } from '@/lib/mongo/models/TaskModel'
import { AiFillCloseCircle, AiOutlineCloseCircle } from 'react-icons/ai'
import TaskBody from './TaskBody'

interface Props {
    task: TaskInterface,
    setDisplayedTask: Dispatch<SetStateAction<TaskInterface>>
}
export default function DisplayedTask({ task, setDisplayedTask }: Props) {
    return (
        <div className="dt__wrapper">
            <div data-testid="displaytask__header" className="displaytask__header">
                <span>Task Info</span>
                <AiFillCloseCircle className="displaytask__close" onClick={() => setDisplayedTask({} as TaskInterface)} />
            </div>
            <TaskBody
                task={task}
            />

        </div>
    )
}
