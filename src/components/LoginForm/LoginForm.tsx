"use client"
import "./LoginForm.css"
import {
    useState,
    useEffect
} from "react"
import { signIn } from "next-auth/react"
import Link from 'next/link'
import { useRouter } from "next/navigation"
import UserModel from "@/lib/mongo/models/UserModel"
import ErrorMessage from "../ErrorMessage/ErrorMessage"
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner"
import { FaUserAstronaut } from "react-icons/fa"
import LoginHeader from "./LoginHeader"
import FormInputs from "./FormInputs"
import LoginFooter from "./LoginFooter"
import DemoButtons from "./DemoButtons"
import FormLoginButton from "./FormLoginButton"


interface LoginProps {
    type: string
}

const useLoginForm = () => {
    const [email, setEmail] = useState<string>("")
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    useEffect(() => {
        setError("")
    }, [])

    return {
        email,
        setEmail,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        error,
        setError,
        password,
        setPassword
    }
}

const useLoading = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [demo1Loading, setDemo1Loading] = useState<boolean>(false)
    const [demo2Loading, setDemo2Loading] = useState<boolean>(false)

    return {
        loading,
        setLoading,
        demo1Loading,
        setDemo1Loading,
        demo2Loading,
        setDemo2Loading
    }
}
export default function LoginForm({ type }: LoginProps) {
    const router = useRouter()

    let {
        loading,
        setLoading,
        demo1Loading,
        setDemo1Loading,
        demo2Loading,
        setDemo2Loading
    } = useLoading()

    let {
        email,
        setEmail,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        error,
        setError,
        password,
        setPassword
    } = useLoginForm()

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

                <LoginHeader
                    type={type}
                />
                <form onSubmit={handleSubmit} className="login__form">
                    <FormInputs
                        type={type}
                        firstName={firstName} setFirstName={setFirstName}
                        lastName={lastName} setLastName={setLastName}
                        email={email} setEmail={setEmail}
                        password={password} setPassword={setPassword}
                    />
                    <FormLoginButton
                        type={type}
                        loading={loading}
                        setLoading={setLoading}
                        setDemo1Loading={setDemo1Loading}
                        setDemo2Loading={setDemo2Loading}
                    />
                    <DemoButtons
                        type={type}
                        setEmail={setEmail}
                        setDemo1Loading={setDemo1Loading}
                        setDemo2Loading={setDemo2Loading}
                        demo1Loading={demo1Loading}
                        demo2Loading={demo2Loading}
                        setPassword={setPassword}
                    />
                </form>
                <LoginFooter
                    type={type}
                />
            </div>
        </div>)
}