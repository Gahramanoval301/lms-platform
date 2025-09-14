const CourseProgress = require("../../models/CourseProgress");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

// mark current lecture as viewed
const markCurrentLectureAsViewed = async (req, res) => {
  try {
    const { userId, courseId, lectureId } = req.body;

    let progress = await CourseProgress.findOne({ userId, courseId });

    if (!progress) {
      progress = new CourseProgress({
        userId,
        courseId,
        lecturesProgress: [{ lectureId, viewed: true, dateViewed: new Date() }],
      });

      await progress.save();
    } else {
      const lecturesProgress = progress.lecturesProgress.find(
        (item) => item.lectureId.toString() === lectureId.toString()
      );

      if (!lecturesProgress) {
        console.log("sagolll!");

        console.log(lectureId, "lecureid");
        progress.lecturesProgress.push({
          lectureId,
          viewed: true,
          dateViewed: new Date(),
        });
      } else {
        console.log("salammmm");
        // i don;t know

        // progress.lecturesProgress.push({
        //   lectureId,
        //   viewed: true,
        //   dateViewed: new Date(),
        // });
      }
      await progress.save();
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found", success: false });
    }

    //check all the lectures are viewed or not
    const allLecturesAreViewed =
      progress.lecturesProgress.length === course.curriculum.length &&
      progress.lecturesProgress.every((item) => item.viewed);

    if (allLecturesAreViewed) {
      progress.completed = true;
      progress.completionDate = new Date();

      await progress.save();
    }

    res.status(200).json({
      success: true,
      message: "Lecture marked as viewed successfully",
      data: progress,
    });
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

    // console.log(studentPurchasedCourses, "studentPurchasedCourses");

    const isCurrentCoursePurchaseByCurrentUserOrNot =
      studentPurchasedCourses?.courses?.findIndex((item) => {
        return item.courseId == courseId;
      });

    if (isCurrentCoursePurchaseByCurrentUserOrNot === -1) {
      return res.status(200).json({
        message: "Course not purchased by user",
        success: true,
        data: {
          isPurchased: false,
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
    const { userId, courseId } = req.body;
    const progress = await CourseProgress.findOne({ userId, courseId });

    if (!progress) {
      return res
        .status(404)
        .json({ message: "Progress not found", success: false });
    }

    progress.lecturesProgress = [];
    progress.completed = false;
    progress.completionDate = null;

    await progress.save();

    res.status(200).json({
      success: true,
      message: "Progress reset successfully",
      data: progress,
    });
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
