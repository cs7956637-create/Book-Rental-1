import express from "express";
import path from "path";

import Rental from "../models/Rental.js";
import Book from "../models/Book.js";

import authMiddleware from "../middleware/auth.js";

const router = express.Router();


// ======================================
// CHECK WHETHER USER HAS ACCESS
// ======================================

router.get(
    "/check/:bookId",
    authMiddleware,
    async (req, res) => {

        try {

            const rental = await Rental.findOne({

                userId: req.user.id,

                bookId: req.params.bookId,

                expiryTime: {
                    $gt: new Date()
                }

            }).sort({
                expiryTime: -1
            });


            if (!rental) {

                return res.json({
                    access: false
                });

            }


            res.json({

                access: true,

                expiryTime:
                    rental.expiryTime

            });


        } catch (error) {

            console.log(error);

            res.status(500).json({

                message: error.message

            });

        }

    }
);


// ======================================
// GET MY RENTED BOOKS
// ======================================

router.get(
    "/my-books",
    authMiddleware,
    async (req, res) => {

        try {

            const rentals =
                await Rental.find({

                    userId: req.user.id

                })
                .populate("bookId")
                .sort({

                    createdAt: -1

                });


            res.json(rentals);


        } catch (error) {

            console.log(error);

            res.status(500).json({

                message: error.message

            });

        }

    }
);


// ======================================
// READ BOOK
// ======================================

router.get(
    "/read/:bookId",
    authMiddleware,
    async (req, res) => {

        try {

            // Find active rental

            const rental =
                await Rental.findOne({

                    userId: req.user.id,

                    bookId: req.params.bookId,

                    expiryTime: {
                        $gt: new Date()
                    }

                });


            // No active rental

            if (!rental) {

                return res.status(403).json({

                    message:
                        "Book access expired or not purchased"

                });

            }


            // Find book

            const book =
                await Book.findById(
                    req.params.bookId
                );


            if (!book) {

                return res.status(404).json({

                    message: "Book not found"

                });

            }


            // PDF path

            const filePath = path.join(

                process.cwd(),

                "uploads",

                "books",

                book.bookFile

            );


            // Send PDF

            res.sendFile(filePath);


        } catch (error) {

            console.log(error);

            res.status(500).json({

                message: error.message

            });

        }

    }
);


export default router;