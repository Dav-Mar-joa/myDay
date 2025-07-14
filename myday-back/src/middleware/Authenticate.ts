import { NextFunction, Request, Response } from "express";

const authenticated = (request: Request, response: Response, next: NextFunction) => {
    if (request.session && request.session.user) {
        return next();
    } else {
        return response.redirect("/login");
    }
}

export default authenticated;