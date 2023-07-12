import GroupTable from "@/components/GroupTable/GroupTable"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SessionProvider } from "next-auth/react"
describe("Group Table", () => {

    describe("New Group Modal", () => {
        it("Click on new group button and render the modal", async () => {
            render(
                <SessionProvider>
                    <GroupTable />
                </SessionProvider>
            )
            const newGroupButton = screen.getByRole("button", { name: "New Group" })
            await userEvent.click(newGroupButton)
            const createGroupButton = screen.getByRole("button", { name: "Create Group" })
            expect(createGroupButton).toBeInTheDocument()
        })
    })

    describe("Group Detail Modal", () => {
        it("Click on gear and display group information", async () => {
            render(
                <SessionProvider>
                    <GroupTable />
                </SessionProvider>
            )
            const groupDisplayItem = await screen.findByTestId("grouptable__gear")
            await userEvent.click(groupDisplayItem)
            const submitButton = screen.getByRole("button", { name: "Submit" })
            expect(submitButton).toBeInTheDocument()
        })
    })

    describe("Leave Group Modal", () => {
        it("Click on trash and display leave group modal", async () => {
            render(
                <SessionProvider>
                    <GroupTable />
                </SessionProvider>
            )
            const leaveGroupModal = await screen.findByTestId("grouptable__leave")
            await userEvent.click(leaveGroupModal)
            const leaveButton = screen.getByRole("button", { name: "Leave" })
            expect(leaveButton).toBeInTheDocument()
        })
    })
})