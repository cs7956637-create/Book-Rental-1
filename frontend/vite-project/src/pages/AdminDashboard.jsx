import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./AdminDashboard.css";

const AdminDashboard = () => {

    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalBooks: 0,
        totalUsers: 0,
        totalRentals: 0,
        totalRevenue: 0
    });

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);


    // ==============================
    // TOKEN
    // ==============================

    const token = localStorage.getItem("token");


    // ==============================
    // AXIOS CONFIG
    // ==============================

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };


    // ==============================
    // GET DASHBOARD DATA
    // ==============================

    const getDashboardData = async () => {

        try {

            if (!token) {
                navigate("/login");
                return;
            }


            const [statsResponse, booksResponse] =
                await Promise.all([

                    axios.get(
                        "http://localhost:3000/admin/stats",
                        config
                    ),

                    axios.get(
                        "http://localhost:3000/admin/books",
                        config
                    )

                ]);


            setStats(statsResponse.data);

            setBooks(booksResponse.data);


        } catch (error) {

            console.log(error);

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                alert(
                    "You are not authorized to access Admin Dashboard"
                );

                navigate("/");

            }

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        getDashboardData();

    }, []);


    // ==============================
    // DELETE BOOK
    // ==============================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this book?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            setDeleteLoading(true);


            await axios.delete(

                `http://localhost:3000/admin/books/${id}`,

                config

            );


            alert("Book deleted successfully");


            // Refresh dashboard

            getDashboardData();


        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Unable to delete book"
            );

        } finally {

            setDeleteLoading(false);

        }

    };


    // ==============================
    // LOADING
    // ==============================

    if (loading) {

        return (

            <div className="admin-loading">

                <div className="admin-spinner"></div>

                <h3>
                    Loading dashboard...
                </h3>

            </div>

        );

    }


    // ==============================
    // UI
    // ==============================

    return (

        <div className="admin-page">


            {/* ==========================
                HEADER
            ========================== */}

            <div className="admin-header">

                <div>

                    <p className="admin-label">
                        ADMIN PANEL
                    </p>

                    <h1>
                        Dashboard
                    </h1>

                    <p className="admin-subtitle">
                        Manage your books, users and
                        rental activity.
                    </p>

                </div>


                <button
                    className="add-book-btn"
                    onClick={() =>
                        navigate("/admin/add-book")
                    }
                >

                    <span>
                        +
                    </span>

                    Add Book

                </button>

            </div>


            {/* ==========================
                STAT CARDS
            ========================== */}

            <div className="stats-grid">


                {/* BOOKS */}

                <div className="stat-card">

                    <div className="stat-icon books-icon">
                        📚
                    </div>

                    <div>

                        <p>
                            Total Books
                        </p>

                        <h2>
                            {stats.totalBooks}
                        </h2>

                    </div>

                </div>


                {/* USERS */}

                <div className="stat-card">

                    <div className="stat-icon users-icon">
                        👥
                    </div>

                    <div>

                        <p>
                            Total Users
                        </p>

                        <h2>
                            {stats.totalUsers}
                        </h2>

                    </div>

                </div>


                {/* RENTALS */}

                <div className="stat-card">

                    <div className="stat-icon rentals-icon">
                        📖
                    </div>

                    <div>

                        <p>
                            Total Rentals
                        </p>

                        <h2>
                            {stats.totalRentals}
                        </h2>

                    </div>

                </div>


                {/* REVENUE */}

                <div className="stat-card">

                    <div className="stat-icon revenue-icon">
                        ₹
                    </div>

                    <div>

                        <p>
                            Total Revenue
                        </p>

                        <h2>
                            ₹{stats.totalRevenue}
                        </h2>

                    </div>

                </div>

            </div>


            {/* ==========================
                BOOKS SECTION
            ========================== */}

            <div className="books-section">


                {/* SECTION HEADER */}

                <div className="section-header">

                    <div>

                        <h2>
                            Books
                        </h2>

                        <p>
                            Manage all books in your
                            library.
                        </p>

                    </div>


                    <button
                        className="secondary-add-btn"
                        onClick={() =>
                            navigate("/admin/add-book")
                        }
                    >

                        + Add Book

                    </button>

                </div>


                {/* ==========================
                    EMPTY BOOKS
                ========================== */}

                {books.length === 0 ? (

                    <div className="empty-books">

                        <div className="empty-icon">
                            📚
                        </div>

                        <h3>
                            No books yet
                        </h3>

                        <p>
                            Add your first book to
                            your library.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/admin/add-book")
                            }
                        >
                            Add Book
                        </button>

                    </div>

                ) : (


                    /* ==========================
                       TABLE
                    ========================== */

                    <div className="table-wrapper">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Book
                                    </th>

                                    <th>
                                        Author
                                    </th>

                                    <th>
                                        Price
                                    </th>

                                    <th>
                                        Added
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {books.map((book) => (

                                    <tr
                                        key={book._id}
                                    >


                                        {/* BOOK */}

                                        <td>

                                            <div className="book-info">

                                                <img
                                                    src={
                                                        `http://localhost:3000/uploads/covers/${book.coverImage}`
                                                    }
                                                    alt={book.title}
                                                    onError={(e) => {
                                                        e.target.src =
                                                            "https://via.placeholder.com/70x90?text=Book";
                                                    }}
                                                />


                                                <div>

                                                    <strong>
                                                        {book.title}
                                                    </strong>

                                                    <span>
                                                        {book.description?.slice(
                                                            0,
                                                            55
                                                        )}

                                                        {book.description?.length > 55
                                                            ? "..."
                                                            : ""}
                                                    </span>

                                                </div>

                                            </div>

                                        </td>


                                        {/* AUTHOR */}

                                        <td>

                                            <span className="author-text">
                                                {book.author}
                                            </span>

                                        </td>


                                        {/* PRICE */}

                                        <td>

                                            <strong className="price">
                                                ₹{book.price}
                                            </strong>

                                            <span className="per-day">
                                                / day
                                            </span>

                                        </td>


                                        {/* DATE */}

                                        <td>

                                            <span className="date">
                                                {new Date(
                                                    book.createdAt
                                                ).toLocaleDateString()}
                                            </span>

                                        </td>


                                        {/* ACTIONS */}

                                        <td>

                                            <div className="actions">


                                                {/* EDIT */}

                                                <button
                                                    className="edit-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/edit-book/${book._id}`
                                                        )
                                                    }
                                                >
                                                    ✏️ Edit
                                                </button>


                                                {/* DELETE */}

                                                <button
                                                    className="delete-btn"
                                                    disabled={deleteLoading}
                                                    onClick={() =>
                                                        handleDelete(
                                                            book._id
                                                        )
                                                    }
                                                >

                                                    {deleteLoading
                                                        ? "Deleting..."
                                                        : "🗑️ Delete"
                                                    }

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

};

export default AdminDashboard;