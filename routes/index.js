const router = require("express").Router();

// route api
router.use("/api/v1.0.0", require("./api"));

module.exports = router;
