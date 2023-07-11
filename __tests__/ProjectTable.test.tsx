import ProjectTable from "@/components/ProjectTable/ProjectTable"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SessionProvider } from "next-auth/react"
describe("Project Table", () => {

    describe("New Project Modal", () => {
        it("Click on new project button and render the modal", async () => {
            render(
                <SessionProvider>
                    <ProjectTable />
                </SessionProvider>
            )
            const newProjectButton = screen.getByRole("button", { name: "New Project" })
            await userEvent.click(newProjectButton)
            const createProjectButton = screen.getByRole("button", { name: "Create Project" })
            expect(createProjectButton).toBeInTheDocument()
        })
    })

    describe("Project Detail Modal", () => {
        it("Click on gear and display project information", async () => {
            render(
                <SessionProvider>
                    <ProjectTable />
                </SessionProvider>
            )
            const projectDisplayItem = await screen.findByTestId("projecttable__gear")
            await userEvent.click(projectDisplayItem)
            const submitButton = screen.getByRole("button", { name: "Submit" })
            expect(submitButton).toBeInTheDocument()
        })
    })

    describe("Leave Project Modal", () => {
        it("Click on trash and display leave project modal", async () => {
            render(
                <SessionProvider>
                    <ProjectTable />
                </SessionProvider>
            )
            const leaveProjectModal = await screen.findByTestId("projecttable__leave")
            await userEvent.click(leaveProjectModal)
            const leaveButton = screen.getByRole("button", { name: "Leave" })
            expect(leaveButton).toBeInTheDocument()
        })
    })
})