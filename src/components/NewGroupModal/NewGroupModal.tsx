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
import { BsFillPersonFill } from "react-icons/bs";
import { AiOutlineCloseCircle } from 'react-icons/ai'
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import { motion } from "framer-motion"

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
    const creatorPicture = data?.data?.user.picture
    const [loading, setLoading] = useState<boolean>(false)
    const [groupName, setGroupName] = useState<string>("")
    const [groupDescription, setGroupDescription] = useState<string>("")
    const [newMember, setNewMember] = useState<string>("")
    const [addedMembers, setAddedMembers] = useState<Set<string>>(() => new Set())


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!creatorEmail || !creatorName) {
            return;
        }
        else {
            const submitButton = document.querySelector(".new__group__button__submit") as HTMLButtonElement
            const cancelButton = document.querySelector(".newgroup__cancel") as HTMLButtonElement
            submitButton.disabled = true;
            cancelButton.disabled = true;
            setLoading(true)

            const creatorObject: MemberInterface = {
                memberEmail: creatorEmail as string,
                memberName: creatorName as string,
                profilePicture: creatorPicture!
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
            const resp = await fetch("/api/groups/createNewGroup", {
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
                    senderName: creatorName,
                    senderEmail: creatorEmail,
                    addedMembers: Array.from(addedMembers),
                    groupName: groupName,
                    groupId: addedGroup._id
                }
                const response = await fetch("/api/inbox/sendInvites", {
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
    }

    const removeMember = (e: React.MouseEvent<SVGElement, MouseEvent>, name: string) => {
        e.preventDefault()
        const tmpSet = new Set(Array.from(addedMembers))
        tmpSet.delete(name);
        setAddedMembers(tmpSet)
    }

    const animations = {
        inital: { scale: 0 },
        animate: { scale: 1 },
        exit: { scale: 0 }
    }
    let closeModal = () => {
        setModalOpen(false)
    }
    return (
        <ModalWrapper closeModal={closeModal}>
            <div className={`modal ${modalOpen ? "modal__open" : ""}`}>
                <AiFillCloseCircle className="modal__close  close__circle" onClick={() => {
                    setModalOpen(!modalOpen)
                }} />
                <div className="newgroupmodal__heading">
                    <p>Create Group</p>
                </div>

                <form className="modal__wrapperform" onSubmit={handleSubmit}>
                    <div className="group__form__top">
                        <div className="form__section">
                            <p className="group__section__title">
                                Group Name
                            </p>
                            <input
                                type="text"
                                placeholder="Name..."
                                value={groupName}
                                required
                                onChange={(e) => setGroupName(e.target.value)}
                            />
                        </div>
                        <div className="form__section">
                            <p className="group__section__title">
                                Group Description
                            </p>
                            <input
                                type="text"
                                placeholder="Description..."
                                value={groupDescription}
                                required
                                onChange={(e) => setGroupDescription(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="group__form__bottom">
                        <div className="form__section">
                            <div className="add__member">
                                <p className="group__section__title">
                                    Invite Members
                                </p>
                                <button type="button" className="invite__button" onClick={() => {

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
                                    placeholder="member@gmail.com"
                                    value={newMember}
                                    onChange={(e) => (setNewMember(e.target.value))}
                                />
                            </div>
                        </div>
                        {addedMembers.size > 0 &&
                            <div className="invited__members__list">
                                {Array.from(addedMembers).map(member => (
                                    <div className="invited__member" key={member}>
                                        <div className="invited__member__left">
                                            <BsFillPersonFill className="invited__member__icon" />
                                            <div className="invited__member__name">
                                                {member}
                                            </div>
                                        </div>
                                        <AiOutlineCloseCircle onClick={(e) => removeMember(e, member)} className="invited__remove" />

                                    </div>
                                ))}
                            </div>}

                    </div>
                    <div className="newgroup__buttons">
                        <button type="submit" className="blue__button new__group__button__submit">
                            {loading ? <LoadingSpinner type="button" /> : <span>Submit</span>}
                        </button>
                        <button className="cancel__button newgroup__cancel" onClick={() => setModalOpen(false)}>
                            Cancel
                        </button>
                    </div>

                </form>
            </div>


        </ModalWrapper>

    )
}
