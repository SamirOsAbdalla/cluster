import React from 'react'
import "./GroupDetailModal.css"
import { GroupInterface } from '@/lib/mongo/models/GroupModel'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'
interface Props {
    group: GroupInterface | null,
    setGroupDetailModal: Dispatch<SetStateAction<boolean>>
}


export default function GroupDetailModal({ group, setGroupDetailModal }: Props) {

    const [invitedMembers, setInvitedMembers] = useState<Set<string>>(() => new Set())
    const [currentInvitedMember, setCurrentInvitedMember] = useState<string>("")

    if (group) {

        let currentGroup = group as GroupInterface
        const inviteMembers = async () => {
            if (invitedMembers) {

                const inboxBody = {
                    groupCreator: currentGroup.creator.memberName,
                    groupCreatorEmail: currentGroup.creator.memberEmail,
                    addedMembers: Array.from(invitedMembers),
                    groupName: currentGroup.name,
                    groupId: currentGroup._id
                }
                const response = await fetch("http://localhost:3000/api/sendInvites", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(inboxBody),
                });
                setInvitedMembers(new Set())
                setGroupDetailModal(false)
            }
        }
        return (
            <div className="detailmodal__wrapper">
                <AiOutlineCloseCircle onClick={() => setGroupDetailModal(false)} className="modal__circle" />
                <h1>Group Information</h1>
                <div className="group__information">
                    <div className="groupmodalbox">
                        <div className="groupmodalbox__heading">
                            Group Name
                        </div>
                        <div className="groupmodalbox__info">
                            {currentGroup.name}
                        </div>
                    </div>
                    <div className="groupmodalbox">
                        <div className="groupmodalbox__heading">
                            Group Description
                        </div>
                        <div className="groupmodalbox__info">
                            {currentGroup.description}
                        </div>
                    </div>
                </div>
                <div className="group__information">
                    <div className="groupmodalbox">
                        <div className="groupmodalbox__heading">
                            Group Creator
                        </div>
                        <div className="groupmodalbox__info">
                            {currentGroup.creator.memberName}
                        </div>
                    </div>
                    <div className="groupmodalbox">
                        <div className="groupmodalbox__heading">
                            Group Creation Date
                        </div>
                        <div className="groupmodalbox__info">
                            {currentGroup.dateCreated.toString()}
                        </div>
                    </div>
                </div>
                <div>
                    <div className="invitemember__box">
                        <div className="groupmodalbox__heading">
                            Invite Member
                        </div>
                        <button onClick={() => {

                            if (currentInvitedMember == "") {
                                return;
                            }
                            const newSet = new Set(invitedMembers)
                            newSet.add(currentInvitedMember)
                            setInvitedMembers(newSet)
                            setCurrentInvitedMember("")
                        }} >
                            Add Member
                        </button>
                    </div>
                    <input
                        value={currentInvitedMember}
                        onChange={(e) => setCurrentInvitedMember(e.target.value)}
                        type="email"
                    />
                </div>
                {Array.from(invitedMembers).map(member => (
                    <div className="invited__member" key={member}>
                        {member}
                    </div>
                ))}
                <button onClick={inviteMembers}>
                    Submit
                </button>
            </div>
        )
    } else {
        return (<></>)
    }

}
