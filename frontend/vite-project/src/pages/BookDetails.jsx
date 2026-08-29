import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import "./BookDetails.css";

const BookDetails = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);

    useEffect(() => {

        const getBook = async () => {

            try {

                const response = await axios.get(
                    `https://book-rental-backend-ywuy.onrender.com/books/books/${id}`
                );

                setBook(response.data);

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        };

        getBook();

    }, [id]);


    const handleRent = async () => {

        try {

            const token = localStorage.getItem("token");

            if (!token) {

                alert("Please login first");
                navigate("/login");

                return;
            }

            setPaymentLoading(true);

            const response = await axios.post(
                "https://book-rental-backend-ywuy.onrender.com/payment/create-order",
                {
                    bookId: id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const order = response.data;


            const options = {

                key: order.key,

                amount: order.amount,

                currency: order.currency,

                name: "BookRent",

                description: `Rent: ${book.title}`,

                order_id: order.orderId,


                handler: async function (paymentResponse) {

                    try {

                        const verifyResponse =
                            await axios.post(

                                "https://book-rental-backend-ywuy.onrender.com/payment/verify",

                                {

                                    razorpay_order_id:
                                        paymentResponse.razorpay_order_id,

                                    razorpay_payment_id:
                                        paymentResponse.razorpay_payment_id,

                                    razorpay_signature:
                                        paymentResponse.razorpay_signature,

                                    bookId: id

                                },

                                {

                                    headers: {

                                        Authorization:
                                            `Bearer ${token}`

                                    }

                                }

                            );


                        alert(
                            verifyResponse.data.message
                        );

                        navigate("/my-books");


                    } catch (error) {

                        console.log(error);

                        alert(
                            error.response?.data?.message ||
                            "Payment verification failed"
                        );

                        setPaymentLoading(false);

                    }

                },


                modal: {

                    ondismiss: function () {

                        setPaymentLoading(false);

                    }

                }

            };


            const razorpay =
                new window.Razorpay(options);

            razorpay.open();


        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Unable to create order"
            );

            setPaymentLoading(false);

        }

    };


    if (loading) {

        return (
            <div className="book-loading">
                <div className="book-loader"></div>
                <p>Loading book...</p>
            </div>
        );

    }


    if (!book) {

        return (

            <div className="book-not-found">

                <h2>📚 Book not found</h2>

                <button onClick={() => navigate("/")}>
                    Go Home
                </button>

            </div>

        );

    }


    return (

        <div className="book-details-page">

            {/* BACK BUTTON */}

            <button
                className="back-button"
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>


            {/* MAIN CARD */}

            <div className="book-details-card">


                {/* LEFT - IMAGE */}

                <div className="book-image-section">

                    <div className="image-wrapper">
                    <img
    src={`https://book-rental-backend-ywuy.onrender.com/uploads/covers/${book.coverImage}`}
    alt={book.title}
/>

                    </div>

                </div>


                {/* RIGHT - DETAILS */}

                <div className="book-info-section">

                    <span className="book-category">
                        📚 DIGITAL BOOK
                    </span>


                    <h1>
                        {book.title}
                    </h1>


                    <p className="book-author">
                        Written by <strong>{book.author}</strong>
                    </p>


                    <div className="rating">

                        ⭐⭐⭐⭐⭐

                        <span>
                            Reader's Choice
                        </span>

                    </div>


                    <div className="divider"></div>


                    <h3>
                        About this book
                    </h3>


                    <p className="book-description">
                        {book.description}
                    </p>


                    {/* PRICE */}

                    <div className="price-box">

                        <div>

                            <span className="price-label">
                                Rental Price
                            </span>

                            <div className="price">
                                ₹{book.price}
                                <span>
                                    / 24 hours
                                </span>
                            </div>

                        </div>


                        <div className="secure">
                            🔒 Secure Payment
                        </div>

                    </div>


                    {/* BUTTON */}

                    <button
                        className="rent-button"
                        onClick={handleRent}
                        disabled={paymentLoading}
                    >

                        {paymentLoading
                            ? "Processing Payment..."
                            : "📖 Rent & Read"
                        }

                    </button>


                    <p className="payment-note">
                        Pay securely and get instant access
                        for 24 hours.
                    </p>


                </div>

            </div>


            {/* BOTTOM INFO */}

            <div className="book-features">

                <div>

                    <span>⚡</span>

                    <div>
                        <strong>Instant Access</strong>
                        <p>Start reading immediately</p>
                    </div>

                </div>


                <div>

                    <span>🔒</span>

                    <div>
                        <strong>Secure Payment</strong>
                        <p>Your payment is protected</p>
                    </div>

                </div>


                <div>

                    <span>🕐</span>

                    <div>
                        <strong>24 Hour Access</strong>
                        <p>Read anytime for one day</p>
                    </div>

                </div>

            </div>

        </div>

    );

};

export default BookDetails;