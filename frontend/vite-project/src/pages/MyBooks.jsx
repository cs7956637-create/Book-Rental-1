import { useEffect, useState } from "react";
import axios from "axios";
import "./MyBooks.css";
import { useNavigate } from "react-router-dom";

const MyBooks = () => {

    const navigate = useNavigate();

    const [rentals, setRentals] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ==========================
    // GET MY BOOKS
    // ==========================

    const getMyBooks = async () => {

        try {

            const token =
                localStorage.getItem("token");


            if (!token) {

                navigate("/login");

                return;

            }


            const response =
                await axios.get(

                    "http://localhost:3000/rental/my-books",

                    {
                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }

                );


            setRentals(response.data);


        } catch (error) {

            console.log(error);

            setError(

                error.response
                    ?.data
                    ?.message ||

                "Unable to load your books"

            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        getMyBooks();

    }, []);


    // ==========================
    // CHECK EXPIRY
    // ==========================

    const isActive = (expiryTime) => {

        return new Date(expiryTime) > new Date();

    };


    // ==========================
    // LOADING
    // ==========================

    if (loading) {

        return (

            <div className="mybooks-page">

                <div className="loading-box">

                    <div className="spinner"></div>

                    <h3>
                        Loading your books...
                    </h3>

                </div>

            </div>

        );

    }


    // ==========================
    // ERROR
    // ==========================

    if (error) {

        return (

            <div className="mybooks-page">

                <div className="error-box">

                    <h2>
                        Something went wrong
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={getMyBooks}
                    >
                        Try Again
                    </button>

                </div>

            </div>

        );

    }


    return (

        <div className="mybooks-page">


            {/* =========================
                HEADER
            ========================= */}

            <div className="mybooks-header">

                <div>

                    <p className="small-title">
                        YOUR LIBRARY
                    </p>

                    <h1>
                        My Books 📚
                    </h1>

                    <p className="subtitle">
                        Books you've rented are
                        available here.
                    </p>

                </div>


                <button
                    className="browse-btn"
                    onClick={() =>
                        navigate("/")
                    }
                >
                    Browse Books
                </button>

            </div>


            {/* =========================
                EMPTY STATE
            ========================= */}

            {rentals.length === 0 ? (

                <div className="empty-box">

                    <div className="empty-icon">
                        📚
                    </div>

                    <h2>
                        Your library is empty
                    </h2>

                    <p>
                        Rent a book for ₹20 and
                        start reading for 24 hours.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        Explore Books
                    </button>

                </div>

            ) : (


                /* =========================
                   BOOK GRID
                ========================= */

                <div className="books-grid">

                    {rentals.map((rental) => {

                        const book =
                            rental.bookId;

                        if (!book) {
                            return null;
                        }


                        const active =
                            isActive(
                                rental.expiryTime
                            );


                        return (

                            <div
                                className="rental-card"
                                key={rental._id}
                            >


                                {/* COVER */}

                                <div className="cover-wrapper">

                                    <img

                                                src={`http://localhost:3000/uploads/covers/${rental.bookId.coverImage}`}
                                                 alt={rental.bookId.title}

                                        className="book-cover"

                                    />


                                    {/* STATUS */}

                                    <span
                                        className={
                                            active
                                                ? "status active"
                                                : "status expired"
                                        }
                                    >

                                        {active
                                            ? "● Active"
                                            : "● Expired"
                                        }

                                    </span>

                                </div>


                                {/* CONTENT */}

                                <div className="card-content">

                                    <h2>
                                        {book.title}
                                    </h2>


                                    <p className="author">
                                        By {book.author}
                                    </p>


                                    <p className="description">

                                        {book.description?.length > 100

                                            ? book.description.slice(
                                                0,
                                                100
                                            ) + "..."

                                            : book.description

                                        }

                                    </p>


                                    {/* RENTAL INFO */}

                                    <div className="rental-info">

                                        <div>

                                            <span>
                                                Rented
                                            </span>

                                            <strong>

                                                {new Date(
                                                    rental.startTime
                                                ).toLocaleDateString()}

                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Access until
                                            </span>

                                            <strong>

                                                {new Date(
                                                    rental.expiryTime
                                                ).toLocaleString()}

                                            </strong>

                                        </div>

                                    </div>


                                    {/* BUTTON */}

                                    {active ? (

                                        <button

                                            className="read-btn"

                                            onClick={() =>
                                                navigate(`/reader/${rental.bookId._id}`)
                                            }

                                        >

                                            📖 Read Book

                                        </button>

                                    ) : (

                                        <button

                                            className="expired-btn"

                                            onClick={() =>
                                                navigate(
                                                    `/books/${book._id}`
                                                )
                                            }

                                        >

                                            🔄 Rent Again

                                        </button>

                                    )}

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}

        </div>

    );

};


export default MyBooks;