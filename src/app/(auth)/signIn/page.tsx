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
import LoginForm from "@/components/LoginForm/LoginForm"

export default function SignIn() {
    return (
        <LoginForm type="login" />
    )
}