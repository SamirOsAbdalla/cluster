import React, { Dispatch, SetStateAction } from 'react'
import "./DisplayedTask.css"
import { TaskInterface } from '@/lib/mongo/models/TaskModel'
import { AiFillCloseCircle, AiOutlineCloseCircle } from 'react-icons/ai'
import CommentSection from '../CommentSection/CommentSection'
interface Props {
    task: TaskInterface,
    setDisplayedTask: Dispatch<SetStateAction<TaskInterface>>
}
export default function DisplayedTask({ task, setDisplayedTask }: Props) {
    return (
        <div className="dt__wrapper">
            <div className="dt__header">
                Task Info
            </div>
            <AiFillCloseCircle onClick={() => setDisplayedTask({} as TaskInterface)} />
            <div className="dt__main">
                <div className='dt__information'>
                    <div className="dt__cell">
                        <div>
                            Name
                        </div>

                        <div>
                            {task.name}
                        </div>
                    </div>
                    <div className="dt__cell">
                        <div>
                            Description
                        </div>
                        <div>
                            {task.description}
                        </div>
                    </div>
                    <div className="dt__cell">
                        <div>
                            Creator
                        </div>
                        <div>
                            {task.creator.memberName}
                        </div>
                    </div>
                    <div className="dt__cell">
                        <div>
                            Date Created
                        </div>
                        <div>
                            {task.dateCreated.toString()}
                        </div>
                    </div>
                    <div className="dt__cell">
                        <div>
                            Priority
                        </div>
                        <button>
                            {task.priority}
                        </button>
                    </div>
                    <div className="dt__cell">
                        <div>
                            Status
                        </div>
                        <div>
                            {task.status}
                        </div>
                    </div>
                </div>
                <CommentSection
                    taskId={task._id!} />
            </div>

        </div>
    )
}
