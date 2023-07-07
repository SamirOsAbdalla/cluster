"use client"

import "./NewProjectModal.css"
import { useRef, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import React from 'react'
import { AiFillCloseCircle } from "react-icons/ai";
import { Dispatch, SetStateAction } from "react";

import { ProjectInterface, TaskInterface, CommentInterface, MemberInterface } from '@/lib/mongo/models/ProjectModel'

interface Props {
    modalOpen: boolean,
    setModalOpen: Dispatch<SetStateAction<boolean>>,
    projects: ProjectInterface[],
    setProjects: Dispatch<SetStateAction<ProjectInterface[]>>
}

interface ProjectModalType {
    projectName: string;
    projectDescription: string;
    projectCreator: string;
    projectMembers: string;
}
export default function NewProjectModal({ modalOpen, setModalOpen, projects, setProjects }: Props) {
    const data = useSession()
    const creatorEmail = data?.data?.user.email
    const creatorName = data?.data?.user.name
    const [projectName, setProjectName] = useState<string>("")
    const [projectDescription, setProjectDescription] = useState<string>("")
    const [newMember, setNewMember] = useState<string>("")
    const [addedMembers, setAddedMembers] = useState<Set<string>>(() => new Set())


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!(creatorEmail || creatorName)) {
            return;
        }
        else {
            const creatorObject: MemberInterface = {
                memberEmail: creatorEmail as string,
                memberName: creatorName as string

            }
            let allMembers: MemberInterface[] = [];
            allMembers.push(creatorObject)
            let newProject = {
                projectName,
                projectDescription,
                creator: creatorObject,
                members: allMembers
            }
            //make api call to backend 
            const resp = await fetch("http://localhost:3000/api/createNewProject", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newProject),
            });

            if (resp) {
                setNewMember("")
                setProjectDescription("")
                setProjectName("")
                setAddedMembers(new Set())
                setModalOpen(!modalOpen)

                const addedProject = await resp.json()
                setProjects([...projects, addedProject])
            }
        }

        //add new project to Project table(create state)
        //send invite links to added users
    }
    return (
        <div className={`modal__wrapper ${modalOpen ? "modal__open" : ""}`}>
            <AiFillCloseCircle className="close__circle" onClick={() => {
                setModalOpen(!modalOpen)
            }} />
            <form onSubmit={handleSubmit}>
                <div className="project__form__top">
                    <div className="form__section">
                        <div className="project__section__title">
                            Project Name
                        </div>
                        <input
                            type="text"
                            value={projectName}
                            required
                            onChange={(e) => setProjectName(e.target.value)}
                        />
                    </div>
                    <div className="form__section">
                        <div className="project__section__title">
                            Project Description
                        </div>
                        <input
                            type="text"
                            value={projectDescription}
                            required
                            onChange={(e) => setProjectDescription(e.target.value)}
                        />
                    </div>
                </div>
                <div className="project__form__bottom">
                    <div className="form__section">
                        <div className="add__member">
                            <div className="project__section__title">
                                Invite Members
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
                        <div>
                            <input
                                type="text"
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
                <button type="submit" className="new__project__button">
                    Create Project
                </button>
            </form>
        </div>
    )
}
