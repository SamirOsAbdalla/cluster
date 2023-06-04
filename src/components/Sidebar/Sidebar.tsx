"use client"

import React from 'react'
import Link from 'next/link';
import { RxDashboard } from 'react-icons/rx'
import { BsFillPersonFill } from "react-icons/bs"
import { BiTask } from "react-icons/bi"
import { AiOutlineMail } from "react-icons/ai"
import { GoGear } from "react-icons/go"
import "./Sidebar.css"
import Image from 'next/image';


type SidebarProps = {
    name: string;
    picture: string;
}

const sidebarToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const sidebar = document.querySelector(".sidebar__wrapper")
    sidebar?.classList.toggle("active")
}
export default function Sidebar(props: SidebarProps) {
    return (
        <nav className="sidebar__wrapper">
            <button onClick={(e) => sidebarToggle(e)}>
                Hi
            </button>
            <h1 className='sidebar__title' >
                Titley
            </h1>
            <div className="sidebar__profile">
                {props.picture ?
                    <img src={props.picture} className="sidebar__profile__picture" />
                    :
                    <div className="sidebar__profile__picture">
                        <BsFillPersonFill className="sidebar__person" />
                    </div>
                }
                <div className="sidebar__profile__name">
                    {props.name}
                </div>
            </div>
            <div className="sidebar__links">
                <Link href="/dashboard" className="sidebar__link">
                    <RxDashboard className="sidebar__link__icon" />
                    <div className="sidebar__link__text">
                        Dashboard
                    </div>
                </Link>
                <Link href="/dashboard" className="sidebar__link">
                    <BiTask className="sidebar__link__icon" />
                    <div className="sidebar__link__text">
                        Tasks
                    </div>
                </Link>
                <Link href="/dashboard" className="sidebar__link">
                    <AiOutlineMail className="sidebar__link__icon" />
                    <div className="sidebar__link__text">
                        Inbox
                    </div>
                </Link>
                <Link href="/dashboard" className="sidebar__link">
                    <GoGear className="sidebar__link__icon" />
                    <div className="sidebar__link__text">
                        Settings
                    </div>
                </Link>
            </div>
            <button className="sidebar__button">
                Log in
            </button>
        </nav >
    )
}
