"use client"

import "./EditGroupModal.css"
import { AiFillCloseCircle } from "react-icons/ai";
import { Dispatch, SetStateAction, useState } from "react";

import React from 'react'
import { GroupInterface } from "@/lib/mongo/models/GroupModel";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

interface Props {
    editGroupModalStatus: "open" | "closed"
    setEditGroupModalStatus: Dispatch<SetStateAction<"open" | "closed">>
    groups: GroupInterface[]
    setGroups: Dispatch<SetStateAction<GroupInterface[]>>
    currentGroup: GroupInterface | null
}
export default function EditGroupModal({ groups, setGroups, editGroupModalStatus, setEditGroupModalStatus, currentGroup }: Props) {
    let typecastedGroup = currentGroup as GroupInterface
    const [nameInputValue, setNameInputValue] = useState<string>("")
    const [descriptionInputValue, setDescriptionInputValue] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const editGroup = async () => {
        if (nameInputValue == "" && descriptionInputValue == "") {
            setEditGroupModalStatus("closed")
            return;
        }
        setLoading(true)
        const editButton = document.querySelector(".editgroupmodal__button__save") as HTMLButtonElement
        const cancelButton = document.querySelector(".editgroupmodal__button__cancel") as HTMLButtonElement
        editButton.disabled = true;
        cancelButton.disabled = true;
        let groupId: string = typecastedGroup._id!
        let didNameChange = nameInputValue == "" ? false : true
        let didDescriptionChange = descriptionInputValue == "" ? false : true
        let newName = nameInputValue
        let newDescription = descriptionInputValue
        const editGroupBody = {
            groupId,
            didNameChange,
            didDescriptionChange,
            newName,
            newDescription
        }

        const editGroupResponse = await fetch("http://localhost:3000/api/groups/editGroup", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editGroupBody),
        });

        const editGroupResponseJSON = await editGroupResponse.json()
        if (editGroupResponseJSON) {
            let editedGroups = groups
            editedGroups.forEach(group => {
                if (group._id == currentGroup?._id) {
                    if (didNameChange) {
                        group.name = nameInputValue
                    }
                    if (didDescriptionChange) {
                        group.description = descriptionInputValue
                    }
                }
            })
            setGroups(editedGroups)
            setEditGroupModalStatus("closed")
            setLoading(false)
            editButton.disabled = false;
            cancelButton.disabled = false;
        } else {
            setLoading(false)
            editButton.disabled = false;
            cancelButton.disabled = false;
            //handle error
        }
    }
    return (
        <div className="editgroupmodal__wrapper">
            <AiFillCloseCircle onClick={() => setEditGroupModalStatus("closed")} className="editgroupmodal__close" />

            <div className="editgroupmodal__heading">
                <p>Edit Group</p>
            </div>

            <div className="editgroupmodal__fields">
                <div className="editgroupmodal__field">
                    <div className="editgroup__text">
                        Project Name
                    </div>
                    <input
                        value={nameInputValue}
                        onChange={(e) => setNameInputValue(e.target.value)}
                        className="editgroupmodal__input editgroupmodal__input__name"
                        type="text"
                        placeholder={`${typecastedGroup?.name}`}
                    />
                </div>
                <div className="editgroupmodal__field">
                    <div className="editgroup__text">
                        Project Description
                    </div>
                    <input
                        value={descriptionInputValue}
                        onChange={(e) => setDescriptionInputValue(e.target.value)}
                        className="editgroupmodal__input editgroupmodal__input__description"
                        type="text"
                        placeholder={`${typecastedGroup?.description}`}
                    />
                </div>
            </div>
            <div className="editgroupmodal__buttons">
                <button onClick={editGroup} className="editgroupmodal__button editgroupmodal__button__save">
                    {loading ? <LoadingSpinner type="button" /> : "Save"}
                </button>
                <button onClick={() => setEditGroupModalStatus("closed")} className="editgroupmodal__button editgroupmodal__button__cancel">
                    Cancel
                </button>
            </div>
        </div>
    )
}
