const Course = require('../../models/Course');


const addNewCourse = async (req, res) => {
    try {
        const courseData  = req.body;
        const newlyCreatedCourse = new Course(courseData);
        const saveCourse = await newlyCreatedCourse.save();

        if(saveCourse){
 res.status(201).json({
            success: true,
            message: "New Course Added",
            data: saveCourse
        })
        }

       
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success:false, message: "Internal Server Error" });
    }
}


const getAllCourses = async (req, res) => {
    try {
        const coursesList = await Course.find({});

        res.status(200).json({
            success: true,
            data:coursesList
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success:false, message: "Internal Server Error" });
    }
}

const getCourseDetailsById = async (req, res) => {
    try {
        const {id} = req.params;
        const courseDetails = await Course.findById(id);

        if(!courseDetails){
            return res.status(404).json({
                success:false, 
                message: "Course not found"
            })
        }

        res.status(200).json({
            success:true, 
            data:courseDetails

        })


    } catch (error) {
        console.log(error);
        res.status(500).json({ success:false, message: "Internal Server Error" });
    }
}

const updateCourseById = async (req, res) => {
    try {
        const {id} = req.params;
        const updatedCourseData = req.body;
        const updatedCourse = await Course.findByIdAndUpdate(id, updatedCourseData, {new:true});

        if(!updatedCourse){
            return res.status(404).json({
                success:false, 
                message: "Course not found"
            })
        }

        res.status(200).json({
            success:true, 
            message: "Course Updated",
            data:updatedCourse
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success:false, message: "Internal Server Error" });
    }
}

module.exports = {addNewCourse, getAllCourses, getCourseDetailsById, updateCourseById}