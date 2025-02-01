import axios from "axios";
import transactionModel from "../models/transactionModel.js";
import userModel from "../models/userModel.js";
import "dotenv/config";


//Route for stock data
const getStockData = async(req,res) =>{
    const {symbol } = req.query;
    if (!symbol){
        return res.status(400).json({error:'Stock symbol is required.'});
    }

    try {
        
        // Call the stock market API
        const apiKey = process.env.ALPHA_VANTAGE_API_KEY; // Add your API key in the .env file
        //const apiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
        const apiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

        const response = await axios.get(apiUrl);

        // Extract the current price from the response
        const stockData = response.data["Global Quote"];
        if (!stockData) {
            return res.status(404).json({ error: "Stock data not found" });
        }

        //const currentPrice = stockData["05. price"]; // Key for current price in the API response
        return res.json({ symbol, stockData });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
};

//route for stock buying

const buyStock = async (req, res) => {
    try {
        console.log(req.body)
        const { userId, stockId, quantity } = req.body;

        // Validate the required fields
        if (!userId || !stockId || !quantity) {
            return res.status(400).json({ error: 'All fields are required!' });
        }

        // Fetch the current price of the stock from an external API
        const apiKey = process.env.ALPHA_VANTAGE_API_KEY; // Add your API key in the .env file
        const stockApiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockId}&apikey=${apiKey}`; // Replace with the actual API URL
        const response = await axios.get(stockApiUrl);

        // Extract the current price from the API response
        const stockData = response.data["Global Quote"]; // Adjust this based on API's response structure
        if (!stockData) {
            return res.status(404).json({ error: 'Failed to fetch stock price!' });
        }
        const currentPrice = stockData["05. price"];

        // Create a new transaction for buying the stock
        const newTransaction = new transactionModel({
            transactionId: `TXN-${Date.now()}`, // Generate a unique transaction ID
            userId,
            stockId,
            transactionType: 'buy',
            quantity,
            purchasedPrice: currentPrice, // Use the fetched current price
        });

        // Save the transaction to the database
        const savedTransaction = await newTransaction.save();

        // Add the transaction to the user's transactions list
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

        user.transactions.push(savedTransaction._id);
        await user.save();

        return res.status(201).json({
            message: 'Stock purchased successfully!',
            transaction: savedTransaction,
        });
    } catch (error) {
        
            console.error('Error details:', error);
        
            if (error.response && error.response.data) {
                return res.status(400).json({ error: error.response.data.message });
            }
        
            return res.status(500).json({ error: 'Server error. Please try again later.' });
        }
        
};

//function to sell stock
const sellStock = async (req, res) => {
    try {
        console.log(req.body);
        const { userId, stockId, quantity } = req.body;

        // Validate the required fields
        if (!userId || !stockId || !quantity) {
            return res.status(400).json({ error: 'All fields are required!' });
        }

        // Fetch the user and their transactions
        const user = await userModel.findById(userId).populate('transactions');
        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

        // Filter transactions to find the stock transactions
        const relevantTransactions = user.transactions.filter(
            (txn) => txn.stockId === stockId
        );

        // Calculate total quantity of the stock owned
        const totalQuantityOwned = relevantTransactions.reduce((total, txn) => {
            if (txn.transactionType === 'buy') {
                return total + txn.quantity;
            } else if (txn.transactionType === 'sell') {
                return total - txn.quantity;
            }
            return total;
        }, 0);

        // Check if the user has enough quantity to sell
        if (totalQuantityOwned < quantity) {
            return res.status(400).json({ error: 'Not enough quantity to sell!' });
        }

        // Fetch the current price of the stock from an external API
        const apiKey = process.env.ALPHA_VANTAGE_API_KEY; // Add your API key in the .env file
        const stockApiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockId}&apikey=${apiKey}`;
        const response = await axios.get(stockApiUrl);

        // Extract the current price from the API response
        const stockData = response.data["Global Quote"];
        if (!stockData) {
            return res.status(404).json({ error: 'Failed to fetch stock price!' });
        }
        const currentPrice = stockData["05. price"];

        // Create a new transaction for selling the stock
        const newTransaction = new transactionModel({
            transactionId: `TXN-${Date.now()}`, // Generate a unique transaction ID
            userId,
            stockId,
            transactionType: 'sell',
            quantity,
            purchasedPrice: currentPrice, // Use the fetched current price
        });

        // Save the transaction to the database
        const savedTransaction = await newTransaction.save();

        // Add the transaction to the user's transactions list
        user.transactions.push(savedTransaction._id);
        await user.save();

        return res.status(201).json({
            message: 'Stock sold successfully!',
            transaction: savedTransaction,
        });
    } catch (error) {
        console.error('Error details:', error);

        if (error.response && error.response.data) {
            return res.status(400).json({ error: error.response.data.message });
        }

        return res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};

// Controller function to fetch transactions for a specific user
const getUserTransactions = async (req, res) => {
    try {
      const { userId } = req.body; // Assume userId is passed as a URL parameter
  
      // Validate the userId if it's an ObjectId
      if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
      }
  
      // Fetch transactions from the database
      const transactions = await transactionModel.find({ userId }).populate('stockId', 'name ticker'); // Populate stock details if referenced
  
      // Check if transactions exist
      if (!transactions || transactions.length === 0) {
        return res.status(404).json({ message: 'No transactions found for this user' });
      }

      // Loop through transactions to calculate profit
      const transactionsWithProfit = [];

      for( const transaction of transactions) {
        const {stockId, purchasedPrice, quantity} = transaction;

        // Fetch current price of the stock
        const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
        const stockApiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockId}&apikey=${apiKey}`;
        const response = await axios.get(stockApiUrl);
        const stockData = response.data["Global Quote"];

        if (!stockData) {
            return res.status(404).json({ error: 'Failed to fetch stock price!' });
        }
        const currentPrice = parseFloat(stockData["05. price"]); // Get the current price

        // Calculate profit (net gain)
        const netGain = (currentPrice - purchasedPrice) * quantity;

        transactionsWithProfit.push({
            ...transaction.toObject(), // Convert Mongoose document to a plain object
            currentPrice,
            netGain: netGain.toFixed(2), // Round to 2 decimal places
        });


      }
  
      // Respond with the fetched transactions and calculated profits
        res.status(200).json({
            success: true,
            data: transactionsWithProfit,
        });
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again later.',
      });
    }
  };

  const searchStock = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ success: false, message: "Search query is required" });
        }

        const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
        const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${apiKey}`;
        const response = await axios.get(url);
        
        if (!response.data.bestMatches) {
            return res.status(404).json({ success: false, message: "No results found" });
        }

        // Format response
        const results = response.data.bestMatches.map((stock) => ({
            symbol: stock["1. symbol"],
            name: stock["2. name"],
            type: stock["3. type"],
            region: stock["4. region"],
            marketOpen: stock["5. marketOpen"],
            marketClose: stock["6. marketClose"],
            timezone: stock["7. timezone"],
            currency: stock["8. currency"]
        }));

        res.json({ success: true, data: results });

    } catch (error) {
        console.error("Error fetching stock data:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};
  
  
  
  



export {getStockData,buyStock, getUserTransactions, sellStock, searchStock};