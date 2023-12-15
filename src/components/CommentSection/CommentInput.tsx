import React, { Dispatch, SetStateAction } from 'react'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { CommentInterface } from '@/lib/mongo/models/CommentModel'

interface Props {
    loading: boolean,
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => any,
    currentComment: string
    setCurrentComment: Dispatch<SetStateAction<string>>

}
export default function CommentInput({
    loading,
    handleSubmit,
    currentComment,
    setCurrentComment
}: Props) {
    return (
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
    )
}
