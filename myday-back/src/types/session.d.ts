import session from "express-session";

// Define the user object in session
declare module "express-session" {
    interface SessionData {
        user: {
            id: string;
            username: string;
            feelings: string[]
        };
    }
}