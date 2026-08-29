import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
const Navbar = () => {

    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);

    const token =
        localStorage.getItem("token");

    const role =
        localStorage.getItem("role");


    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("role");

        navigate("/login");

    };


    return (

        <nav className="navbar">

            {/* LOGO */}

            <Link
                to="/"
                className="logo"
            >
                📚 BookRent
            </Link>


            {/* DESKTOP MENU */}

            <div className="nav-links">

                <Link to="/">
                    Home
                </Link>


                {token && (

                    <Link to="/my-books">
                        My Books
                    </Link>

                )}


                {/* ADMIN ONLY */}

                {token && role === "admin" && (

                    <Link
                        to="/admin"
                        className="admin-link"
                    >
                        Dashboard
                    </Link>

                )}


                {!token ? (

                    <>

                        <Link
                            to="/login"
                            className="login-link"
                        >
                            Login
                        </Link>


                        <Link
                            to="/register"
                            className="register-link"
                        >
                            Register
                        </Link>

                    </>

                ) : (

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                )}

            </div>


            {/* MOBILE BUTTON */}

            <button
                className="menu-btn"
                onClick={() =>
                    setMenuOpen(!menuOpen)
                }
            >
                ☰
            </button>


            {/* MOBILE MENU */}

            {menuOpen && (

                <div className="mobile-menu">

                    <Link
                        to="/"
                        onClick={() =>
                            setMenuOpen(false)
                        }
                    >
                        Home
                    </Link>


                    {token && (

                        <Link
                            to="/my-books"
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        >
                            My Books
                        </Link>

                    )}


                    {token &&
                        role === "admin" && (

                        <Link
                            to="/admin"
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        >
                            Dashboard
                        </Link>

                    )}


                    {!token ? (

                        <>

                            <Link
                                to="/login"
                                onClick={() =>
                                    setMenuOpen(false)
                                }
                            >
                                Login
                            </Link>


                            <Link
                                to="/register"
                                onClick={() =>
                                    setMenuOpen(false)
                                }
                            >
                                Register
                            </Link>

                        </>

                    ) : (

                        <button
                            onClick={() => {

                                setMenuOpen(false);

                                handleLogout();

                            }}
                        >
                            Logout
                        </button>

                    )}

                </div>

            )}

        </nav>

    );

};

export default Navbar;