import mongoose from "mongoose";


const transactionSchema = new mongoose.Schema({
    transactionId: { 
        type: String, 
        required: true, 
        unique: true // Primary key
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', // Foreign key to User schema
        required: true 
    },
    stockId: { 
        type: String,
        required: true, 

    },
    transactionType: { 
        type: String, 
        enum: ['buy', 'sell'], // Only allow 'buy' or 'sell'
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true 
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    purchasedPrice: { 
        type: Number, 
        required: true 
    }
});

const transactionModel = mongoose.model.Transaction || mongoose.model('Transaction', transactionSchema) 

export default transactionModel