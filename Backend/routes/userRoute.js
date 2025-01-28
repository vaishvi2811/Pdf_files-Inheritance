import express from "express"
import {loginUser,registerUser,adminLogin} from "../controllers/userController.js"
import { getStockData, buyStock , getUserTransactions, sellStock} from "../controllers/stockController.js"
import { createWatchlist, addStockToWatchlist, getUserWatchlists } from "../controllers/watchlistController.js"


const userRouter = express.Router()
//login 
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/adminLogin',adminLogin)


userRouter.get('/stock',getStockData);
userRouter.post('/buy-stock', buyStock);
userRouter.post('/sell', sellStock);

userRouter.post('/transactions',getUserTransactions);


userRouter.post('/createWatchlist',createWatchlist)
userRouter.post('/addStock',addStockToWatchlist);
userRouter.post('/fetchWatchlist', getUserWatchlists);

export default userRouter;