"use client"

import React from 'react'
import Link from 'next/link';
import { RxDashboard } from 'react-icons/rx'
import { BsFillPersonFill } from "react-icons/bs"
import { BiTask, BiLogOut } from "react-icons/bi"
import { AiOutlineMail } from "react-icons/ai"
import { GoGear } from "react-icons/go"
import { FcFilmReel } from "react-icons/fc"
import "./Sidebar.css"
import Image from 'next/image';
import LoginButton from '../LoginButton/LoginButton';


type SidebarProps = {
    name: string;
    picture: string;
}

const sidebarToggle = (e: React.MouseEvent<HTMLElement>) => {
    const sidebar = document.querySelector(".sidebar__wrapper")
    sidebar?.classList.toggle("active")
}
export default function Sidebar(props: SidebarProps) {
    return (
        <nav className="sidebar__wrapper">
            <div className="sidebar__heading">
                <div className="sidebar__heading__left">
                    <FcFilmReel className="sidebar__title__icon" />
                    <h1 className='sidebar__title' >
                        Titley
                    </h1>

                </div>
                <div className="sidebar__menu" onClick={(e) => sidebarToggle(e)}>
                    <div className="sidebar__menu__burger"></div>
                </div>
            </div>
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
                <Link href="/tasks" className="sidebar__link">
                    <BiTask className="sidebar__link__icon" />
                    <div className="sidebar__link__text">
                        Tasks
                    </div>
                </Link>
                <Link href="/inbox" className="sidebar__link">
                    <AiOutlineMail className="sidebar__link__icon" />
                    <div className="sidebar__link__text">
                        Inbox
                    </div>
                </Link>
                <Link href="/settings" className="sidebar__link">
                    <GoGear className="sidebar__link__icon" />
                    <div className="sidebar__link__text">
                        Settings
                    </div>
                </Link>
            </div>
            <LoginButton />
        </nav >
    )
}
