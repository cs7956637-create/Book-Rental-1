import dotenv from "dotenv";

dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dns from "dns";
import path from "path";

import authRouter from "./routes/auth.js";
import authMiddleware from "./middleware/auth.js";
import adminMiddleware from "./middleware/admin.js";
import bookRouter from "./routes/books.js";
import paymentRouter from "./routes/payment.js";
import rentalRouter from "./routes/rental.js";
import adminRouter from "./routes/admin.js";



const app = express();
dns.setServers(["8.8.8.8","1.1.1.1"])

app.use(cors());
app.use(express.json());
app.use(cors());
app.use(express.json());

app.use(
    "/uploads",
    express.static(
        path.join(process.cwd(), "uploads")
    )
);


// MongoDB connection

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((error) => {
        console.log("MongoDB Error:", error);
    });


// Routes

app.use("/auth", authRouter);
app.use("/books", bookRouter);
app.use("/rental", rentalRouter);
app.use("/admin", adminRouter);

app.use("/payment", paymentRouter);


app.get("/", (req, res) => {

    res.send("Book Rental Backend Running");

});
app.get(
    "/admin",
    authMiddleware,
    adminMiddleware,
    (req, res) => {

        res.json({
            message: "Welcome Admin Dashboard"
        });

    }
);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});