import "./NewProjectModal.css"
import { useRef, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import React from 'react'

interface Props {
    modalOpen: boolean
}

interface ProjectModalType {
    projectName: string;
    projectDescription: string;
    projectCreator: string;
    projectMembers: string;
}
export default function NewProjectModal({ modalOpen }: Props) {
    const data = useSession()
    const projectName = useRef("")
    const projectDescription = useRef("")
    const [newMember, setNewMember] = useState("")
    const [addedMembers, setAddedMembers] = useState<Set<string>>(() => new Set())

    const handleSubmit = (e: any) => {
        e.preventDefault()
        //send invite links to added users
    }
    return (
        <div className={`modal__wrapper ${modalOpen ? "modal__open" : ""}`}>
            <form>
                <div className="projectForm__top">
                    <div className="input__item">
                        <input
                            type="text"
                            value={projectName.current}
                            onChange={(e) => projectName.current = e.target.value}
                        />
                    </div>
                    <div className="input__item">
                        <input
                            type="text"
                            value={projectDescription.current}
                            onChange={(e) => projectDescription.current = e.target.value}
                        />
                    </div>
                </div>
                <div className="projectForm__bottom">
                    <div>
                        <div className="input__item">
                            <input
                                type="text"
                                value={newMember}
                                onChange={(e) => (setNewMember(e.target.value))}
                            />
                        </div>
                        <button type="button" onClick={() => {

                            if (newMember == "") {
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
                    {Array.from(addedMembers).map(member => (
                        <div key={member}>
                            {member}
                        </div>
                    ))}
                </div>
            </form>
        </div>
    )
}
