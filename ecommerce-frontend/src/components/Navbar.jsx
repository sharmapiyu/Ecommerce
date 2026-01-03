import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/products" className="navbar-brand">
                    E-Commerce Store
                </Link>

                <div className="navbar-menu">
                    {user ? (
                        <>
                            <Link to="/products" className="nav-link">Products</Link>
                            <Link to="/orders" className="nav-link">My Orders</Link>
                            {isAdmin() && (
                                <Link to="/admin" className="nav-link admin-link">Admin Panel</Link>
                            )}
                            <span className="nav-user">Welcome, {user.username}</span>
                            <button onClick={handleLogout} className="btn btn-logout">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-link">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
