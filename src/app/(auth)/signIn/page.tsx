"use client"
import {
    AiOutlineMail,
    AiOutlineEye,
    AiOutlineEyeInvisible
} from "react-icons/ai"
import { RiLockPasswordLine } from "react-icons/ri"
import { BsFillPersonFill } from "react-icons/bs"
import { useState } from "react"
import { signIn } from "next-auth/react"
import Link from 'next/link'
import "./page.css"
import { useRouter } from "next/navigation"

export default function SignIn() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const result = await signIn("credentials", {
            email: email,
            password: password,
            redirect: false,
        })
        if (result && result.error != null) {

        }
        else {

            router.push("/")
        }
    }
    return (
        <div className="login__form__wrapper">
            <div className="login__form__container">
                <div className="login__picture__container">
                    <div className="login__logo__container">

                        <BsFillPersonFill className="login__logo" />
                    </div>
                </div>
                <div className="login__header">
                    <h1>Sign in</h1>
                    <div>
                        Please login to get started
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="login__form">
                    <div className="form__item">
                        <AiOutlineMail className="form__icon" />
                        <input
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => (setEmail(e.target.value))}
                            placeholder="Enter email"
                            type="email"
                            required />
                    </div>
                    <div className="form__item">
                        <RiLockPasswordLine className="form__icon" />
                        <input
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => (setPassword(e.target.value))}
                            placeholder="Enter password"
                            type="password"
                            required />
                    </div>
                    <button type="submit" className="login__button">Login</button>
                </form>
                <div className="signup">
                    <span>Don't have an account?</span>
                    <Link href="/signup"> Sign up</Link>
                </div>
            </div>
        </div>
    )
}