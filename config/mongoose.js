const mongoose = require("mongoose");
mongoose.connect(`${process.env.DB_URL}`);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error conecting to MongoDB"));
db.once("open", () => {
    console.log("Connected to database :: MongoDB");
})

module.exports = db;