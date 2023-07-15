"use client"

import "./NewGroupModal.css"
import { useRef, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import React from 'react'
import { AiFillCloseCircle } from "react-icons/ai";
import { Dispatch, SetStateAction } from "react";

import { GroupInterface } from '@/lib/mongo/models/GroupModel'
import { TaskInterface } from '@/lib/mongo/models/TaskModel'
import { MemberInterface } from '@/lib/mongo/models/GroupModel'
import { CommentInterface } from '@/lib/mongo/models/CommentModel'
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
interface Props {
    modalOpen: boolean,
    setModalOpen: Dispatch<SetStateAction<boolean>>,
    groups: GroupInterface[],
    setGroups: Dispatch<SetStateAction<GroupInterface[]>>,
    setCurrentPage: Dispatch<SetStateAction<number>>,
    currentPage: number,
    groupsPerPage: number
}

interface GroupModalType {
    groupName: string;
    groupDescription: string;
    groupCreator: string;
    groupMembers: string;
}
export default function NewGroupModal({ modalOpen, setModalOpen, groups,
    setGroups, setCurrentPage, currentPage, groupsPerPage }: Props) {
    const data = useSession()
    const creatorEmail = data?.data?.user.email
    const creatorName = data?.data?.user.name
    const [loading, setLoading] = useState<boolean>(false)
    const [groupName, setGroupName] = useState<string>("")
    const [groupDescription, setGroupDescription] = useState<string>("")
    const [newMember, setNewMember] = useState<string>("")
    const [addedMembers, setAddedMembers] = useState<Set<string>>(() => new Set())


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!(creatorEmail || creatorName)) {
            return;
        }
        else {
            setLoading(true)
            const creatorObject: MemberInterface = {
                memberEmail: creatorEmail as string,
                memberName: creatorName as string

            }
            let allMembers: MemberInterface[] = [];
            allMembers.push(creatorObject)
            let newGroup = {
                groupName,
                groupDescription,
                creator: creatorObject,
                members: allMembers,
            }
            //make api call to backend 
            const resp = await fetch("http://localhost:3000/api/groups/createNewGroup", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newGroup),
            });

            let addedGroup;
            if (resp) {
                setNewMember("")
                setGroupDescription("")
                setGroupName("")
                setModalOpen(!modalOpen)

                addedGroup = await resp.json()
                setCurrentPage(Math.ceil((groups.length + 1) / groupsPerPage))
                setGroups([...groups, addedGroup])
            } else {
                //handle error
            }

            //add quality of life for new member in case user forgot to add

            if (addedMembers) {

                const inboxBody = {
                    groupCreator: creatorName,
                    groupCreatorEmail: creatorEmail,
                    addedMembers: Array.from(addedMembers),
                    groupName: groupName,
                    groupId: addedGroup._id
                }
                const response = await fetch("http://localhost:3000/api/inbox/sendInvites", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(inboxBody),
                });
                setAddedMembers(new Set())
            }

            setLoading(false)

        }

        //add new group to Group table(create state)
        //send invite links to added users
    }
    return (
        <div className={`modal__wrapper ${modalOpen ? "modal__open" : ""}`}>
            <AiFillCloseCircle className="close__circle" onClick={() => {
                setModalOpen(!modalOpen)
            }} />
            <form onSubmit={handleSubmit}>
                <div className="group__form__top">
                    <div className="form__section">
                        <div className="group__section__title">
                            Group Name
                        </div>
                        <input
                            type="text"
                            value={groupName}
                            required
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                    </div>
                    <div className="form__section">
                        <div className="group__section__title">
                            Group Description
                        </div>
                        <input
                            type="text"
                            value={groupDescription}
                            required
                            onChange={(e) => setGroupDescription(e.target.value)}
                        />
                    </div>
                </div>
                <div className="group__form__bottom">
                    <div className="form__section">
                        <div className="add__member">
                            <div className="group__section__title">
                                Invite Members
                            </div>
                            <button type="button" onClick={() => {

                                if (newMember == "" || newMember == creatorEmail) {
                                    return;
                                }
                                const newSet = new Set(addedMembers)
                                newSet.add(newMember)
                                setAddedMembers(newSet)
                                setNewMember("")
                            }}>
                                Add Member
                            </button>
                        </div>
                        <div>
                            <input
                                type="email"
                                value={newMember}
                                onChange={(e) => (setNewMember(e.target.value))}
                            />
                        </div>
                    </div>
                    {Array.from(addedMembers).map(member => (
                        <div className="invited__member" key={member}>
                            {member}
                        </div>
                    ))}
                </div>
                <button type="submit" className="new__group__button">
                    {loading ? <LoadingSpinner type="button" /> : <span>Submit</span>}
                </button>
            </form>
        </div>
    )
}
