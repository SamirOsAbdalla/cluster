import React from 'react'
import "./ProjectDetailModal.css"
import { ProjectInterface } from '@/lib/mongo/models/ProjectModel'

interface Props {
    project: ProjectInterface | null
}


export default function ProjectDetailModal({ project }: Props) {
    if (project) {
        let currentProject = project as ProjectInterface
        return (
            <div className="detailmodal__wrapper">{currentProject.name}</div>
        )
    } else {
        return (<></>)
    }

}
