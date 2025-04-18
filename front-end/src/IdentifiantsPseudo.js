import React, { useState } from 'react';
import './styles/Home.css';
import './styles/Mobile.css';
import { Link } from 'react-router-dom';


function Identifiants() {
    const[mail, setMail]=useState("")
    const[password, setPassword]=useState("")
    const[pseudo, setPseudo]=useState("")
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData={
            mail,
            password
        }

        try {
            const API_URL =
                window.location.hostname === "localhost"
                    ? "http://localhost:4000"
                    : "https://myday-back.onrender.com";

            const response = await fetch(`${API_URL}/IdentifiantsPseudo`,{  
                method:"POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
                credentials: 'include'
            })

            const data = await response.json()
            console.log("Réponse du serveur :", data);

            if (data.success) {
                setErrorMessage("");
                setPseudo(data.pseudo);  // Réponse du backend avec le pseudo
                
            } else {
                setErrorMessage("Identifiants incorrects, veuillez réessayer.");
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi :", error);
            setErrorMessage("Erreur lors de la demande, veuillez réessayer.");
        }
    }
    // const [pseudo, setPseudo] = useState('');
    // const [password, setPassword] = useState('');

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    
    //     // Ici, tu peux envoyer les données au backend ou gérer la logique de création du compte
    //     const userData = {
    //       pseudo,
    //       password,
    //     };
        
    //     console.log('User Data:', userData);
    //     // Effectuer l'envoi de ces données à l'API ou base de données

    //     try {
    //         // const API_URL=process.env.REACT_APP_API_URL || "http://localhost:4000";

    //         // const API_URL="https://myday-back.onrender.com";
    //         // const API_URL = "http://localhost:4000";
    //         const API_URL =
    //             window.location.hostname === "localhost"
    //                 ? "http://localhost:4000"
    //                 : "https://myday-back.onrender.com";
                    
            

    //         const response = await fetch(`${API_URL}/Login`, {
    //         // const response = await fetch("http://localhost:4000/Login", {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify(userData),
    //             credentials: 'include'
    //         });
    
    //         const data = await response.json();
    //         console.log("Réponse du serveur :", data);
    
    //         if (data.success) {
    //             window.location.href = data.redirectUrl;
    //         }
    //     } catch (error) {
    //         console.error("Erreur lors de l'envoi :", error);
    //     }
    //   };

    return (
        <div className="container">
            <div className="header">
            <h1>
                <span>M</span><span>y</span><span>D</span><span>a</span><span>y</span>
                </h1>
            </div >
            
            <h5>Pseudo oublié :</h5>
            <form onSubmit={handleSubmit}>
                <h4>
                    <label htmlFor="mail" >Mail: </label>
                    <input className="login-input"
                    type="mail"
                    id="mail"
                    name="mail"
                    value={mail}
                    onChange={(e) => {setMail(e.target.value)
                    setErrorMessage("");
                    }  
                }
                    
                    required
                    placeholder=""
                    />
                </h4>
                <h4>
                    <label htmlFor="password" >Mot de passe : </label>
                    <input className="login-input"
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder=""
                    />
                </h4>
             <button type="button" className="submit-button" onClick={handleSubmit}>
                  Valider
              </button>   
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            
            {pseudo && (
                <div>
                    <div className='h4-pseudo'>
                    Ton pseudo est : <strong>{pseudo}</strong>
                    </div>
                </div>
            )}
          

            <hr className="hr" />
            <Link to="/Login">
              <button type="button" className="submit-button">
                  Connexion
              </button>
             </Link>
             <p className ="droits">© 2025 myDay. Tous droits réservés.
             Cette application, ainsi que l’ensemble de son contenu, est protégée par les lois en vigueur relatives à la propriété intellectuelle. Les données qu’elle contient sont chiffrées afin d’en garantir la sécurité. </p>   
        </div>
    );
}

export default Identifiants;
