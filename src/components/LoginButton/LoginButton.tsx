"use client"
import { useSession } from "next-auth/react"
import { BiLogOut } from "react-icons/bi"
import { signIn, signOut } from "next-auth/react"
export default function LoginButton() {

    const { data: session } = useSession()
    if (session && session.user) {
        return (
            <button className="sidebar__button" onClick={() => signOut()}>
                <BiLogOut />
                <span className="sidebar__button__text">Log out</span>
            </button>
        )
    }
    else {
        return (
            <button className="sidebar__button" onClick={() => signIn()}>
                <BiLogOut />
                <span className="sidebar__button__text">Log in</span>
            </button>
        )
    }
}
