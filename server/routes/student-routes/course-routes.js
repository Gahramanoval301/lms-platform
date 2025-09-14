const express = require("express");
const router = express.Router();
const {
  getAllStudentViewCourseDetails,
  getAllStudentViewCourses,
  checkCoursePurchasedInfo
} = require("../../controllers/student-controller/course-controller");

router.get("/get", getAllStudentViewCourses)
router.get("/get/details/:id", getAllStudentViewCourseDetails)
router.get("/purchase-info/:id/:studentId", checkCoursePurchasedInfo)

module.exports = router;