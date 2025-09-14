const StudentCourses = require("../../models/StudentCourses");

const getCourseByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentBoughtCourses = await StudentCourses.findOne({
      userId: studentId,
    });
    console.log(studentBoughtCourses);

    res
      .status(200)
      .json({ success: true, data: studentBoughtCourses?.courses || [] });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
module.exports = { getCourseByStudentId };
