import "./LeaveProjectModal.css"
import { ProjectInterface } from "@/lib/mongo/models/ProjectModel"
import { Dispatch, SetStateAction } from "react"
import { AiFillCloseCircle } from "react-icons/ai";
import { useSession } from "next-auth/react";
import React from 'react'

interface Props {
    projects: ProjectInterface[],
    setProjects: Dispatch<SetStateAction<ProjectInterface[]>>,
    leaveProjectModal: boolean,
    setLeaveProjectModal: Dispatch<SetStateAction<boolean>>,
    currentProject: ProjectInterface | null,
    currentPage: number,
    setCurrentPage: Dispatch<SetStateAction<number>>,
    projectsPerPage: number
}
export default function LeaveProjectModal({ currentProject, leaveProjectModal, setLeaveProjectModal,
    projects, setProjects, currentPage, setCurrentPage, projectsPerPage }: Props) {
    let typecastedProject = currentProject as ProjectInterface
    const data = useSession()
    const userEmail = data?.data?.user.email
    if (currentProject) {
        currentProject = currentProject as ProjectInterface
    }

    const leaveProject = async () => {
        if (!userEmail) {
            return;
        }
        const leaveProjectBody = {
            projectId: typecastedProject._id,
            userEmail
        }

        const resp = await fetch("http://localhost:3000/api/removeProjectMember", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(leaveProjectBody),
        });

        const finalResponse = await resp.json()
        if (finalResponse) {
            const tmpProjects = projects.filter(project => project._id != typecastedProject._id)
            if (tmpProjects.length % projectsPerPage == 0 && tmpProjects.length > 1) {
                setCurrentPage((prevState) => prevState - 1)
            }
            setLeaveProjectModal(false)
            setProjects(tmpProjects)
        } else {
            //handle error
        }
    }
    return (
        <div className="leavemodal__wrapper">
            <AiFillCloseCircle onClick={() => setLeaveProjectModal(false)} className="leave__circle" />
            <div className="leave__heading">
                Are you sure you want to leave <span>{typecastedProject.name}</span>?
            </div>
            <div className="leave__buttons">
                <button onClick={leaveProject} className="leave__button leave">
                    Leave
                </button>
                <button onClick={() => setLeaveProjectModal(false)} className="leave__button cancel">
                    Cancel
                </button>
            </div>
        </div>
    )
}
