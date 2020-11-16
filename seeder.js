// import modules
const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");

//require env vars
require("dotenv").config({ path: "./config/config.env" });

// load models
require("./models/Bootcamp");
const Bootcamp = mongoose.model("Bootcamp");

// connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
});

// Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

// Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);

    console.log("Data imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete Data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();

    console.log("Data destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// determine process
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
