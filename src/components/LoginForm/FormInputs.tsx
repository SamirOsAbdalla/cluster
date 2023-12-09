import React, {
    Dispatch,
    SetStateAction
} from 'react'
import { BsPerson } from 'react-icons/bs'
import { AiOutlineMail } from 'react-icons/ai'
import { RiLockPasswordLine } from 'react-icons/ri'
import FormItem from './FormItem'


interface Props {
    type: string,
    firstName: string,
    setFirstName: Dispatch<SetStateAction<string>>,
    lastName: string,
    setLastName: Dispatch<SetStateAction<string>>,
    email: string,
    setEmail: Dispatch<SetStateAction<string>>,
    password: string,
    setPassword: Dispatch<SetStateAction<string>>
}

export default function FormInputs({
    type,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword
}: Props) {

    return (
        <div className="form__items">
            {type == "login" ?
                <></>
                :
                <div className="form__top">
                    <FormItem
                        value={firstName}
                        inputType='text'
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => (setFirstName(e.target.value))}
                        icon={<BsPerson className="form__icon" />}
                        placeholder='Enter first name'
                    />
                    <FormItem
                        value={lastName}
                        inputType='text'
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => (setLastName(e.target.value))}
                        icon={<BsPerson className="form__icon" />}
                        placeholder='Enter last name'
                    />
                </div>
            }
            <FormItem
                value={email}
                inputType='email'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => (setEmail(e.target.value))}
                icon={<AiOutlineMail className="form__icon" />}
                placeholder='Enter email'
            />
            <FormItem
                value={password}
                inputType='password'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => (setPassword(e.target.value))}
                icon={<RiLockPasswordLine className="form__icon" />}
                placeholder='Enter password'
            />
        </div>

    )
}
