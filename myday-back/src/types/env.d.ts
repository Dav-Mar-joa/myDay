declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';
        PORT: number;
        MONGODB_URI: string,
        MONGODB_USERNAME: string,
        MONGODB_PASSWORD: string,
        MONGODB_DBNAME: string,

        JWT_SECRET: string,
        SECRET_KEY: string
    }
}