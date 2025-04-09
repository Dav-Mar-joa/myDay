import React from 'react';
import { useNavigate } from 'react-router-dom';

function SettingsButton() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/Settings');
    };
    // const handleLogout = async () => {
    //     try {
    //         const API_URL =
    //             window.location.hostname === "localhost"
    //                 ? "http://localhost:4000"
    //                 : "https://myday-back.onrender.com";
                    
    //         const response = await fetch(`${API_URL}/logout`, {
    //         // const response = await fetch('http://localhost:4000/logout', {
    //             method: 'POST',
    //             credentials: 'include',  // Pour inclure les cookies de session dans la requête
    //         });

    //         const data = await response.json();
    //         console.log(data.message);  // Vous pouvez afficher un message ou gérer la réponse

    //         // Redirection après déconnexion
    //         navigate('/Login');  // Utilisation de react-router pour la redirection
    //     } catch (error) {
    //         console.error('Erreur lors de la déconnexion:', error);
    //     }
    // };

    return (

        <button type="button" className="submit-button-settings" onClick={handleClick}>
            <img src="/settings.png" alt="Logout" className="settings-icon" />
        </button>
    );
}

export default SettingsButton;
