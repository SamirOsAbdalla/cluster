"use client"

import React, { Dispatch, SetStateAction } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import "./GroupTable.css"
import { BsFillTrashFill, BsFillGearFill } from 'react-icons/bs'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import NewGroupModal from '../NewGroupModal/NewGroupModal'
import { GroupInterface } from '@/lib/mongo/models/GroupModel'
import { TaskInterface } from '@/lib/mongo/models/TaskModel'
import { MemberInterface } from '@/lib/mongo/models/GroupModel'
import { CommentInterface } from '@/lib/mongo/models/CommentModel'

import GroupDetailModal from '../GroupDetailModal/GroupDetailModal'
import LeaveGroupModal from '../LeaveGroupModal/LeaveGroupModal'
import TablePagination from '../TablePagination/TablePagination'
import LoadingGroup from '../LoadingGroup/LoadingGroup'
import EmptyPage from '../EmptyPage/EmptyPage'
import EditGroupModal from '../EditGroupModal/EditGroupModal'
interface Props {
    loading: boolean
    setLoading: Dispatch<SetStateAction<boolean>>
    setFetchGroup: Dispatch<SetStateAction<boolean>>
}
export default function GroupTable({ setLoading, loading, setFetchGroup }: Props) {
    const data = useSession()
    const router = useRouter()
    const creatorEmail = data?.data?.user.email
    const creatorName = data?.data?.user.name



    //refactor to maybe use enums for state instead of bool
    const [modalOpen, setModalOpen] = useState(false)
    const [groups, setGroups] = useState<GroupInterface[]>([])
    const [currentGroupModal, setCurrentGroupModal] = useState<GroupInterface | null>(null)
    const [leaveGroupModal, setLeaveGroupModal] = useState<boolean>(false)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [editGroupModalStatus, setEditGroupModalStatus] = useState<"open" | "closed">("closed")
    const groupsPerPage = 3;
    const totalNumberOfPages = Math.ceil(groups.length / groupsPerPage)
    const lastIndex = currentPage * groupsPerPage;
    const firstIndex = lastIndex - groupsPerPage
    const displayedGroups = groups.slice(firstIndex, lastIndex)

    const fetchGroups = async () => {
        if (!creatorEmail || !creatorName) {
            return;
        }

        let currentCreator: Omit<MemberInterface, "profilePicture"> = {
            memberEmail: creatorEmail,
            memberName: creatorName
        }
        const resp = await fetch("http://localhost:3000/api/groups/findGroups", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(currentCreator),
        });
        //check for empty groups
        const finalData = await resp.json()
        setGroups(finalData)
        if (finalData.length != 0) {
            setFetchGroup(true)
        }
        setLoading(false)
    }

    const tmp = async () => {
        await fetchGroups()
    }
    useEffect(() => {

        tmp()
    }, [creatorName, creatorEmail])
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
    //account for event bubbling in click
    const navigateToGroupsPage = (gId: string) => {

        router.push(`/groups/${gId}`)
    }

    return (
        <>
            {!loading && <div className="table__wrapper">
                {modalOpen && <NewGroupModal
                    currentPage={currentPage}
                    groupsPerPage={groupsPerPage}
                    setCurrentPage={setCurrentPage}
                    groups={groups}
                    setGroups={setGroups}
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                />}
                {leaveGroupModal && <LeaveGroupModal
                    groupsPerPage={groupsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    groups={groups}
                    setGroups={setGroups}
                    leaveGroupModal={leaveGroupModal}
                    setLeaveGroupModal={setLeaveGroupModal}
                    currentGroup={currentGroupModal}
                />}
                {editGroupModalStatus == "open" &&
                    <EditGroupModal
                        editGroupModalStatus={editGroupModalStatus}
                        setEditGroupModalStatus={setEditGroupModalStatus}
                        currentGroup={currentGroupModal}
                        groups={groups}
                        setGroups={setGroups}
                    />}

                {groups.length > 0 &&
                    <>
                        <div className="group__heading">
                            <h1>My Groups</h1>
                            <button className="new__group__button" onClick={(e) => {
                                const modalStatus = modalOpen
                                setModalOpen(!modalStatus)
                                setLeaveGroupModal(false)
                            }}>
                                <AiOutlinePlusCircle />
                                <span>New Group</span>
                            </button>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="th__left">Name</th>
                                    <th className="expand">Description</th>
                                    <th>Creator</th>
                                    <th className="th__right"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    displayedGroups.map((group: GroupInterface) => (
                                        <React.Fragment key={group._id}>
                                            <tr onClick={() => navigateToGroupsPage(group._id as string)}>
                                                <td data-cell="NAME ">{group.name}</td>
                                                <td data-cell="DESCRIPTION " className="description__cell">{group.description}</td>
                                                <td data-cell="CREATOR ">{group.creator.memberName}</td>
                                                <td >
                                                    <span className="action__cell td__right">
                                                        <button data-testid="grouptable__leave" onClick={(e) => handleLeaveClick(group, e)} className=" grouptable__leave action__button">
                                                            Leave
                                                        </button>
                                                        {creatorEmail == group.creator.memberEmail &&
                                                            <button className="action__button grouptable__edit" onClick={(e) => handleEditClick(group, e)}>
                                                                Edit
                                                            </button>
                                                        }

                                                    </span>
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    ))
                                }
                            </tbody>
                        </table>

                        <TablePagination
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalNumberOfPages={totalNumberOfPages}
                        />
                    </>}
                {groups.length == 0 &&
                    <div className="emptygroup__table">
                        <EmptyPage type="group" />
                        <button className="new__group__button" onClick={(e) => {
                            const modalStatus = modalOpen
                            setModalOpen(!modalStatus)

                        }}>
                            <AiOutlinePlusCircle />
                            <span>New Group</span>
                        </button>
                    </div>
                }
            </div>}
        </>

    )
}
