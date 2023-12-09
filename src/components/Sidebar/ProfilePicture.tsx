import React, {
    SetStateAction,
    Dispatch
} from 'react'
import Image from 'next/image'
import { BsCamera } from 'react-icons/bs';
import defaultImage from "../../../public/default.png"

interface Props {
    image: any,
    changeImage: Dispatch<SetStateAction<any>>,
    name?: string
}
export default function ProfilePicture({
    image,
    changeImage,
    name
}: Props) {
    return (
        <div className="sidebar__profile">
            <div className="sidebar__profile__picture">
                <div className="profile__im__container">
                    <Image fill className="default__image" src={image ? image : defaultImage} alt="Default Picture" />
                </div>
                <input onChange={changeImage} type="file" accept="image/*" id="file" />
                <label className="upload__image" htmlFor='file'><BsCamera className="camera" /></label>
            </div>
            <div className="sidebar__profile__name">
                {name}
            </div>
        </div>
    )
}
