const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
//middleware
app.use(express.json());

//use cors
const cors = require("cors");
app.use(cors());

// use dotenv
const dotenv = require("dotenv");
dotenv.config();

// connect mongo db
const mongoose = require("mongoose");
mongoose.connect(
 process.env.DB_CONNECTION_PRODUCT,
 { useNewUrlParser: true, useUnifiedTopology: true },
 () => console.log("connect to db!")
);

// import routes
const customerRoute = require("./routes/customer");
const adminRoute = require("./routes/admin");
const bookingRoute = require("./routes/booking");
const authRoute = require("./routes/auth");
const recordRoute = require("./routes/record");

//route middleware
app.use("/api/admin", adminRoute);
app.use("/api/customer", customerRoute);
app.use("/api/booking", bookingRoute);
app.use("/api/auth", authRoute);
app.use("/api/record", recordRoute);

//get request check connection server
app.get("/", (req, res) => {
 res.send("hello world");
});

const io = require("socket.io")(server);
const port = process.env.PORT;
server.listen(port, () => console.log(`server started with port: ${port}`));
io.on("connection", (socket) => {
 console.log("id connection", socket.id);
});
module.exports.socketEmit = function (value) {
 io.emit("notification", value);
};
