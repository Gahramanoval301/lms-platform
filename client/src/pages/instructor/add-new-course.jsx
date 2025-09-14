import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/course-curriculum";
import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing";
import CourseSettings from "@/components/instructor-view/courses/add-new-course/course-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { courseLandingInitialFormData } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import {
  addNewCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
} from "@/services";
import { TabsContent } from "@radix-ui/react-tabs";
import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

const AddNewCoursePage = () => {
  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();

  async function fetchCurrentCourseDetails() {
    const res = await fetchInstructorCourseDetailsService(
      currentEditedCourseId
    );

    if (res?.success) {
      const setCourseFormData = Object.keys(
        courseLandingInitialFormData
      ).reduce((acc, key) => {
        acc[key] = res?.data[key] || courseLandingInitialFormData[key];
        return acc;
      }, {});

      console.log(setCourseFormData);
      setCourseLandingFormData(setCourseFormData);
      setCourseCurriculumFormData(res?.data?.curriculum || []);
    }
  }
  useEffect(() => {
    if (currentEditedCourseId) fetchCurrentCourseDetails();
  }, [currentEditedCourseId]);

  useEffect(() => {
    if (params?.courseId) setCurrentEditedCourseId(params.courseId);
  }, [params?.courseId]);

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    return value === "" || value === null || value === undefined;
  }

  function validateFormData() {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
        return false;
      }
    }

    let hasFreePreview = false;

    for (const item of courseCurriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      ) {
        return false;
      }

      if (item.freePreview) {
        hasFreePreview = true; //found at least one free preview
      }
    }

    return hasFreePreview;
  }

  async function handleCreateCourse() {
    const courseFinalFormData = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      students: [],
      curriculum: courseCurriculumFormData,
      isPublished: true,
    };

    const response = currentEditedCourseId
      ? await updateCourseByIdService(
          currentEditedCourseId,
          courseFinalFormData
        )
      : addNewCourseService(courseFinalFormData);

    if (response?.success) {
      setCourseLandingFormData(courseLandingFormData);
      setCourseCurriculumFormData(courseCurriculumFormData);
      navigate(-1);
      setCurrentEditedCourseId(null);
    }

    console.log(courseFinalFormData);
  }
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-extrabold mb-5">Create a new course</h1>
        <Button
          disabled={!validateFormData()}
          className="text-sm tracking-wider font-bold px-8"
          onClick={handleCreateCourse}
        >
          Submit
        </Button>
      </div>
      <Card>
        <CardContent>
          <div className="container mx-auto p-4">
            <Tabs defaultValue="curriculum" className="space-y-4">
              <TabsList>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="course-landing-page">
                  Course Landing Page
                </TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="curriculum">
                <CourseCurriculum />
              </TabsContent>
              <TabsContent value="course-landing-page">
                <CourseLanding />
              </TabsContent>
              <TabsContent value="settings">
                <CourseSettings />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddNewCoursePage;
