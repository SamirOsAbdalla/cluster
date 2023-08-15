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
            <div className="displaytask__header">
                Task Info
            </div>

            <div className="dt__main">
                <AiFillCloseCircle className="displaytask__close" onClick={() => setDisplayedTask({} as TaskInterface)} />
                <div className="displaytask__bottom">
                    <div className='dt__information'>
                        <div className="dt__cell">
                            <div className="dt__cell__header">
                                Name
                            </div>

                            <div className="dt__cell__info">
                                {task.name}
                            </div>
                        </div>
                        <div className="dt__cell">
                            <div className="dt__cell__header">
                                Description
                            </div>
                            <div className="dt__cell__info">
                                {task.description}
                            </div>
                        </div>
                        <div className="dt__cell">
                            <div className="dt__cell__header">
                                Creator
                            </div>
                            <div className="dt__cell__info">
                                {task.creator.memberName}
                            </div>
                        </div>
                        <div className="dt__cell">
                            <div className="dt__cell__header">
                                Date Created
                            </div>
                            <div>
                                {new Intl.DateTimeFormat("en-US", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit"
                                }).format(new Date(task.dateCreated.toString()))
                                }
                            </div>
                        </div>
                        <div className="dt__cell">
                            <div className="dt__cell__header">
                                Priority
                            </div>
                            <button className={`${(task.priority as string)}__button taskitem__button`}>
                                {task.priority}
                            </button>
                        </div>
                        <div className="dt__cell">
                            <div className="dt__cell__header">
                                Status
                            </div>
                            <div>
                                {task.status}
                            </div>
                        </div>
                        <div className="dt__cell dt__cell__members">
                            <div className="dt__cell__header">
                                Members
                            </div>
                            <div className="displaytask__member__list">
                                {task.members.map(member => {
                                    return (
                                        <div className="displaytask__member" key={member.memberEmail}>
                                            <div>{member.memberName}</div>
                                            <div>{member.status}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <CommentSection
                        taskId={task._id!}
                    />
                </div>

            </div>

        </div>
    )
}
