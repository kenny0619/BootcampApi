// import node-geocoder module
const NodeGeocoder = require("node-geocoder");

// define options for geocoder module
const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
};

// set geocoder with defined options
const geocoder = NodeGeocoder(options);

module.exports = geocoder;
