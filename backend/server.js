require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const userRouter = require("./routes/user");
const servicesRouter = require("./routes/services");
const { refreshToken } = require("./middleware/authMiddleware");

//Express app
const app = express();

//Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//Routes
app.get("/api/refreshToken", refreshToken);
app.use("/api/user", userRouter);
app.use("/api/services", servicesRouter);

//Connection to database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        "Connection succeeded to the database on port",
        process.env.PORT
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });
