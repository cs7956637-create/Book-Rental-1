import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true
        },

        paymentId: {
            type: String,
            required: true,
            unique: true
        },

        orderId: {
            type: String,
            required: true,
            unique: true
        },

        amount: {
            type: Number,
            required: true
        },

        startTime: {
            type: Date,
            required: true
        },

        expiryTime: {
            type: Date,
            required: true
        }
    },

    {
        timestamps: true
    }
);

const Rental = mongoose.model(
    "Rental",
    rentalSchema
);

export default Rental;