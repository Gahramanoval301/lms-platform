const CourseProgress = require("../../models/CourseProgress");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

// mark current lecture as viewed
const markCurrentLectureAsViewed = async (req, res) => {
  try {
  } catch (error) {
    console.log("in function getCurrentCourseProgress", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

//get current course progress
const getCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const studentPurchasedCourses = await StudentCourses.findOne({ userId });

    const isCurrentCoursePurchaseByCurrentUserOrNot =
      studentPurchasedCourses?.courses?.findIndex(
        (item) => item.courseId == courseId
      );

    if (!isCurrentCoursePurchaseByCurrentUserOrNot) {
      return res.status(200).json({
        message: "Course not purchased by user",
        success: true,
        data: {
          isPurchased: true,
        },
      });
    }

    const currentUserCourseProgress = await CourseProgress.findOne({
      userId,
      courseId,
    });

    if (
      !currentUserCourseProgress ||
      currentUserCourseProgress?.lecturesProgress?.length === 0
    ) {
      const course = await Course.findById(courseId);

      if (!course) {
        return res
          .status(404)
          .json({ message: "Course not found", success: false });
      }

      return res.status(200).json({
        success: true,
        message: "No progress found, you can start watching the course",
        data: {
          courseDetails: course,
          progress: [],
          isPurchased: true,
        },
      });
    }

    const courseDetails = await Course.findById(courseId);

    res.status(200).json({
      success: true,
      data: {
        courseDetails: courseDetails,
        progress: currentUserCourseProgress.lecturesProgress,
        completed: currentUserCourseProgress.completed,
        completionDate: currentUserCourseProgress.completionDate,
        isPurchased: true,
      },
    });
  } catch (error) {
    console.log("in function getCurrentCourseProgress", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

//reset course progress
const resetCurrentCourseProgress = async (req, res) => {
  try {
  } catch (error) {
    console.log("in function getCurrentCourseProgress", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

module.exports = {
  markCurrentLectureAsViewed,
  getCurrentCourseProgress,
  resetCurrentCourseProgress,
};
