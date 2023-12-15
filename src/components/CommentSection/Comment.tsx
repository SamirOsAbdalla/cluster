import { CommentInterface } from '@/lib/mongo/models/CommentModel'
import React from 'react'

interface Props {
    comment: CommentInterface
}

export default function Comment({
    comment
}: Props) {
    return (
        <div className="comment">
            <div className="comment__top">
                <div className="comment__top__name">
                    {comment.creator}
                </div>
                <div>
                    {new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit"
                    }).format(new Date(comment.dateCreated.toString()))
                    }
                </div>
            </div>
            <div>
                {comment.message}
            </div>
        </div>
    )
}
