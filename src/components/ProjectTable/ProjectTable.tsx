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
import ProjectDetailModal from '../ProjectDetailModal/ProjectDetailModal'
import LeaveProjectModal from '../LeaveProjectModal/LeaveProjectModal'
import TablePagination from '../TablePagination/TablePagination'
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


    //refactor to maybe use enums for state instead of bool
    const [modalOpen, setModalOpen] = useState(false)
    const [projectDetailModal, setProjectDetailModal] = useState<boolean>(false)
    const [projects, setProjects] = useState<ProjectInterface[]>([])
    const [currentProjectModal, setCurrentProjectModal] = useState<ProjectInterface | null>(null)
    const [leaveProjectModal, setLeaveProjectModal] = useState<boolean>(false)
    const [currentPage, setCurrentPage] = useState<number>(1)

    const projectsPerPage = 5;
    const totalNumberOfPages = Math.ceil(projects.length / projectsPerPage)
    const lastIndex = currentPage * projectsPerPage;
    const firstIndex = lastIndex - projectsPerPage
    const displayedProjects = projects.slice(firstIndex, lastIndex)
    const handleGearClick = (project: ProjectInterface) => {
        if (modalOpen) {
            setModalOpen(false)
        }
        setLeaveProjectModal(false)
        if (projectDetailModal) {
            setProjectDetailModal(false)
            setCurrentProjectModal(null)
        } else {
            setProjectDetailModal(true)
            setCurrentProjectModal(project)
        }
    }

    const handleTrashClick = (project: ProjectInterface) => {
        setModalOpen(false)
        setProjectDetailModal(false)
        if (currentProjectModal && !(project._id == currentProjectModal._id)) {
            setLeaveProjectModal(true)
            setCurrentProjectModal(project)
        } else if (currentProjectModal && (project._id == currentProjectModal._id)) {
            if (leaveProjectModal) {
                setLeaveProjectModal(false)
            } else {
                setLeaveProjectModal(true)
            }
        } else {
            setCurrentProjectModal(project)
            setLeaveProjectModal(true)
        }
    }

    return (
        <div className="table__wrapper">
            <div className="project__heading">
                <h1>My Projects</h1>
                <button onClick={(e) => {
                    const modalStatus = modalOpen
                    setModalOpen(!modalStatus)
                    if (projectDetailModal) {
                        setProjectDetailModal((prevState: boolean) => !prevState)
                    }

                }}>
                    <AiOutlinePlusCircle />
                    <span>New Project</span>
                </button>
            </div>
            {modalOpen && <NewProjectModal
                currentPage={currentPage}
                projectsPerPage={projectsPerPage}
                setCurrentPage={setCurrentPage}
                projects={projects}
                setProjects={setProjects}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />}
            {projectDetailModal && <ProjectDetailModal
                project={currentProjectModal}
                setProjectDetailModal={setProjectDetailModal}
            />}
            {leaveProjectModal && <LeaveProjectModal
                projectsPerPage={projectsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                projects={projects}
                setProjects={setProjects}
                leaveProjectModal={leaveProjectModal}
                setLeaveProjectModal={setLeaveProjectModal}
                currentProject={currentProjectModal} />}
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
                        displayedProjects.map((project: ProjectInterface) => (
                            <React.Fragment key={project.dateCreated as any}>
                                <tr>
                                    <td data-cell="name: ">{project.name}</td>
                                    <td data-cell="description: " className="description__cell">{project.description}</td>
                                    <td data-cell="creator: ">{project.creator.memberName}</td>
                                    <td >
                                        <span className="action__cell td__right">
                                            <BsFillTrashFill onClick={() => handleTrashClick(project)} className="action__logo" />
                                            <BsFillGearFill onClick={() => handleGearClick(project)} className="action__logo" />
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
        </div>
    )
}
