import React, {
    Dispatch,
    SetStateAction
} from 'react'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

interface Props {
    type: string
    loading: boolean
    setLoading: Dispatch<SetStateAction<boolean>>
    setDemo1Loading: Dispatch<SetStateAction<boolean>>
    setDemo2Loading: Dispatch<SetStateAction<boolean>>
}
export default function FormLoginButton({
    type,
    loading,
    setLoading,
    setDemo1Loading,
    setDemo2Loading
}: Props) {
    return (
        type == "login" ?
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
    )
}
