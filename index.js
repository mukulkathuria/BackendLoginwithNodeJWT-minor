const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();

//Default Values
const port = 9000;

//Routers
const authRoute = require("./Routes/auth");

//Middlewares
app.use(express.json());
app.use(cors());

//Routes Middlewares
app.use("/users", authRoute);

//Error Handling Middleware
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

// Connecting to MongoDB
mongoose
  .connect(process.env.DB_LINK, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    app.listen(port, () => {
      console.log(`Server listening to port ${port} MongoDb is Connected`);
    })
  )
  .catch((err) => console.log("Mongodb is not Connected", err));
