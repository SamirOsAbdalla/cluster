"use client"
import { GroupInterface } from '@/lib/mongo/models/GroupModel'
import React, { Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
    group: GroupInterface,
    creatorEmail?: string,
    setModalOpen: Dispatch<SetStateAction<any>>,
    setCurrentGroupModal: Dispatch<SetStateAction<GroupInterface | null>>,
    setLeaveGroupModal: Dispatch<SetStateAction<boolean>>,
    setEditGroupModalStatus: Dispatch<SetStateAction<"open" | "closed">>
}
export default function TableBody({
    group,
    creatorEmail,
    setModalOpen,
    setCurrentGroupModal,
    setEditGroupModalStatus,
    setLeaveGroupModal
}: Props) {

    const router = useRouter()

    //account for event bubbling in click
    const navigateToGroupsPage = (gId: string) => {

        router.push(`/groups/${gId}`)
    }
    const handleLeaveClick = (group: GroupInterface, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation()
        setModalOpen(false)
        setCurrentGroupModal(group)
        setEditGroupModalStatus("closed")
        setLeaveGroupModal(true)

    }
    const handleEditClick = (group: GroupInterface, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation()
        setModalOpen(false)
        setCurrentGroupModal(group)
        setLeaveGroupModal(false)
        setEditGroupModalStatus("open")
    }

    return (
        <React.Fragment>
            <tr onClick={() => navigateToGroupsPage(group._id as string)}>
                <td className="name__cell" data-cell="NAME ">{group.name}</td>
                <td data-cell="DESCRIPTION " className="description__cell">{group.description}</td>
                <td className="creator__cell" data-cell="CREATOR ">{group.creator.memberName}</td>
                <td className="action__td">
                    <span className="action__cell td__right">
                        <button data-testid="grouptable__leave" onClick={(e) => handleLeaveClick(group, e)} className=" grouptable__leave action__button">
                            Leave
                        </button>
                        {creatorEmail == group.creator.memberEmail &&
                            <button className="blue__button action__button grouptable__edit" onClick={(e) => handleEditClick(group, e)}>
                                Edit
                            </button>
                        }

                    </span>
                </td>
            </tr>
        </React.Fragment>
    )
}
