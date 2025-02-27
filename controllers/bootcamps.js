// import model from mongoose
const { model } = require("mongoose");

// import asuncHandler middleware
const asyncHandler = require("../middleware/async");
const { param } = require("../routes");

// import error response from utils
const ErrorResponse = require("../utils/errorResponse");

// import Bootcamp model from BootcampSchema
const Bootcamp = model("Bootcamp");

// require geocoder from utils
const geocoder = require("../utils/geocoder");

/**
 * @description get all bootcamps
 * @route GET /api/v1.0.0/bootcamps
 * @access Public
 */
exports.getBootCamps = asyncHandler(async (req, res, next) => {
  let query;

  // copy query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // loop over removeFields and delete from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // create query string
  let queryStr = JSON.stringify(reqQuery);

  // create operators (gt, gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/gi,
    (match) => `$${match}`
  );

  // finding resource
  query = Bootcamp.find(JSON.parse(queryStr));

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // executing query
  const bootcamps = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  // client response
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

/**
 * @description retrieve single bootcamp
 * @route GET /api/v1.0.0/bootcamps/:id
 * @access Public
 */
exports.getBootCamp = asyncHandler(async (req, res, next) => {
  // find bootcamp by id from the database
  const bootcamp = await Bootcamp.findById(req.params.id);

  // check if bootcamp exists
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with id of ${req.params.id} not found`, 404)
    );
  }

  // client response
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

/**
 * @description create new bootcamp
 * @route POST /api/v1.0.0/bootcamps
 * @access Private
 */
exports.createBootCamp = asyncHandler(async (req, res, next) => {
  // create new bootcamp from body request
  const bootcamp = await Bootcamp.create(req.body.bootcamp);

  // client response
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

/**
 * @description update single bootcamp
 * @route PUT /api/v1.0.0/bootcamps/:id
 * @access Private
 */
exports.updateBootCamp = asyncHandler(async (req, res, next) => {
  // find bootcamp by id
  const bootcamp = await Bootcamp.findByIdAndUpdate(
    req.params.id,
    req.body.bootcamp,
    {
      new: true,
      runValidators: true,
    }
  );

  // check if bootcamp exists
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with id of ${req.params.id} not found`, 404)
    );
  }

  // clent response
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

/**
 * @description delete bootcamp
 * @route DELETE /api/v1.0.0/bootcamps/:id
 * @access Private
 */
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
  // find bootcamp by id
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  // check if bootcamp exists
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with id of ${req.params.id} not found`, 404)
    );
  }

  // clent response
  res.status(201).json({
    success: true,
    msg: "Successfully deleted",
  });
});

/**
 * @description Get bootcamps within a radius
 * @route GET /api/v1.0.0/bootcamps/radius/:zipcode/:distance
 * @access Public
 */
exports.getBootCampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get long/lat from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const long = loc[0].longitude;

  // calc radius using radians
  // Divide dist by radius on earth
  // Earth Radius = 3,963 mi/ 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centreSphere: [[long, lat], radius] } },
  });
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
