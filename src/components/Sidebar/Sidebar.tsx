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
import LoginButton from '../LoginButton/LoginButton';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import rocket from "../../../public/rocket.png"
import { useState } from 'react';
import { BsCamera } from 'react-icons/bs';
import defaultImage from "../../../public/default.png"
import { useEffect } from 'react';

const sidebarToggle = (e: React.MouseEvent<HTMLElement>) => {
    const sidebar = document.querySelector(".sidebar__wrapper")
    sidebar?.classList.toggle("active")
}
export default function Sidebar() {
    const curSession = useSession()
    const name = curSession?.data?.user.name

    const userEmail = curSession?.data?.user.email
    const [image, setImage] = useState<any>(null)
    const pathname = usePathname()


    useEffect(() => {
        const fetchUserPicture = async () => {
            if (!userEmail) {
                return;
            }
            const body = {
                memberEmail: userEmail
            }

            const resp = await fetch("http://localhost:3000/api/user/fetchPicture", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const respJSON = await resp.json()
            if (respJSON === "") {
                return;
            }
            if (respJSON) {
                setImage(respJSON.url)
                return;
            }
            if (!respJSON) {
                //throw error
            }
        }

        fetchUserPicture()
    }, [userEmail])





    const changeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader()

            reader.readAsDataURL(e.target.files[0])
            reader.onloadend = async () => {
                setImage(reader.result)

                const userBody = {
                    memberEmail: userEmail,
                    newPicture: reader.result
                }
                const resp = await fetch("http://localhost:3000/api/user/changePicture", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userBody),
                })

                const respJSON = await resp.json()
                if (!respJSON) {
                    //throw error
                }
            }


        }
    }

    if (pathname == "/signIn" || pathname == "/signup") {
        return (
            <>
            </>
        )
    }

    return (
        <nav className="sidebar__wrapper">
            <div className="sidebar__heading">
                <div className="sidebar__heading__left">
                    <div className="rocky__container">
                        <Image fill src={rocket} alt="rocket icon" />
                    </div>

                    <h1 className='sidebar__title' >
                        Cluster
                    </h1>

                </div>
                <div className="sidebar__menu" onClick={(e) => sidebarToggle(e)}>
                    <div className="sidebar__menu__burger"></div>
                </div>
            </div>
            <div className="sidebar__profile">
                <div className="sidebar__profile__picture">
                    <div className="profile__im__container">
                        <Image fill className="default__image" src={image ? image : defaultImage} alt="Default Picture" />
                    </div>
                    <input onChange={changeImage} type="file" id="file" />
                    <label className="upload__image" htmlFor='file'><BsCamera className="camera" /></label>
                </div>
                <div className="sidebar__profile__name">
                    {name}
                </div>
            </div>
            <div className="sidebar__links">
                <Link href="/" className="sidebar__link">
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

            </div>
            <LoginButton />
        </nav >
    )
}
