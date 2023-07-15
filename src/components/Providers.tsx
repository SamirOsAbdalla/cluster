"use client"


import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react"
import QueryProvider from "./QueryProvider";
interface Props {
    children: ReactNode
}

const Providers = ({ children }: Props) => {

    return (
        <QueryProvider>
            <SessionProvider>
                {children}
            </SessionProvider>
        </QueryProvider>
    )
}

export default Providers