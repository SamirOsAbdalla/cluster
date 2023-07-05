"use client"

import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import "./ProjectTable.css"
import { BsFillTrashFill, BsFillGearFill } from 'react-icons/bs'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import NewProjectModal from '../NewProjectModal/NewProjectModal'
export default function ProjectTable() {

    const [modalOpen, setModalOpen] = useState(false)
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
            {modalOpen && <NewProjectModal modalOpen={modalOpen} />}
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
                    <tr>
                        <td data-cell="name: ">Test Project</td>
                        <td data-cell="description: " className="description__cell">This is a test Project</td>
                        <td data-cell="creator: ">Samir Abdalla</td>
                        <td >
                            <span className="action__cell td__right">
                                <BsFillTrashFill />
                                <BsFillGearFill />
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>Test Project</td>
                        <td>This is a test Project</td>
                        <td>Samir Abdalla</td>
                        <td>
                            <span>
                                <BsFillTrashFill />
                                <BsFillGearFill />
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
