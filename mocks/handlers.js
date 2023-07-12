import { rest } from "msw";

export const handlers = [
    rest.put("http://localhost:3000/api/findGroups", (req, res, ctx) => {
        return res(ctx.json([{}]))
    }),
    rest.get("http://localhost/api/auth/session", (req, res, ctx) => {
        return res(ctx.json({
            user: {
                name: "TestName",
                email: "test@gmail.com"
            }

        }))
    }),
    rest.post("http://localhost:3000/api/findGroups", (req, res, ctx) => {
        return res(ctx.json([{
            name: "Test Group",
            creator: {
                memberEmail: "testuser@gmail.com",
                memberName: "TestUser"
            },
            description: "This is a test group",
            members: [],
            tasks: [],
            dateCreated: new Date()
        }]))
    }),
    rest.post("http://localhost:3000/api/removeInvitation", (req, res, ctx) => {
        return res(ctx.json({}))
    }),
    rest.post("http://localhost:3000/api/fetchInbox", (req, res, ctx) => {
        return res(ctx.json([{
            groupName: "Test Group",
            senderEmail: "test@gmail.com",
            senderName: "TestInboxUser",
            groupId: "123456789",
            _id: "123456789"
        }]))
    }),
]