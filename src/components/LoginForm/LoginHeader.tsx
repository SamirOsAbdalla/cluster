import React from 'react'

interface Props {
    type: string
}

export default function LoginHeader({
    type
}: Props) {

    return (type == "login" ?
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
    )
}
