import { TaskInterface } from '@/lib/mongo/models/TaskModel'
import React from 'react'
import CommentSection from '../CommentSection/CommentSection'
import DisplayCell from './DisplayCell'
interface Props {
    task: TaskInterface
}
export default function TaskBody({
    task
}: Props) {
    return (
        <div className="dt__main">

            <div className="displaytask__bottom">
                <div className='dt__information'>
                    <DisplayCell
                        headerText="Name"
                    >
                        <div className="dt__cell__info">
                            {task.name}
                        </div>
                    </DisplayCell>

                    <DisplayCell
                        headerText='Description'
                    >
                        <div className="dt__cell__info">
                            {task.description}
                        </div>
                    </DisplayCell>

                    <DisplayCell
                        headerText='Creator'
                    >
                        <div className="dt__cell__info">
                            {task.creator.memberName}
                        </div>
                    </DisplayCell>
                    <DisplayCell
                        headerText='Date Created'
                    >
                        <div>
                            {new Intl.DateTimeFormat("en-US", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit"
                            }).format(new Date(task.dateCreated.toString()))
                            }
                        </div>
                    </DisplayCell>
                    <DisplayCell
                        headerText='Priority'
                    >
                        <button className={`${(task.priority as string)}__button taskitem__button`}>
                            {task.priority}
                        </button>
                    </DisplayCell>
                    <DisplayCell
                        headerText='Status'
                    >
                        <div>
                            {task.status}
                        </div>
                    </DisplayCell>

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
    )
}
