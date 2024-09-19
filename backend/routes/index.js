const  express = require ("express");
const userRouter = require("./user.router");
const router = express.Router();

const app = express();

app.use("/user" ,userRouter)

module.exports = router