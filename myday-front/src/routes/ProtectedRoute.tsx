

import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { IUser } from "../models/Model";
import BaseLayout from "../pages/layout/BaseLayout";

const ProtectedRoute: React.FC = () => {

    const navigate = useNavigate();
    const [user, setUser] = useState<IUser>({ _id: "0", username: "ooo", feelings: [] });
    const [loading, setLoading] = useState<boolean>(true);

    const logout = async () => {
        const API_URL = `${window.location.protocol + '//' + window.location.host}`
        const response = await fetch(`${API_URL}/api/logout`, {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
            navigate('/login');
        }
    }

    useEffect(() => {
        setLoading(true)
        const API_URL = `${window.location.protocol + '//' + window.location.host}`
        fetch(`${API_URL}/api/check-auth`, {
            credentials: 'include',
        })
            .then(res => {
                if (res.ok) return res.json();
                else throw new Error(res.statusText)
            }
            ).then(user => {
                setUser(user.user as IUser);
                setLoading(false);
            })
            .catch(() => navigate('/login', { replace: true }));
    }, []);


    return (
        <BaseLayout logout={logout} >
            <Outlet context={{ loading, user, logout }} />
        </BaseLayout>

    );
};

export default ProtectedRoute;