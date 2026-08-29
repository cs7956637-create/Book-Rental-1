import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import "./Auth.css";

const Register = () => {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);


    const handleRegister = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response = await axios.post(
                "http://localhost:3000/auth/register",
                {
                    name,
                    email,
                    password
                }
            );


            alert(
                response.data.message ||
                "Registration successful"
            );


            navigate("/login");


        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Registration failed"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="auth-page">

            <div className="auth-container">


                {/* LEFT */}

                <div className="auth-info">

                    <div className="brand">
                        📚 BookRent
                    </div>

                    <div className="auth-info-content">

                        <span>
                            START READING
                        </span>

                        <h1>
                            Thousands of
                            <br />
                            stories.
                            <br />
                            One library.
                        </h1>

                        <p>
                            Create your account and
                            discover books you can read
                            for only ₹20 per day.
                        </p>

                    </div>

                </div>


                {/* RIGHT */}

                <div className="auth-form-section">

                    <div className="auth-form-box">

                        <div className="mobile-brand">
                            📚 BookRent
                        </div>

                        <h2>
                            Create your account 🚀
                        </h2>

                        <p className="auth-subtitle">
                            Join our digital library today.
                        </p>


                        <form
                            onSubmit={handleRegister}
                        >


                            <div className="auth-input">

                                <label>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) =>
                                        setName(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>


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
                                    placeholder="Create a password"
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
                                    ? "Creating account..."
                                    : "Create Account"
                                }

                            </button>

                        </form>


                        <p className="auth-switch">

                            Already have an account?

                            <Link to="/login">
                                Login
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default Register;