import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IErrorResponse } from "../models/Model";
import ErrorLabel from "./atoms/ErrorLabel";
interface Response {
    redirectUrl: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();

    const [pseudo, setPseudo] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const login = async (): Promise<Response> => {
        const user = {
            password: password,
            pseudo: pseudo
        }
        const API_URL = `${window.location.protocol + '//' + window.location.host}`
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
            credentials: 'include'
        });

        const data = await response.json();
        if (response.ok) {
            return data as Response;
        } else {
            const error = data as IErrorResponse;
            setError(error.errorMessage);
            throw new Error(error.errorMessage);
        }
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        login()
            .then((response) => { navigate(response.redirectUrl) })
    };

    return (
        <div className='min-h-screen flex flex-col items-center justify-center px-4'>

            <div className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-xl rounded-xl p-8 dark:bg-neutral/80 transition duration-300 ease-in-out">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Bienvenue 👋</h1>
                    <p className="text-sm text-gray-500 mt-2 dark:text-gray-300">Connecte-toi à ton compte</p>
                </div>

                <ErrorLabel message={error} />

                <form onSubmit={handleSubmit}>
                    <div className="form-control mb-5">
                        <label className="label">
                            <span className="label-text text-gray-700 dark:text-gray-200">Pseudo</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered input-md w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="John"
                            value={pseudo}
                            onChange={(e) => setPseudo(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-control mb-6">
                        <label className="label">
                            <span className="label-text text-gray-700 dark:text-gray-200">Mot de passe</span>
                        </label>
                        <input
                            type="password"
                            className="input input-bordered input-md w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label className="label justify-end mt-2 ">
                            <a href="#" className="text-sm text-primary hover:underline">Mot de passe oublié ?</a>
                        </label>
                    </div>

                    <button type="submit" className="btn btn-primary w-full text-white tracking-wide font-semibold">
                        Connexion
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-300">
                    Pas encore de compte ? <a href="/register" className="link link-primary">Créer un compte</a>
                </div>
            </div>
        </div>
    );
};

export default Login;