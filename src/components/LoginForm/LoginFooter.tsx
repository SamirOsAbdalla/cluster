import React from 'react'
import Link from 'next/link'
interface Props {
    type: string
}
export default function LoginFooter({
    type
}: Props) {
    return (
        type == "login" ?
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
    )
}
