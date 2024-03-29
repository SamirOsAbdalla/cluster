import GroupTable from "@/components/GroupTable/GroupTable"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SessionProvider } from "next-auth/react"
import { useState } from "react"
import { waitFor } from "@testing-library/react";
jest.mock('next/navigation', () => ({
    ...require('next-router-mock'),
    useSearchParams: () => jest.fn(),
}));


describe("Group Table", () => {

    describe("New Group Modal", () => {

        it("Click on new group button and render the modal", async () => {

            const loading: boolean = false;
            const setLoading = jest.fn()
            const setFetchGroup = jest.fn()
            render(
                <SessionProvider>
                    <GroupTable loading={loading} setLoading={setLoading} setFetchGroup={setFetchGroup} />
                </SessionProvider>
            )
            const newGroupButton = await waitFor(() => screen.getByRole("button", { name: "New Group" }))

            await userEvent.click(newGroupButton)
            const createGroupButton = screen.getByRole("button", { name: "Submit" })
            expect(createGroupButton).toBeInTheDocument()
        })
    })

    describe("Leave Group Modal", () => {
        it("Click on leave and display leave group modal", async () => {

            const loading: boolean = false;
            const setLoading = jest.fn()
            const setFetchGroup = jest.fn()
            render(
                <SessionProvider>
                    <GroupTable loading={loading} setLoading={setLoading} setFetchGroup={setFetchGroup} />
                </SessionProvider>
            )
            const leaveGroupModal = await screen.findByTestId("grouptable__leave")
            await userEvent.click(leaveGroupModal)
            const leaveButton = await waitFor(() => screen.findByTestId("modal__leavebutton"))
            expect(leaveButton).toBeInTheDocument()
        })
    })
})