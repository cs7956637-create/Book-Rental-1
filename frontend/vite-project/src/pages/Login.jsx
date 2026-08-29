import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import "./Auth.css";

const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);


    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response = await axios.post(
                "https://book-rental-backend-ywuy.onrender.com/auth/login",
                {
                    email,
                    password
                }
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            alert("Login successful");

            navigate("/");

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Login failed"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="auth-page">

            <div className="auth-container">


                {/* LEFT SIDE */}

                <div className="auth-info">

                    <div className="brand">
                        📚 BookRent
                    </div>

                    <div className="auth-info-content">

                        <span>
                            DIGITAL LIBRARY
                        </span>

                        <h1>
                            Your next
                            <br />
                            great read
                            <br />
                            is waiting.
                        </h1>

                        <p>
                            Access amazing books for
                            just ₹20 per day. Read anytime,
                            anywhere.
                        </p>

                    </div>

                </div>


                {/* RIGHT SIDE */}

                <div className="auth-form-section">

                    <div className="auth-form-box">

                        <div className="mobile-brand">
                            📚 BookRent
                        </div>

                        <h2>
                            Welcome back 👋
                        </h2>

                        <p className="auth-subtitle">
                            Login to continue reading.
                        </p>


                        <form
                            onSubmit={handleLogin}
                        >

                            <div className="auth-input">

                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>


                            <div className="auth-input">

                                <label>
                                    Password
                                </label>

                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>


                            <button
                                className="auth-button"
                                type="submit"
                                disabled={loading}
                            >

                                {loading
                                    ? "Logging in..."
                                    : "Login"
                                }

                            </button>

                        </form>


                        <p className="auth-switch">

                            Don't have an account?

                            <Link to="/register">
                                Create account
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default Login;