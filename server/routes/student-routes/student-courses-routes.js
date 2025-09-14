const express = require("express");
const {
  getCourseByStudentId,
} = require("../../controllers/student-controller/student-courses-controller");

const router = express.Router();

router.get("/get/:studentId", getCourseByStudentId);

module.exports = router;
