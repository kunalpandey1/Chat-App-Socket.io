const mongoose = require("mongoose");

const connection_db = async () => {
  try {
    // console.log("MongoDB Connection String:", process.env.MONGO_DB);
    const conn = await mongoose.connect(process.env.MONGO_DB);
    console.log(
      `Successfully Connected to MongoDB Database ${conn.connection.host}`
    );
  } catch (err) {
    console.log(`Something Went Wrong ${err}`);
  }
};

module.exports = connection_db;
