import express, { NextFunction, Request, Response } from 'express';
import session from "express-session";
import cookieParser from "cookie-parser";
import { connectToMongo } from './model/Database';
import cors from 'cors';
import path from 'path';
import logger from '@/Logger';

// Router
import registerRouter from './routes/register.routes';
import usersRouter from './routes/users.routes';
import loginRouter from './routes/login.routes';
import logoutRouter from './routes/logout.routes';
import authRouter from './routes/authentification.route';
import authenticated from './middleware/Authenticate';

// Configure server
export const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(cors({
        credentials: true,
        origin: '*', // frontend URL
    }));
} else {
    app.use(cors({
        credentials: true,
        origin: '*', // Need to update this Line with good deployment
    }));
}

// Use this configuration in development
const sessionMiddleware = session({
    secret: process.env.JWT_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax'
    },
});
app.use(sessionMiddleware);


app.use('/api', (req, res, next) => {
    logger.info(`${req.method} - ${req.originalUrl}`);
    next();
});

app.use("/api/login", loginRouter);
app.use("/api/logout", authenticated, logoutRouter);
app.use("/api/register", registerRouter);
app.use("/api/check-auth", authRouter);
app.use("/api/user", authenticated, usersRouter);

//, PUT the correct route for this
app.use(express.static(path.join(__dirname, 'public')));

// Error manager
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (error) {
        logger.error(error)
        res.status(500).json({ error: 'Erreur serveur' });
    }
});


const port = process.env.PORT || 4000;
connectToMongo().then(() => app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`)

}));
