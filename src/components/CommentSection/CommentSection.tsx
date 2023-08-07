import React from 'react'
import "./CommentSection.css"
import { useState, useEffect } from 'react'
import { CommentInterface } from '@/lib/mongo/models/CommentModel'
import { useSession } from 'next-auth/react'
interface Props {
    taskId: string
}

export default function CommentSection({ taskId }: Props) {

    const [currentComment, setCurrentComment] = useState<string>("")
    const [commentList, setCommentList] = useState<CommentInterface[]>([])

    const session = useSession()
    const userName = session.data?.user.name
    const userEmail = session.data?.user.email
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!taskId || !currentComment) {
            return;
        }

        const commentBody: CommentInterface = {
            creator: userName!,
            dateCreated: new Date(),
            taskId,
            message: currentComment
        }
        const commentResponse = await fetch("http://localhost:3000/api/comments/createNewComment", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(commentBody),
        })

        const commentResponseJSON = await commentResponse.json()
        if (!commentResponseJSON) {
            //throw error  
        }
        const tmpComments = [...commentList]
        tmpComments.push(commentResponseJSON)
        setCommentList(tmpComments)
        setCurrentComment("")
    }

    useEffect(() => {
        const fetchComments = async () => {
            if (!taskId) {
                return;
            }

            const fetchCommentBody = {
                taskId
            }
            const fetchCommentResponse = await fetch("http://localhost:3000/api/comments/fetchComments", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(fetchCommentBody),
            })

            const fetchCommentResponseJSON = await fetchCommentResponse.json()

            //check for empty array
            if (!fetchCommentResponseJSON) {
                //throw error
            }
            setCommentList(fetchCommentResponseJSON)

        }
        fetchComments()
    }, [taskId])
    return (
        <div className="cs__wrapper">
            <div className="cs__header">
                Comments
            </div>
            <div className="comments__list">
                {commentList.map(comment => {
                    return (
                        <div key={comment._id}>
                            <div>
                                <div>
                                    {comment.creator}
                                </div>
                                <div>
                                    {comment.dateCreated.toString()}
                                </div>
                            </div>
                            <div>
                                {comment.message}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div>
                <form onSubmit={handleSubmit}>
                    <input
                        value={currentComment}
                        onChange={(e) => setCurrentComment(e.target.value)}
                        placeholder="Add comment here..."
                    />
                    <button type="submit">
                        Add Comment
                    </button>
                </form>
            </div>
        </div>
    )
}
