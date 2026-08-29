import express from "express";
import Book from "../models/Book.js";
import User from "../models/User.js";
import Rental from "../models/Rental.js";

import authMiddleware from "../middleware/auth.js";
import adminMiddleware from "../middleware/admin.js";

const router = express.Router();


// ===============================
// GET DASHBOARD STATS
// ===============================

router.get(
    "/stats",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {

        try {

            const totalBooks =
                await Book.countDocuments();

            const totalUsers =
                await User.countDocuments();

            const totalRentals =
                await Rental.countDocuments();


            // Get rentals
            const rentals =
                await Rental.find({}, "amount");


            // Calculate revenue safely
            const totalRevenue =
                rentals.reduce(
                    (total, rental) => {
                        return total + Number(rental.amount || 0);
                    },
                    0
                );


            res.status(200).json({

                totalBooks,
                totalUsers,
                totalRentals,
                totalRevenue

            });


        } catch (error) {

            console.log(
                "ADMIN STATS ERROR:",
                error
            );

            res.status(500).json({

                message: error.message

            });

        }

    }
);


// ===============================
// GET ALL BOOKS
// ===============================

router.get(
    "/books",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {

        try {

            const books =
                await Book.find()
                .sort({
                    createdAt: -1
                });


            res.json(books);

        } catch (error) {

            res.status(500).json({

                message: error.message

            });

        }

    }
);


// ===============================
// DELETE BOOK
// ===============================

router.delete(
    "/books/:id",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {

        try {

            const book =
                await Book.findById(
                    req.params.id
                );


            if (!book) {

                return res.status(404).json({

                    message: "Book not found"

                });

            }


            await Book.findByIdAndDelete(
                req.params.id
            );


            res.json({

                message: "Book deleted successfully"

            });

        } catch (error) {

            res.status(500).json({

                message: error.message

            });

        }

    }
);
router.put(
    "/books/:id",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {

        try {

            const {
                title,
                author,
                description,
                price
            } = req.body;


            const book =
                await Book.findByIdAndUpdate(

                    req.params.id,

                    {
                        title,
                        author,
                        description,
                        price
                    },

                    {
                        new: true
                    }

                );


            if (!book) {

                return res.status(404).json({

                    message: "Book not found"

                });

            }


            res.json({

                message:
                    "Book updated successfully",

                book

            });

        } catch (error) {

            res.status(500).json({

                message: error.message

            });

        }

    }
);


export default router;