import React from 'react'
import "./ProjectDetailModal.css"
import { ProjectInterface } from '@/lib/mongo/models/ProjectModel'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'
interface Props {
    project: ProjectInterface | null,
    setProjectDetailModal: Dispatch<SetStateAction<boolean>>
}


export default function ProjectDetailModal({ project, setProjectDetailModal }: Props) {

    const [invitedMembers, setInvitedMembers] = useState<Set<string>>(() => new Set())
    const [currentInvitedMember, setCurrentInvitedMember] = useState<string>("")

    if (project) {

        let currentProject = project as ProjectInterface
        const inviteMembers = async () => {
            if (invitedMembers) {

                const inboxBody = {
                    projectCreator: currentProject.creator.memberName,
                    projectCreatorEmail: currentProject.creator.memberEmail,
                    addedMembers: Array.from(invitedMembers),
                    projectName: currentProject.name,
                    projectId: currentProject._id
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
                setProjectDetailModal(false)
            }
        }
        return (
            <div className="detailmodal__wrapper">
                <AiOutlineCloseCircle onClick={() => setProjectDetailModal(false)} className="modal__circle" />
                <h1>Project Information</h1>
                <div className="project__information">
                    <div className="projectmodalbox">
                        <div className="projectmodalbox__heading">
                            Project Name
                        </div>
                        <div className="projectmodalbox__info">
                            {currentProject.name}
                        </div>
                    </div>
                    <div className="projectmodalbox">
                        <div className="projectmodalbox__heading">
                            Project Description
                        </div>
                        <div className="projectmodalbox__info">
                            {currentProject.description}
                        </div>
                    </div>
                </div>
                <div className="project__information">
                    <div className="projectmodalbox">
                        <div className="projectmodalbox__heading">
                            Project Creator
                        </div>
                        <div className="projectmodalbox__info">
                            {currentProject.creator.memberName}
                        </div>
                    </div>
                    <div className="projectmodalbox">
                        <div className="projectmodalbox__heading">
                            Project Creation Date
                        </div>
                        <div className="projectmodalbox__info">
                            {currentProject.dateCreated.toString()}
                        </div>
                    </div>
                </div>
                <div>
                    <div className="invitemember__box">
                        <div className="projectmodalbox__heading">
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
