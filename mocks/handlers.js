import { rest } from "msw";

export const handlers = [
    rest.put("http://localhost:3000/api/findProjects", (req, res, ctx) => {
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
    rest.post("http://localhost:3000/api/findProjects", (req, res, ctx) => {
        return res(ctx.json([{
            name: "Test Project",
            creator: {
                memberEmail: "testuser@gmail.com",
                memberName: "TestUser"
            },
            description: "This is a test project",
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
            projectName: "Test Project",
            senderEmail: "test@gmail.com",
            senderName: "TestInboxUser",
            projectId: "123456789",
            _id: "123456789"
        }]))
    }),
]