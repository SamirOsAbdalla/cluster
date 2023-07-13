import { rest } from "msw";

export const handlers = [
    rest.get("http://localhost/api/auth/session", (req, res, ctx) => {
        return res(ctx.json({
            user: {
                name: "TestName",
                email: "test@gmail.com"
            }

        }))
    }),
    rest.post("http://localhost:3000/api/groups/findGroups", (req, res, ctx) => {
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
    rest.post("http://localhost:3000/api/inbox/removeInvitation", (req, res, ctx) => {
        return res(ctx.json({}))
    }),
    rest.post("http://localhost:3000/api/inbox/fetchInbox", (req, res, ctx) => {
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