import React from 'react'
import "./CommentSection.css"
import { useState, useEffect } from 'react'
import { CommentInterface } from '@/lib/mongo/models/CommentModel'
import { useSession } from 'next-auth/react'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import CommentInput from './CommentInput'
import Comment from './Comment'


interface Props {
    taskId: string
}

const useComment = (taskId: string) => {
    const [currentComment, setCurrentComment] = useState<string>("")
    const [commentList, setCommentList] = useState<CommentInterface[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchComments = async () => {
            if (!taskId) {
                return;
            }

            const fetchCommentBody = {
                taskId
            }
            const fetchCommentResponse = await fetch("/api/comments/fetchComments", {
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

    return {
        currentComment,
        setCurrentComment,
        loading,
        setLoading,
        commentList,
        setCommentList
    }
}
export default function CommentSection({ taskId }: Props) {

    let {
        currentComment,
        setCurrentComment,
        loading,
        setLoading,
        commentList,
        setCommentList
    } = useComment(taskId)

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
        const commentResponse = await fetch("/api/comments/createNewComment", {
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






    return (
        <div className="cs__wrapper">
            <div className="cs__header">
                Comments
            </div>
            {commentList.length > 0 &&
                <div className="comments__list">
                    {commentList.map((comment) => {
                        return (
                            <Comment
                                key={comment._id}
                                comment={comment}
                            />
                        )
                    })}
                </div>
            }
            <CommentInput
                loading={loading}
                currentComment={currentComment}
                setCurrentComment={setCurrentComment}
                handleSubmit={handleSubmit}
            />
        </div>
    )
}
