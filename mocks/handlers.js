import { rest } from "msw";

export const handlers = [
    rest.get("/api/auth/session", (req, res, ctx) => {
        return res(ctx.json({
            user: {
                name: "TestName",
                email: "test@gmail.com"
            }

        }))
    }),
    rest.post("/api/groups/findGroups", (req, res, ctx) => {
        return res(ctx.json([{
            name: "Test Group",
            creator: {
                memberEmail: "testuser@gmail.com",
                memberName: "TestUser"
            },
            description: "This is a test group",
            members: [],
            dateCreated: new Date()
        }]))
    }),
    rest.post("/api/inbox/removeInvitation", (req, res, ctx) => {
        return res(ctx.json({}))
    }),
    rest.post("/api/inbox/fetchInbox", (req, res, ctx) => {
        return res(ctx.json(
            {
                inboxItems: [{
                    groupName: "Test Group",
                    senderEmail: "test@gmail.com",
                    senderName: "TestInboxUser",
                    groupId: "123456789",
                    _id: "123456789"
                }],
                userEmail: "testuser@gmail.com"
            }
        ))
    }),
]