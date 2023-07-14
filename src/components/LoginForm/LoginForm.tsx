"use client"
import {
    AiOutlineMail,
    AiOutlineEye,
    AiOutlineEyeInvisible
} from "react-icons/ai"
import { RiLockPasswordLine } from "react-icons/ri"
import { BsFillPersonFill, BsPerson } from "react-icons/bs"
import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import Link from 'next/link'
import "./LoginForm.css"
import { useRouter } from "next/navigation"
import UserModel from "@/lib/mongo/models/UserModel"
import ErrorMessage from "../ErrorMessage/ErrorMessage"
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner"
interface LoginProps {
    type: string
}
export default function LoginForm({ type }: LoginProps) {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const [email, setEmail] = useState<string>("")
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    useEffect(() => {
        setError("")
    }, [])
    const handleLogin = async () => {
        setLoading(true)
        const result = await signIn("credentials", {
            email: email,
            password: password,
            redirect: false,
        })
        if (result && result.error != null) {
            const tmpError = "login"
            setError(tmpError)
        }
        else {
            setError("")
            router.push("/")
        }
        setLoading(false)
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (type == "login") {
            handleLogin()
        }
        else {
            setLoading(true)
            const name = firstName + " " + lastName
            const newUser = {
                name,
                email,
                password
            }
            const resp = await fetch("http://localhost:3000/api/register", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });
            if (resp.statusText == "OK") {
                setError("")
                handleLogin()
            } else {
                let tempError = "userExists"
                setError(tempError)
            }
            setLoading(false)
        }

    }
    return (
        <div className="login__form__wrapper">
            <div className="login__form__container">
                {loading && <LoadingSpinner type="login" />}
                <div className="login__picture__container">
                    <div className="login__logo__container">

                        <BsFillPersonFill className="login__logo" />
                    </div>
                </div>

                {error == "userExists" && <ErrorMessage type="userExists" />}
                {error == "login" && <ErrorMessage type="login" />}

                {type == "login" ?
                    <div className="login__header">
                        <h1>Sign in</h1>
                        <div>
                            Please login to get started
                        </div>
                    </div> :
                    <div className="login__header">
                        <h1>Sign up</h1>
                        <div>
                            Please sign up to get started
                        </div>
                    </div>
                }

                <form onSubmit={handleSubmit} className="login__form">
                    {type == "login" ?
                        <></>
                        :
                        <div className="form__top">
                            <div className="form__item">
                                <BsPerson className="form__icon" />
                                <input
                                    value={firstName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => (setFirstName(e.target.value))}
                                    placeholder="Enter first name"
                                    type="text"
                                    required />
                            </div>
                            <div className="form__item">
                                <BsPerson className="form__icon" />
                                <input
                                    value={lastName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => (setLastName(e.target.value))}
                                    placeholder="Enter last name"
                                    type="text"
                                    required />
                            </div>
                        </div>
                    }
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
                    {type == "login" ?
                        <button type="submit" className="login__button">Login</button>
                        :
                        <button type="submit" className="login__button">Sign up</button>
                    }
                </form>
                {type == "login" ?
                    <div className="signup">
                        <span>Don't have an account?</span>
                        <Link href="/signup"> Sign up</Link>
                    </div>
                    :
                    <div>
                        <div className="signup">
                            <span>Already have an account?</span>
                            <Link href="/signIn"> Sign in</Link>
                        </div>
                    </div>
                }
            </div>
        </div>)
}