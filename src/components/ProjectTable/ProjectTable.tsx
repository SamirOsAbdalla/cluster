"use client"

import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import "./ProjectTable.css"
import { BsFillTrashFill, BsFillGearFill } from 'react-icons/bs'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import NewProjectModal from '../NewProjectModal/NewProjectModal'
import { ProjectInterface, TaskInterface, CommentInterface, MemberInterface } from '@/lib/mongo/models/ProjectModel'
export default function ProjectTable() {
    const data = useSession()
    const creatorEmail = data?.data?.user.email
    const creatorName = data?.data?.user.name
    useEffect(() => {
        if (!creatorEmail || !creatorName) {
            return;
        }
        const fetchProjects = async () => {
            let currentCreator: MemberInterface = {
                memberEmail: creatorEmail,
                memberName: creatorName
            }
            const resp = await fetch("http://localhost:3000/api/findProjects", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(currentCreator),
            });

            const finalData = await resp.json()
            setProjects(finalData)
        }

        fetchProjects()
    }, [creatorName])

    const [modalOpen, setModalOpen] = useState(false)
    const [projects, setProjects] = useState<ProjectInterface[]>([])
    return (
        <div className="table__wrapper">
            <div className="project__heading">
                <h1>My Projects</h1>
                <button onClick={(e) => {
                    const modalStatus = modalOpen
                    setModalOpen(!modalStatus)
                }}>
                    <AiOutlinePlusCircle />
                    <span>New Project</span>
                </button>
            </div>
            {modalOpen && <NewProjectModal
                projects={projects}
                setProjects={setProjects}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />}
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
                        projects.map((project: any) => (
                            <React.Fragment key={project.dateCreated}>
                                <tr>
                                    <td data-cell="name: ">{project.name}</td>
                                    <td data-cell="description: " className="description__cell">{project.description}</td>
                                    <td data-cell="creator: ">{project.creator.memberName}</td>
                                    <td >
                                        <span className="action__cell td__right">
                                            <BsFillTrashFill />
                                            <BsFillGearFill />
                                        </span>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}
