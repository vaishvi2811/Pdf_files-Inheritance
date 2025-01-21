import WatchlistModel from "../models/watchlistModel.js";
import userModel from "../models/userModel.js";

// Controller to create a watchlist for a user
const createWatchlist = async (req, res) => {
    const { userId, watchlistName } = req.body;

    // Validate the required fields
    if (!userId || !watchlistName ) {
        return res.status(400).json({ error: 'User ID and watchlist name are required.' });
    }

    try {
        // Check if the user exists
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Create a new watchlist for the user
        const newWatchlist = new WatchlistModel({
            watchlistId: `${watchlistName}`,  // Generate a unique watchlist ID
            userId,
            stocks:[],
        });

        // Save the watchlist to the database
        const savedWatchlist = await newWatchlist.save();
        

        //add the watchlist to the users watchlist
        user.watchlist.push(savedWatchlist._id);
        await user.save();
                
        // Respond with the created watchlist
        res.status(201).json({
            message: 'Watchlist created successfully!',
            watchlist: newWatchlist,
        });

    } catch (error) {
        console.error('Error creating watchlist:', error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};

// Add stock to watchlist controller
const addStockToWatchlist = async (req, res) => {
    try {
        const { watchlistId  , userId, symbol } = req.body;

        // Validate request data
        if (!userId || !symbol || !watchlistId) {
            return res.status(400).json({ message: 'userId, symbol, and watchlistId are required.' });
        }

        // Find the watchlist for the user
        const watchlist = await WatchlistModel.findOne({ watchlistId : watchlistId });

        if (!watchlist) {
            return res.status(404).json({ message: 'Watchlist not found for the user.' });
        }

        // Check if the stock already exists in the watchlist
        const stockExists = watchlist.stocks.some(stock => stock.symbol === symbol);

        if (stockExists) {
            return res.status(400).json({ message: 'Stock already exists in the watchlist.' });
        }

        // Add the new stock to the watchlist
        watchlist.stocks.push({ symbol });

        // Save the updated watchlist
        await watchlist.save();

        return res.status(200).json({ message: 'Stock added successfully.', watchlist });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while adding the stock.', error: error.message });
    }
};

// Controller function to fetch watchlists for a specific user
const getUserWatchlists = async (req, res) => {
    try {
      const { userId } = req.body; // Assume userId is passed as a URL parameter
  
      // Validate the userId if it's an ObjectId
      if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
      }
  
      // Fetch watchlists from the database
      const watchlists = await WatchlistModel.find({ userId }).populate('stockId', 'name ticker'); // Populate stock details if referenced
  
      // Check if transactions exist
      if (!watchlists || watchlists.length === 0) {
        return res.status(404).json({ message: 'No watchlists found for this user' });
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
            data: watchlists,
        });
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again later.',
      });
    }
  };


export {createWatchlist, addStockToWatchlist};