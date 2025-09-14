const mongoose = require("mongoose");

const LectureProgresssSchema = new mongoose.Schema({
  lectureId: String,
  viewed: Boolean,
  dateViewed: Date,
});

const CourseProgressSchema = new mongoose.Schema({
  userId: String,
  courseId: String,
  completed: Boolean,
  completionDate: Date,
  lecturesProgress: [LectureProgresssSchema],
});

module.exports = mongoose.model("Progress", CourseProgressSchema);
