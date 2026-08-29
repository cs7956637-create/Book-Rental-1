import express from "express";
import multer from "multer";

import Book from "../models/Book.js";
import authMiddleware from "../middleware/auth.js";
import adminMiddleware from "../middleware/admin.js";

const router = express.Router();


// ==============================
// MULTER STORAGE
// ==============================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        if (file.fieldname === "coverImage") {

            cb(null, "uploads/covers/");

        } else if (file.fieldname === "bookFile") {

            cb(null, "uploads/books/");

        } else {

            cb(new Error("Invalid file field"));

        }

    },


    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() + "-" + file.originalname;

        cb(null, uniqueName);

    }

});


// ==============================
// FILE FILTER
// ==============================

const fileFilter = (req, file, cb) => {

    if (file.fieldname === "coverImage") {

        if (
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/png" ||
            file.mimetype === "image/webp"
        ) {

            cb(null, true);

        } else {

            cb(
                new Error(
                    "Only JPG, PNG and WEBP images allowed"
                )
            );

        }

    } else if (file.fieldname === "bookFile") {

        if (file.mimetype === "application/pdf") {

            cb(null, true);

        } else {

            cb(
                new Error(
                    "Only PDF files allowed"
                )
            );

        }

    } else {

        cb(new Error("Invalid file field"));

    }

};


// ==============================
// MULTER
// ==============================

const upload = multer({

    storage: storage,

    fileFilter: fileFilter,

    limits: {
        fileSize: 20 * 1024 * 1024
    }

});


// ==============================
// GET ALL BOOKS
// ==============================

router.get("/", async (req, res) => {

    try {

        const books = await Book
            .find()
            .sort({
                createdAt: -1
            });

        res.json(books);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// ==============================
// GET SINGLE BOOK
// ==============================

router.get("/:id", async (req, res) => {

    try {

        const book =
            await Book.findById(req.params.id);


        if (!book) {

            return res.status(404).json({
                message: "Book not found"
            });

        }


        res.json(book);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// ==============================
// ADMIN ADD BOOK
// ==============================

router.post(
    "/",
    authMiddleware,
    adminMiddleware,

    upload.fields([
        {
            name: "coverImage",
            maxCount: 1
        },
        {
            name: "bookFile",
            maxCount: 1
        }
    ]),

    async (req, res) => {

        try {

            const {
                title,
                author,
                description,
                price
            } = req.body;


            // Check files

            if (
                !req.files ||
                !req.files.coverImage ||
                !req.files.bookFile
            ) {

                return res.status(400).json({

                    message:
                        "Cover image and PDF are required"

                });

            }


            const coverImage =
                req.files.coverImage[0].filename;


            const bookFile =
                req.files.bookFile[0].filename;


            // Create book

            const book =
                await Book.create({

                    title,

                    author,

                    description,

                    price,

                    coverImage,

                    bookFile

                });


            res.status(201).json({

                message:
                    "Book added successfully",

                book

            });

        } catch (error) {

            console.log(error);

            res.status(500).json({

                message: error.message

            });

        }

    }
);
router.delete(
    "/:id",
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

                    message:
                        "Book not found"

                });

            }


            await Book.findByIdAndDelete(
                req.params.id
            );


            res.json({

                message:
                    "Book deleted successfully"

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