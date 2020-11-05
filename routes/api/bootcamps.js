// import express router as router
const router = require("express").Router();

// deconstruct controllers from bootcamp controller module
const {
  getBootCamp,
  getBootCamps,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
  getBootCampsInRadius,
} = require("../../controllers/bootcamps");

// mount routers
router.route("/radius/:zipcode/:distance").get(getBootCampsInRadius);

router.route("/").get(getBootCamps).post(createBootCamp);

router
  .route("/:id")
  .get(getBootCamp)
  .put(updateBootCamp)
  .delete(deleteBootCamp);

module.exports = router;
