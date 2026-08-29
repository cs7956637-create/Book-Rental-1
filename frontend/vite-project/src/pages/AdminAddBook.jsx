import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./AdminAddBook.css";


const AdminAddBook = () => {

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    const [coverImage, setCoverImage] = useState(null);
    const [bookFile, setBookFile] = useState(null);

    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!coverImage) {
            alert("Please select cover image");
            return;
        }

        if (!bookFile) {
            alert("Please select PDF");
            return;
        }


        const formData = new FormData();

        formData.append("title", title);
        formData.append("author", author);
        formData.append("description", description);
        formData.append("price", price);

        formData.append("coverImage", coverImage);
        formData.append("bookFile", bookFile);


        try {

            setLoading(true);

            const token =
                localStorage.getItem("token");


            const response = await axios.post(

                "https://book-rental-backend-ywuy.onrender.com/books",

                formData,

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }

            );


            alert(response.data.message);

            navigate("/admin");


        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Book upload failed"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="add-book-page">


            {/* =========================
                MAIN CARD
            ========================= */}

            <div className="add-book-card">


                {/* =========================
                    HEADER
                ========================= */}

                <div className="add-book-header">

                    <button

                        className="back-button"

                        onClick={() =>
                            navigate("/admin")
                        }

                    >
                        ← Back to Dashboard
                    </button>


                    <div>

                        <p className="admin-label">
                            ADMIN PANEL
                        </p>

                        <h1>
                            Add New Book 📚
                        </h1>

                        <p className="header-text">
                            Add a new book to your
                            digital library.
                        </p>

                    </div>

                </div>


                {/* =========================
                    FORM
                ========================= */}

                <form
                    onSubmit={handleSubmit}
                    className="add-book-form"
                >


                    {/* TITLE */}

                    <div className="form-group">

                        <label>
                            Book Title
                        </label>

                        <input

                            type="text"

                            placeholder="Enter book title"

                            value={title}

                            onChange={(e) =>
                                setTitle(
                                    e.target.value
                                )
                            }

                            required

                        />

                    </div>


                    {/* AUTHOR */}

                    <div className="form-group">

                        <label>
                            Author
                        </label>

                        <input

                            type="text"

                            placeholder="Enter author name"

                            value={author}

                            onChange={(e) =>
                                setAuthor(
                                    e.target.value
                                )
                            }

                            required

                        />

                    </div>


                    {/* DESCRIPTION */}

                    <div className="form-group">

                        <label>
                            Description
                        </label>

                        <textarea

                            placeholder="Write a short description about the book"

                            value={description}

                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }

                            rows="5"

                            required

                        />

                    </div>


                    {/* PRICE */}

                    <div className="form-group">

                        <label>
                            Price Per Day
                        </label>


                        <div className="price-input">

                            <span>
                                ₹
                            </span>

                            <input

                                type="number"

                                placeholder="20"

                                min="1"

                                value={price}

                                onChange={(e) =>
                                    setPrice(
                                        e.target.value
                                    )
                                }

                                required

                            />

                        </div>


                        <small>
                            Users will pay this amount
                            for 24 hours of access.
                        </small>

                    </div>


                    {/* FILE SECTION */}

                    <div className="file-grid">


                        {/* COVER IMAGE */}

                        <div className="file-box">

                            <label>
                                Cover Image
                            </label>

                            <div className="upload-area">

                                <div className="upload-icon">
                                    🖼️
                                </div>

                                <strong>
                                    Upload Cover
                                </strong>

                                <span>
                                    PNG, JPG or WEBP
                                </span>


                                <input

                                    type="file"

                                    accept="image/png,image/jpeg,image/webp"

                                    onChange={(e) =>
                                        setCoverImage(
                                            e.target.files[0]
                                        )
                                    }

                                    required

                                />


                                {coverImage && (

                                    <p className="selected-file">

                                        ✓ {coverImage.name}

                                    </p>

                                )}

                            </div>

                        </div>


                        {/* PDF */}

                        <div className="file-box">

                            <label>
                                Book PDF
                            </label>

                            <div className="upload-area">

                                <div className="upload-icon">
                                    📄
                                </div>

                                <strong>
                                    Upload PDF
                                </strong>

                                <span>
                                    PDF files only
                                </span>


                                <input

                                    type="file"

                                    accept="application/pdf"

                                    onChange={(e) =>
                                        setBookFile(
                                            e.target.files[0]
                                        )
                                    }

                                    required

                                />


                                {bookFile && (

                                    <p className="selected-file">

                                        ✓ {bookFile.name}

                                    </p>

                                )}

                            </div>

                        </div>

                    </div>


                    {/* ACTIONS */}

                    <div className="form-actions">

                        <button

                            type="button"

                            className="cancel-button"

                            onClick={() =>
                                navigate("/admin")
                            }

                        >
                            Cancel
                        </button>


                        <button

                            type="submit"

                            className="submit-button"

                            disabled={loading}

                        >

                            {loading
                                ? "Uploading..."
                                : "Add Book"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};


export default AdminAddBook;