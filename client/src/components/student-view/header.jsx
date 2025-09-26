import { GraduationCap, TvMinimalPlay } from "lucide-react";
import React, { useContext } from "react";
import { Button } from "../ui/button";
import { AuthContext } from "@/context/auth-context";
import { Link, useNavigate } from "react-router";
import { LogoutService } from "@/services";

const StudentViewCommonHeader = () => {
  const navigate = useNavigate();
  const { resetCredentials } = useContext(AuthContext);

  async function handleLogout() {
    const res = await LogoutService();
    if (res) {
      resetCredentials();
      sessionStorage.clear();
    }
  }

  return (
    <header className="flex items-center justify-between p-4 border-b relative">
      <div className="flex items-center space-x-4">
        <Link to="/home" className="flex items-center hover:text-black">
          <GraduationCap className="h-8 w-8 mr-4 hover:text-black" />
          <span className="font-extrabold md:text-xl text-[14px]">
            LMS Learn
          </span>
        </Link>
        <div className="flex items-center space-x-1">
          <Button
            onClick={() =>
              location.pathname.includes("/courses")
                ? null
                : navigate("/courses")
            }
            className="text-[14px] md:text-[16px]
            font-medium "
          >
            Explore Courses
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex gap-4 items-center">
          <div
            onClick={() => navigate("/student-courses")}
            className="flex cursor-pointer items-center gap-3"
          >
            <span className="font-extrabold md:text-xl text-[14px]">
              My Courses
            </span>
            <TvMinimalPlay className="h-6 w-6 cursor-pointer" />
          </div>
          <Button onClick={handleLogout}>Sign Out</Button>
        </div>
      </div>
    </header>
  );
};

export default StudentViewCommonHeader;
