import { TaskPriority } from "@/lib/mongo/models/TaskModel"
import "./TaskPriorityButtons.css"
import React, { Dispatch, SetStateAction } from 'react'

interface Props {
    setTaskPriority: Dispatch<SetStateAction<TaskPriority>>
}
export default function TaskPriorityButtons({ setTaskPriority }: Props) {
    return (
        <div className="tpbuttons__wrapper">
            <button onClick={() => setTaskPriority("Low")} type="button" className="newtask__button tpbuttons__button tpbuttons__low">
                Low
            </button>
            <button onClick={() => setTaskPriority("Medium")} type="button" className="newtask__button tpbuttons__button tpbuttons__medium">
                Medium
            </button>
            <button onClick={() => setTaskPriority("High")} type="button" className="newtask__button tpbuttons__button tpbuttons__high">
                High
            </button>
            <button onClick={() => setTaskPriority("Urgent")} type="button" className="newtask__button tpbuttons__button tpbuttons__urgent">
                Urgent
            </button>
        </div>
    )
}
