import React, {
    Dispatch,
    SetStateAction
} from 'react'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

interface Props {
    type: string,
    demo1Loading: boolean,
    demo2Loading: boolean,
    setDemo1Loading: Dispatch<SetStateAction<boolean>>,
    setDemo2Loading: Dispatch<SetStateAction<boolean>>,
    setEmail: Dispatch<SetStateAction<string>>
    setPassword: Dispatch<SetStateAction<string>>
}
export default function ({
    type,
    demo1Loading,
    demo2Loading,
    setEmail,
    setDemo1Loading,
    setDemo2Loading,
    setPassword
}: Props) {
    return (
        type == "login" ?
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
            <></>
    )
}
