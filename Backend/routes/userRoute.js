import express from "express"
import {loginUser,registerUser,adminLogin} from "../controllers/userController.js"
import { getStockData, buyStock , getUserTransactions} from "../controllers/stockController.js"
import { createWatchlist, addStockToWatchlist } from "../controllers/watchlistController.js"


const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/adminLogin',adminLogin)
userRouter.get('/stock',getStockData);
userRouter.post('/buy-stock', buyStock);
userRouter.post('/transactions',getUserTransactions)
userRouter.post('/createWatchlist',createWatchlist)
userRouter.post('/addStock',addStockToWatchlist);

export default userRouter;