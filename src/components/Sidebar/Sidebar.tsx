"use client"
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
import {
    useState,
    useEffect
} from 'react';
import SidebarHeading from './SidebarHeading';
import ProfilePicture from './ProfilePicture';
import SidebarLink from './SidebarLink';



const useUserInfo = () => {
    const curSession = useSession()
    const { data: session, update: sessionUpdate } = useSession()

    const userEmail = curSession?.data?.user.email
    const name = curSession?.data?.user.name
    const [image, setImage] = useState<any>(null)

    function handleUpdateSession(url: string) {
        sessionUpdate({
            info: {
                public_id: "",
                url
            }
        })
    }

    useEffect(() => {
        const fetchUserPicture = async () => {
            if (!userEmail) {
                return;
            }
            const body = {
                memberEmail: userEmail
            }

            const resp = await fetch("/api/user/fetchPicture", {
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
                handleUpdateSession(respJSON.url)
                return;
            }
            if (!respJSON) {
                //throw error
            }
        }

        fetchUserPicture()
    }, [userEmail, handleUpdateSession])

    return {
        image,
        setImage,
        name,
        userEmail
    }
}

export default function Sidebar() {


    const pathname = usePathname()


    const {
        image,
        setImage,
        name,
        userEmail
    } = useUserInfo()


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
                const resp = await fetch("/api/user/changePicture", {
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
            <SidebarHeading />

            <ProfilePicture
                image={image}
                changeImage={changeImage}
                name={name}
            />
            <div className="sidebar__links">
                <SidebarLink
                    href="/"
                    icon={<RxDashboard className="sidebar__link__icon" />}
                    text="Dashboard"
                />
                <SidebarLink
                    href="/tasks"
                    icon={<RxDashboard className="sidebar__link__icon" />}
                    text="Tasks"
                />
                <SidebarLink
                    href="/inbox"
                    icon={<RxDashboard className="sidebar__link__icon" />}
                    text="Inbox"
                />
            </div>
            <LoginButton />
        </nav >
    )
}
