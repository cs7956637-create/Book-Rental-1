import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import "./EditBook.css";


const EditBook = () => {

    const { id } = useParams();

    const navigate = useNavigate();


    const [title, setTitle] = useState("");

    const [author, setAuthor] = useState("");

    const [description, setDescription] =
        useState("");

    const [price, setPrice] = useState("");


    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);


    // =========================
    // GET BOOK
    // =========================

    useEffect(() => {

        const getBook = async () => {

            try {

                const response =
                    await axios.get(

                        `http://localhost:3000/books/${id}`

                    );


                const book =
                    response.data;


                setTitle(book.title);

                setAuthor(book.author);

                setDescription(
                    book.description
                );

                setPrice(book.price);


            } catch (error) {

                console.log(error);

                alert(
                    "Unable to load book"
                );

                navigate("/admin");

            } finally {

                setLoading(false);

            }

        };


        getBook();

    }, [id, navigate]);


    // =========================
    // UPDATE
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();


        try {

            setSaving(true);


            const token =
                localStorage.getItem("token");


            const response =
                await axios.put(

                    `http://localhost:3000/admin/books/${id}`,

                    {
                        title,
                        author,
                        description,
                        price
                    },

                    {
                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }

                );


            alert(
                response.data.message
            );


            navigate("/admin");


        } catch (error) {

            console.log(error);


            alert(

                error.response
                    ?.data
                    ?.message ||

                "Book update failed"

            );

        } finally {

            setSaving(false);

        }

    };


    if (loading) {

        return (
            <h2 className="edit-loading">
                Loading book...
            </h2>
        );

    }


    return (

        <div className="edit-page">

            <div className="edit-card">

                <button

                    className="back-btn"

                    onClick={() =>
                        navigate("/admin")
                    }

                >
                    ← Back to Dashboard
                </button>


                <div className="edit-heading">

                    <p>
                        ADMIN PANEL
                    </p>

                    <h1>
                        Edit Book
                    </h1>

                    <span>
                        Update the book information
                        below.
                    </span>

                </div>


                <form
                    onSubmit={handleSubmit}
                >


                    <label>
                        Book Title
                    </label>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) =>
                            setTitle(
                                e.target.value
                            )
                        }
                        required
                    />


                    <label>
                        Author
                    </label>

                    <input
                        type="text"
                        value={author}
                        onChange={(e) =>
                            setAuthor(
                                e.target.value
                            )
                        }
                        required
                    />


                    <label>
                        Description
                    </label>

                    <textarea

                        value={description}

                        onChange={(e) =>
                            setDescription(
                                e.target.value
                            )
                        }

                        rows="6"

                        required

                    />


                    <label>
                        Price Per Day
                    </label>

                    <input
                        type="number"
                        value={price}
                        onChange={(e) =>
                            setPrice(
                                e.target.value
                            )
                        }
                        min="1"
                        required
                    />


                    <div className="edit-actions">

                        <button

                            type="button"

                            className="cancel-btn"

                            onClick={() =>
                                navigate("/admin")
                            }

                        >
                            Cancel
                        </button>


                        <button

                            type="submit"

                            className="save-btn"

                            disabled={saving}

                        >

                            {saving
                                ? "Saving..."
                                : "Save Changes"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};


export default EditBook;