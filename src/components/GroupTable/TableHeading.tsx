import React, { Dispatch, SetStateAction } from 'react'
import { AiOutlinePlusCircle } from 'react-icons/ai'

interface Props {
    modalOpen: boolean,
    setModalOpen: Dispatch<SetStateAction<any>>
    setEditGroupModalStatus: Dispatch<SetStateAction<"open" | "closed">>
    setLeaveGroupModal: Dispatch<SetStateAction<boolean>>
}

export default function TableHeading({
    modalOpen,
    setModalOpen,
    setEditGroupModalStatus,
    setLeaveGroupModal
}: Props) {
    return (
        <div className="table__heading">
            <h1>Groups</h1>
            <button className="new__group__button" onClick={(e) => {
                const modalStatus = modalOpen
                setModalOpen(!modalStatus)
                setEditGroupModalStatus("closed")
                setLeaveGroupModal(false)
            }}>
                <AiOutlinePlusCircle />
                <span>New Group</span>
            </button>
        </div>
    )
}
