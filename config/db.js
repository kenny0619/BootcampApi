// import mongoose module
const mongoose = require("mongoose");

// establish connection to mongodb database
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  });
  // print connection to console
  console.log(`MongoDb connected: ${conn.Connection.host}`.cyan.underline.bold);
};

// export connection
module.exports = connectDB;
