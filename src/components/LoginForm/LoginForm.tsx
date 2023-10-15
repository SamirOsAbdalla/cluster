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
import { FaUserAstronaut } from "react-icons/fa"
interface LoginProps {
    type: string
}
export default function LoginForm({ type }: LoginProps) {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const [demo1Loading, setDemo1Loading] = useState<boolean>(false)
    const [demo2Loading, setDemo2Loading] = useState<boolean>(false)

    const [email, setEmail] = useState<string>("")
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    useEffect(() => {
        setError("")
    }, [])

    const setButtonsDisabled = () => {
        const button1 = document.querySelector(".demouser__button1") as HTMLButtonElement
        const button2 = document.querySelector(".demouser__button2") as HTMLButtonElement
        const loginButton = document.querySelector(".login__button") as HTMLButtonElement

        if (button1) {
            button1.disabled = true;
        }
        if (button2) {
            button2.disabled = true
        }
        loginButton.disabled = true;
    }

    const disableLoadings = () => {
        setLoading(false);
    }

    const handleLogin = async () => {

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
        disableLoadings()
    }


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setButtonsDisabled()
        if (type == "login") {
            handleLogin()
        }
        else {
            const name = firstName + " " + lastName
            const newUser = {
                name,
                email,
                password
            }
            const resp = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            const respJSON = await resp.json()
            if (respJSON) {
                setError("")
                handleLogin()
            } else {
                let tempError = "userExists"
                setError(tempError)
            }
        }
    }
    return (
        <div className="login__form__wrapper">
            <div className="login__form__container">
                <div className="login__picture__container">
                    <div className="login__logo__container">

                        <FaUserAstronaut className="login__logo" />
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
                                    required
                                    className="login__input" />
                            </div>
                            <div className="form__item">
                                <BsPerson className="form__icon" />
                                <input
                                    value={lastName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => (setLastName(e.target.value))}
                                    placeholder="Enter last name"
                                    type="text"
                                    className="login__input"
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
                            className="login__input"
                            required />
                    </div>
                    <div className="form__item">
                        <RiLockPasswordLine className="form__icon" />
                        <input
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => (setPassword(e.target.value))}
                            placeholder="Enter password"
                            type="password"
                            className="login__input"
                            required />
                    </div>
                    {type == "login" ?
                        <button onClick={() => {
                            setLoading(true)
                            setDemo1Loading(false)
                            setDemo2Loading(false)
                        }} type="submit" className="login__button">
                            {loading ? <LoadingSpinner type="button" /> : "Login"}
                        </button>
                        :
                        <button onClick={() => { setLoading(true) }} type="submit" className="login__button">
                            {loading ? <LoadingSpinner type="button" /> : "Sign up"}
                        </button>
                    }
                    {type == "login" ?
                        <div className="demouser__buttons">
                            <button onClick={
                                () => {
                                    setDemo1Loading(true)
                                    setEmail("testuser1@gmail.com")
                                    setPassword("test")
                                }
                            } className="demouser__button demouser__button1">
                                {demo1Loading ? <LoadingSpinner type="button" /> : "Demo User 1"}
                            </button>
                            <button className="demouser__button demouser__button2"
                                onClick={
                                    () => {
                                        setDemo2Loading(true)
                                        setEmail("testuser2@gmail.com")
                                        setPassword("test")
                                    }
                                }
                            >
                                {demo2Loading ? <LoadingSpinner type="button" /> : "Demo User 2"}
                            </button>
                        </div> :
                        <></>}
                </form>
                {type == "login" ?
                    <div className="signup">
                        <span>Don&apos;t have an account?</span>
                        <Link href="/signup" className="sign__link"> Sign up</Link>
                    </div>
                    :
                    <div>
                        <div className="signup">
                            <span>Already have an account?</span>
                            <Link href="/signIn" className="sign__link"> Sign in</Link>
                        </div>
                    </div>
                }
            </div>
        </div>)
}