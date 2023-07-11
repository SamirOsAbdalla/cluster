import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import InboxItem from "@/components/InboxItem/InboxItem"
import Inbox from "@/app/inbox/page"
import { SessionProvider } from "next-auth/react"
describe("Inbox", () => {
    it("Click on new project button and render the modal", async () => {
        const testFunction: any = () => {
        }
        render(
            <SessionProvider>
                <Inbox />
            </SessionProvider>
        )
        const rejectButton = await screen.findByTestId("reject__button")
        await userEvent.click(rejectButton)

        await waitFor(() => expect(screen.queryByTestId("reject__button")).not.toBeInTheDocument())
    })
})