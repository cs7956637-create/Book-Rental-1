import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Home.css";

const Home = () => {

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Search state
    const [search, setSearch] = useState("");

    const navigate = useNavigate();


    // =========================
    // GET BOOKS
    // =========================

    const getBooks = async () => {

        try {

           const response = await axios.get(
    "https://book-rental-backend-ywuy.onrender.com/books"
);

            setBooks(response.data);

        } catch (error) {

            console.log("Books error:", error);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        getBooks();

    }, []);


    // =========================
    // TITLE BASED SEARCH
    // =========================

    const filteredBooks = books.filter((book) => {

        const title = book.title || "";

        return title
            .toLowerCase()
            .includes(search.toLowerCase());

    });


    // =========================
    // CLEAR SEARCH
    // =========================

    const clearSearch = () => {

        setSearch("");

    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div className="home-loading">

                <div className="loader"></div>

                <p>
                    Loading books...
                </p>

            </div>

        );

    }


    return (

        <div className="home-page">


            {/* =========================
                HERO SECTION
            ========================= */}

            <section className="hero-section">

                <div className="hero-content">

                    <span className="hero-badge">
                        📚 DIGITAL BOOK LIBRARY
                    </span>


                    <h1>

                        Read More.

                        <br />

                        <span>
                            Pay Less.
                        </span>

                    </h1>


                    <p>

                        Discover amazing books and
                        read them for an affordable
                        daily rental price.

                    </p>


                    <button
                        className="hero-button"
                        onClick={() => {

                            document
                                .getElementById("books")
                                ?.scrollIntoView({
                                    behavior: "smooth"
                                });

                        }}
                    >

                        Explore Books ↓

                    </button>

                </div>



                {/* HERO VISUAL */}

                <div className="hero-visual">

                    <div className="floating-book book-one">
                        📕
                    </div>

                    <div className="floating-book book-two">
                        📘
                    </div>

                    <div className="floating-book book-three">
                        📗
                    </div>

                    <div className="hero-circle">
                        📚
                    </div>

                </div>

            </section>



            {/* =========================
                FEATURES
            ========================= */}

            <section className="features">


                <div className="feature-card">

                    <span>
                        💰
                    </span>

                    <div>

                        <h3>
                            Affordable
                        </h3>

                        <p>
                            Read books at low daily prices
                        </p>

                    </div>

                </div>



                <div className="feature-card">

                    <span>
                        ⚡
                    </span>

                    <div>

                        <h3>
                            Instant Access
                        </h3>

                        <p>
                            Pay and start reading instantly
                        </p>

                    </div>

                </div>



                <div className="feature-card">

                    <span>
                        🔒
                    </span>

                    <div>

                        <h3>
                            Secure
                        </h3>

                        <p>
                            Your account and payments are protected
                        </p>

                    </div>

                </div>


            </section>



            {/* =========================
                BOOK SECTION
            ========================= */}

            <section
                className="books-section"
                id="books"
            >


                {/* =========================
                    SEARCH BAR
                ========================= */}

                <div className="book-search">

                    <input
                        type="text"
                        placeholder="🔍 Search book by title..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />


                    {search.length > 0 && (

                        <button
                            type="button"
                            className="clear-search"
                            onClick={clearSearch}
                        >

                            ✕

                        </button>

                    )}

                </div>



                {/* =========================
                    SECTION HEADING
                ========================= */}

                <div className="section-heading">

                    <div>

                        <span>
                            OUR COLLECTION
                        </span>

                        <h2>
                            Explore Books
                        </h2>

                    </div>


                    <p>

                        {search.trim() !== ""
                            ? `${filteredBooks.length} book(s) found`
                            : "Choose a book and start reading today."
                        }

                    </p>

                </div>



                {/* =========================
                    BOOK GRID
                ========================= */}

                <div className="books-container">


                    {filteredBooks.length === 0 ? (

                        <div className="empty-books">

                            <div>
                                📚
                            </div>

                            <h3>
                                {search
                                    ? "No books found"
                                    : "No books available"
                                }
                            </h3>


                            <p>

                                {search
                                    ? `No book found with title "${search}".`
                                    : "New books will appear here soon."
                                }

                            </p>


                            {search && (

                                <button
                                    type="button"
                                    onClick={clearSearch}
                                >

                                    Show All Books

                                </button>

                            )}

                        </div>

                    ) : (


                        filteredBooks.map((book) => (

                            <div
                                className="book-card"
                                key={book._id}
                            >


                                {/* =========================
                                    COVER
                                ========================= */}

                                <div className="book-cover">

                                  <img
    src={`https://book-rental-backend-ywuy.onrender.com/uploads/covers/${book.coverImage}`}
    alt={book.title}
/>


                                    <div className="price-badge">

                                        ₹{book.price}/day

                                    </div>

                                </div>



                                {/* =========================
                                    BOOK DETAILS
                                ========================= */}

                                <div className="book-details">


                                    <h3>
                                        {book.title}
                                    </h3>


                                    <p className="author">

                                        By {book.author}

                                    </p>


                                    <p className="description">

                                        {book.description}

                                    </p>



                                    {/* =========================
                                        BOTTOM
                                    ========================= */}

                                    <div className="book-bottom">


                                        <div className="book-price">

                                            <strong>
                                                ₹{book.price}
                                            </strong>

                                            <span>
                                                / 24 hours
                                            </span>

                                        </div>



                                        <button
                                            className="read-book-btn"
                                            onClick={() =>
                                                navigate(
                                                    `/books/${book._id}`
                                                )
                                            }
                                        >

                                            Read Book →

                                        </button>


                                    </div>


                                </div>


                            </div>

                        ))

                    )}

                </div>

            </section>



            {/* =========================
                BOTTOM CTA
            ========================= */}

            <section className="bottom-cta">


                <h2>

                    Your next great read
                    is waiting.

                </h2>


                <p>

                    Pick a book, pay for 24 hours,
                    and start reading.

                </p>


                <button
                    onClick={() => {

                        document
                            .getElementById("books")
                            ?.scrollIntoView({
                                behavior: "smooth"
                            });

                    }}
                >

                    Browse Books

                </button>


            </section>



            {/* =========================
                FOOTER
            ========================= */}

            <footer className="footer">


                <div className="footer-content">


                    {/* BRAND */}

                    <div className="footer-brand">

                        <h2>
                            📚 BookRent
                        </h2>


                        <p>

                            Affordable digital book rentals.
                            Read more, pay less.

                        </p>

                    </div>



                    {/* LEGAL */}

                    <div className="footer-links">

                        <h3>
                            Legal
                        </h3>


                        <button
                            onClick={() =>
                                navigate("/privacy-policy")
                            }
                        >

                            Privacy Policy

                        </button>


                        <button
                            onClick={() =>
                                navigate("/terms")
                            }
                        >

                            Terms & Conditions

                        </button>


                        <button
                            onClick={() =>
                                navigate("/refund-policy")
                            }
                        >

                            Refund Policy

                        </button>


                        <button
                            onClick={() =>
                                navigate("/rental-policy")
                            }
                        >

                            Rental Policy

                        </button>

                    </div>


                </div>



                {/* FOOTER BOTTOM */}

                <div className="footer-bottom">

                    <p>

                        © 2026 BookRent.
                        All rights reserved.

                    </p>

                </div>


            </footer>


        </div>

    );

};


export default Home;