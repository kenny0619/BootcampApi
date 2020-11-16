// import express router as router
const router = require("express").Router();

// route endpoints
router.use("/bootcamps", require("./bootcamps"));

module.exports = router;
