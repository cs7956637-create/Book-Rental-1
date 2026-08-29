import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import "./Reader.css";

const Reader = () => {

    const { id, bookId } = useParams();

    const actualBookId = bookId || id;

    const navigate = useNavigate();

    const [pdfUrl, setPdfUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadBook = async () => {

            try {

                const token =
                    localStorage.getItem("token");

                if (!token) {

                    navigate("/login");
                    return;

                }

                if (!actualBookId) {

                    setError("Book ID missing");
                    return;

                }

                const response = await axios.get(

                    `https://book-rental-backend-ywuy.onrender.com/rental/read/${actualBookId}`,

                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        },

                        responseType: "blob"
                    }

                );

                const fileUrl =
                    URL.createObjectURL(
                        response.data
                    );

                setPdfUrl(fileUrl);

            } catch (error) {

                console.log(error);

                if (error.response?.status === 401) {

                    setError("Please login again.");

                } else if (error.response?.status === 403) {

                    setError(
                        "Your book access has expired."
                    );

                } else {

                    setError(
                        "Unable to open the book."
                    );

                }

            } finally {

                setLoading(false);

            }

        };

        loadBook();

    }, [actualBookId, navigate]);


    if (loading) {

        return (

            <div className="reader-loading">

                <div className="reader-loader"></div>

                <h2>
                    Opening your book...
                </h2>

            </div>

        );

    }


    if (error) {

        return (

            <div className="reader-error">

                <h2>
                    📕 {error}
                </h2>

                <button
                    onClick={() =>
                        navigate("/my-books")
                    }
                >
                    ← Back to My Books
                </button>

            </div>

        );

    }


    return (

        <div className="reader-page">

            <div className="reader-header">

                <button
                    onClick={() =>
                        navigate("/my-books")
                    }
                >
                    ← Back
                </button>

                <h2>
                    📖 Book Reader
                </h2>

            </div>


            <div className="pdf-container">

                {pdfUrl && (

                    <iframe
                        src={pdfUrl}
                        title="Book PDF"
                        className="pdf-viewer"
                    />

                )}

            </div>

        </div>

    );

};

export default Reader;