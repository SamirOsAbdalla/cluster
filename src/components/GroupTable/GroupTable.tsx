"use client"

import React from 'react'
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
export default function GroupTable() {
    const data = useSession()
    const router = useRouter()
    const creatorEmail = data?.data?.user.email
    const creatorName = data?.data?.user.name
    useEffect(() => {
        if (!creatorEmail || !creatorName) {
            return;
        }
        const fetchGroups = async () => {


            let currentCreator: MemberInterface = {
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

            const finalData = await resp.json()
            setGroups(finalData)
            setLoading(false)
        }

        fetchGroups()
    }, [creatorName])


    //refactor to maybe use enums for state instead of bool
    const [modalOpen, setModalOpen] = useState(false)
    const [groups, setGroups] = useState<GroupInterface[]>([])
    const [currentGroupModal, setCurrentGroupModal] = useState<GroupInterface | null>(null)
    const [leaveGroupModal, setLeaveGroupModal] = useState<boolean>(false)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(true)
    const groupsPerPage = 5;
    const totalNumberOfPages = Math.ceil(groups.length / groupsPerPage)
    const lastIndex = currentPage * groupsPerPage;
    const firstIndex = lastIndex - groupsPerPage
    const displayedGroups = groups.slice(firstIndex, lastIndex)


    const handleLeaveClick = (group: GroupInterface, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation()
        setModalOpen(false)
        if (currentGroupModal && !(group._id == currentGroupModal._id)) {
            setLeaveGroupModal(true)
            setCurrentGroupModal(group)
        } else if (currentGroupModal && (group._id == currentGroupModal._id)) {
            if (leaveGroupModal) {
                setLeaveGroupModal(false)
            } else {
                setLeaveGroupModal(true)
            }
        } else {
            setCurrentGroupModal(group)
            setLeaveGroupModal(true)
        }
    }

    //account for event bubbling in click
    const navigateToGroupsPage = (pId: string) => {

        router.push(`/groups/${pId}`)
    }
    return (
        <div className="table__wrapper">

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
                currentGroup={currentGroupModal} />}

            {loading && <LoadingGroup />}
            {!loading && groups.length > 0 &&
                <>
                    <div className="group__heading">
                        <h1>My Groups</h1>
                        <button className="new__group__button" onClick={(e) => {
                            const modalStatus = modalOpen
                            setModalOpen(!modalStatus)

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
                                    <React.Fragment key={group.dateCreated as any}>
                                        <tr onClick={() => navigateToGroupsPage(group._id as string)}>
                                            <td data-cell="name: ">{group.name}</td>
                                            <td data-cell="description: " className="description__cell">{group.description}</td>
                                            <td data-cell="creator: ">{group.creator.memberName}</td>
                                            <td >
                                                <span className="action__cell td__right">
                                                    <button data-testid="grouptable__leave" onClick={(e) => handleLeaveClick(group, e)} className="action__logo">
                                                        Leave
                                                    </button>

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
            {!loading && groups.length == 0 &&
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
        </div>
    )
}
