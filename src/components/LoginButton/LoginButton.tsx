"use client"
import { useSession } from "next-auth/react"
import { BiLogOut } from "react-icons/bi"
import { signIn, signOut } from "next-auth/react"
import { useState } from "react"
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner"

export default function LoginButton() {

    const [loading, setLoading] = useState<boolean>(false)
    const { data: session } = useSession()

    if (session && session.user) {
        return (
            <button className="sidebar__button sidebar__login" onClick={() => {
                setLoading(true)
                signOut()
            }}>
                {loading ? <LoadingSpinner type="button" /> :
                    <><BiLogOut />
                        <span className="sidebar__button__text">Log out</span>
                    </>
                }
            </button>
        )
    }
    else {
        return (
            <button className="sidebar__button sidebar__login" onClick={() => signIn()}>
                <BiLogOut />
                <span className="sidebar__button__text">Log in</span>
            </button>
        )
    }
}
