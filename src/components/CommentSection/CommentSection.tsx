import React from 'react'
import "./CommentSection.css"
import { useState, useEffect } from 'react'
import { CommentInterface } from '@/lib/mongo/models/CommentModel'
import { useSession } from 'next-auth/react'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
interface Props {
    taskId: string
}

export default function CommentSection({ taskId }: Props) {

    const [currentComment, setCurrentComment] = useState<string>("")
    const [commentList, setCommentList] = useState<CommentInterface[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const session = useSession()
    const userName = session.data?.user.name
    const userEmail = session.data?.user.email

    const setButtonsDisabled = () => {
        const addButton = document.querySelector(".csform__add") as HTMLButtonElement
        addButton.disabled = true;
    }

    const setButtonsEnabled = () => {
        const addButton = document.querySelector(".csform__add") as HTMLButtonElement
        addButton.disabled = false;
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!taskId || !currentComment) {
            return;
        }
        setButtonsDisabled()
        setLoading(true)
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
        setButtonsEnabled()
        setLoading(false)
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
            {commentList.length > 0 && <div className="comments__list">
                {commentList.map(comment => {
                    return (
                        <div className="comment" key={comment._id}>
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
                })}
            </div>}
            <div className="cs__form__wrapper">
                <form onSubmit={handleSubmit}>
                    <input
                        value={currentComment}
                        onChange={(e) => setCurrentComment(e.target.value)}
                        placeholder="Add comment here..."
                        className="csform__input"
                    />
                    <button className="csform__add" type="submit">
                        {loading ? <LoadingSpinner type="button" /> : "Add Comment"}
                    </button>
                </form>
            </div>
        </div>
    )
}
