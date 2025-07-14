import { Link } from 'react-router-dom';
import Logo from './atoms/Logo';

interface IProps {
    logout: () => void;
}

const Navbar = (props: IProps) => {
    return (
        <nav className="navbar bg-primary text-white px-6">
            <Logo />
            <ul className="menu menu-horizontal px-1 space-x-4">
                <li><Link to="/">Accueil</Link></li>
                <li><Link to="/history">Statistiques</Link></li>
                <li><a href='#' onClick={props.logout}>Déconnexion</a></li>
            </ul>
        </nav >
    );
}

export default Navbar;
