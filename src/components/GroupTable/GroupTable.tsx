"use client"

import React, { Dispatch, SetStateAction } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
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
import TableHeading from './TableHeading'
import TableBody from './TableBody'


interface Props {
    loading: boolean
    setLoading: Dispatch<SetStateAction<boolean>>
    setFetchGroup: Dispatch<SetStateAction<boolean>>
}

const useGroups = (loading: boolean, setLoading: Dispatch<SetStateAction<boolean>>, setFetchGroup: Dispatch<SetStateAction<boolean>>) => {
    const [groups, setGroups] = useState<GroupInterface[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)

    const data = useSession()
    const creatorEmail = data?.data?.user.email
    const creatorName = data?.data?.user.name

    const groupsPerPage = 3;
    const totalNumberOfPages = Math.ceil(groups.length / groupsPerPage)
    const lastIndex = currentPage * groupsPerPage;
    const firstIndex = lastIndex - groupsPerPage
    const displayedGroups = groups.slice(firstIndex, lastIndex)




    useEffect(() => {
        const fetchGroups = async () => {
            if (!creatorEmail || !creatorName) {
                return;
            }

            let currentCreator: Omit<MemberInterface, "profilePicture"> = {
                memberEmail: creatorEmail,
                memberName: creatorName
            }
            const resp = await fetch("/api/groups/findGroups", {
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
        fetchGroups()
    }, [creatorName, creatorEmail])

    useEffect(() => {
        if (groups.length == 0) {
            setFetchGroup(false)
            return;
        }
        setFetchGroup(true)

    }, [groups])

    return {
        groups,
        setGroups,
        currentPage,
        setCurrentPage,
        groupsPerPage,
        totalNumberOfPages,
        lastIndex,
        firstIndex,
        displayedGroups,
        creatorEmail
    }
}

const useGroupModals = () => {
    const [modalOpen, setModalOpen] = useState(false)
    const [currentGroupModal, setCurrentGroupModal] = useState<GroupInterface | null>(null)
    const [leaveGroupModal, setLeaveGroupModal] = useState<boolean>(false)
    const [editGroupModalStatus, setEditGroupModalStatus] = useState<"open" | "closed">("closed")

    return {
        modalOpen,
        setModalOpen,
        currentGroupModal,
        setCurrentGroupModal,
        leaveGroupModal,
        setLeaveGroupModal,
        editGroupModalStatus,
        setEditGroupModalStatus
    }
}

export default function GroupTable({
    setLoading,
    loading,
    setFetchGroup
}: Props) {



    let {
        groups,
        setGroups,
        currentPage,
        setCurrentPage,
        groupsPerPage,
        totalNumberOfPages,
        lastIndex,
        firstIndex,
        displayedGroups,
        creatorEmail
    } = useGroups(loading, setLoading, setFetchGroup)


    let {
        modalOpen,
        setModalOpen,
        currentGroupModal,
        setCurrentGroupModal,
        leaveGroupModal,
        setLeaveGroupModal,
        editGroupModalStatus,
        setEditGroupModalStatus
    } = useGroupModals()

    //refactor to maybe use enums for state instead of bool




    return (
        <>
            {!loading &&
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
                        currentGroup={currentGroupModal}
                    />}
                    {editGroupModalStatus == "open" &&
                        <EditGroupModal
                            editGroupModalStatus={editGroupModalStatus}
                            setEditGroupModalStatus={setEditGroupModalStatus}
                            currentGroup={currentGroupModal}
                            groups={groups}
                            setGroups={setGroups}
                        />
                    }

                    {groups.length > 0 &&
                        <>
                            <TableHeading
                                modalOpen={modalOpen}
                                setModalOpen={setModalOpen}
                                setLeaveGroupModal={setLeaveGroupModal}
                                setEditGroupModalStatus={setEditGroupModalStatus}
                            />
                            <table className="table grouptable">
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
                                            <TableBody
                                                key={group._id}
                                                creatorEmail={creatorEmail}
                                                group={group}
                                                setCurrentGroupModal={setCurrentGroupModal}
                                                setModalOpen={setModalOpen}
                                                setEditGroupModalStatus={setEditGroupModalStatus}
                                                setLeaveGroupModal={setLeaveGroupModal}
                                            />
                                        ))
                                    }
                                </tbody>
                            </table>

                            <TablePagination
                                currentPage={currentPage}
                                type={"group"}
                                setCurrentPage={setCurrentPage}
                                totalNumberOfPages={totalNumberOfPages}
                            />
                        </>}
                    {groups.length == 0 &&
                        <div className="emptygroup">
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
