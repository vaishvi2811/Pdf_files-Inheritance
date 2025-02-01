import yahooFinance from 'yahoo-finance2';

const INDICES = {
    "S&P 500": "^GSPC",
    "Dow Jones": "^DJI",
    "Nasdaq": "^IXIC",
    "Nifty 50": "^NSEI"
};

// Function to fetch real-time indices data
const getGlobalIndices = async (req, res) => {
    try {
        let indicesData = {};

        for (const [name, symbol] of Object.entries(INDICES)) {
            const data = await yahooFinance.quote(symbol);
            indicesData[name] = {
                symbol: symbol,
                price: data.regularMarketPrice,
                change: data.regularMarketChange,
                changePercent: data.regularMarketChangePercent,
                lastUpdated: data.regularMarketTime
            };
        }

        res.json({
            success: true,
            data: indicesData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching indices data",
            error: error.message
        });
    }
};

export  { getGlobalIndices };
