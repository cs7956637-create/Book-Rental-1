import dotenv from "dotenv";

dotenv.config();

import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

import authMiddleware from "../middleware/auth.js";
import Book from "../models/Book.js";
import Rental from "../models/Rental.js";

const router = express.Router();


const razorpay = new Razorpay({

    key_id: process.env.RAZORPAY_KEY_ID,

    key_secret: process.env.RAZORPAY_KEY_SECRET

});
router.post(
    "/create-order",
    authMiddleware,
    async (req, res) => {

        try {

            const { bookId } = req.body;


            const book = await Book.findById(bookId);


            if (!book) {

                return res.status(404).json({
                    message: "Book not found"
                });

            }


            const options = {

                amount: book.price * 100,

                currency: "INR",

                receipt: `book_${bookId}_${Date.now()}`

            };


            const order =
                await razorpay.orders.create(options);


            res.json({

                orderId: order.id,

                amount: order.amount,

                currency: order.currency,

                key: process.env.RAZORPAY_KEY_ID

            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message: error.message
            });

        }

    }
);
router.post(
    "/verify",
    authMiddleware,
    async (req, res) => {

        try {

            const {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                bookId
            } = req.body;


            // =========================
            // CHECK REQUIRED DATA
            // =========================

            if (
                !razorpay_order_id ||
                !razorpay_payment_id ||
                !razorpay_signature ||
                !bookId
            ) {

                return res.status(400).json({

                    message:
                        "Payment details are missing"

                });

            }


            // =========================
            // FIND BOOK
            // =========================

            const book =
                await Book.findById(bookId);


            if (!book) {

                return res.status(404).json({

                    message:
                        "Book not found"

                });

            }


            // =========================
            // CHECK DUPLICATE PAYMENT
            // =========================

            const existingRental =
                await Rental.findOne({

                    paymentId:
                        razorpay_payment_id

                });


            if (existingRental) {

                return res.status(400).json({

                    message:
                        "Payment already processed"

                });

            }


            // =========================
            // VERIFY SIGNATURE
            // =========================

            const body =
                razorpay_order_id +
                "|" +
                razorpay_payment_id;


            const expectedSignature =
                crypto
                    .createHmac(
                        "sha256",
                        process.env.RAZORPAY_KEY_SECRET
                    )
                    .update(body)
                    .digest("hex");


            if (
                expectedSignature !==
                razorpay_signature
            ) {

                return res.status(400).json({

                    message:
                        "Payment verification failed"

                });

            }


            // =========================
            // CREATE 24 HOUR RENTAL
            // =========================

            const startTime =
                new Date();


            const expiryTime =
                new Date(

                    startTime.getTime() +
                    24 * 60 * 60 * 1000

                );


            const rental =
                await Rental.create({

                    userId:
                        req.user.id,

                    bookId:
                        bookId,

                    paymentId:
                        razorpay_payment_id,

                    orderId:
                        razorpay_order_id,

                    amount:
                        book.price,

                    startTime:
                        startTime,

                    expiryTime:
                        expiryTime

                });


            res.json({

                message:
                    "Payment successful. Book rented.",

                rental

            });


        } catch (error) {

            console.log(error);

            res.status(500).json({

                message:
                    error.message

            });

        }

    }
);
export default router;