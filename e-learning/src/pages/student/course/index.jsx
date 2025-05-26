import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContex } from "@/context/student-context";
import {
  checkCourseEnrollendInfoService,
  fetchStudentViewCourseListService,
} from "@/service";
import { ArrowBigDownIcon, ArrowUpDownIcon, CheckCheck } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join("&");
}

function StudentViewCoursePage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    studentViewCourseList,
    setStudentViewCourseList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContex);

  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  function handleFilterOnChange(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);
    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption.id],
      };
      console.log("cpyFilters", cpyFilters);
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(
        getCurrentOption.id
      );
      if (indexOfCurrentOption === -1) {
        cpyFilters[getSectionId].push(getCurrentOption.id);
      } else {
        cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }
    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
    console.log("filters", cpyFilters);
  }

  async function fetchAllStudentViewCourse(filters, sort) {
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
    });
    const response = await fetchStudentViewCourseListService(query);

    if (response?.success) {
      setStudentViewCourseList(response?.data);
      setLoadingState(false);
    }
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCourseEnrollendInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );
    
    if (response?.success) {
      if (response?.data?.isEnrolled) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    }
  }

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);
  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
    };
  }, []);

  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filters]);

  useEffect(() => {
    if (filters !== null && sort !== null)
      fetchAllStudentViewCourse(filters, sort);
  }, [filters, sort]);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Student View</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <aside className=" w-full md:w-64 space-y-4">
          <div className=" ">
            {/* filters */}
            {Object.keys(filterOptions).map((filterKey) => (
              <div key={filterKey} className="p-4 border-b">
                <h3 className="mb-3 font-bold">{filterKey.toUpperCase()}</h3>
                <div className="grid gap-2 mt-2">
                  {filterOptions[filterKey].map((option) => (
                    <Label
                      key={option.id}
                      className="flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <Checkbox
                        checked={
                          filters &&
                          Object.keys(filters).length > 0 &&
                          filters[filterKey] &&
                          filters[filterKey].indexOf(option.id) > -1
                        }
                        onCheckedChange={() =>
                          handleFilterOnChange(filterKey, option)
                        }
                      />
                      {option.label}
                    </Label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1">
          <div className="flex justify-end items-center mb-4 gap-5 p-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowUpDownIcon className=" h-4 w-4 " />
                  <span className="text-[16px] font-medium">Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => {
                    setSort(value);
                  }}
                >
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      key={sortItem.id}
                      value={sortItem.id}
                      className="capitalize"
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-sm text-black font-bold">
              {studentViewCourseList && studentViewCourseList.length} results
            </span>
          </div>

          <div className="space-y-4">
            {studentViewCourseList && studentViewCourseList.length > 0 ? (
              studentViewCourseList.map((courseItem) => (
                <Card
                  onClick={() => handleCourseNavigate(courseItem?._id)}
                  className="border rounded-lg overflow-hidden shadow cursor-pointer"
                  key={courseItem?._id}
                >
                  <CardContent className="flex gap-4 p-4">
                    <div className="w-48 h-32 flex-shrink-0">
                      <img
                        src={courseItem?.image}
                        alt={courseItem?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {courseItem?.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mb-1">
                        {" "}
                        Created By{" "}
                        <span className="font-bold">
                          {courseItem?.instrocturName}
                        </span>
                      </p>
                      <p className="text-[18px] text-gray-600 mt-3 mb-2">{`${
                        courseItem?.curriculum?.length
                      } ${
                        courseItem?.curriculum?.length <= 1
                          ? "Lecture"
                          : "Lectures"
                      } - ${courseItem?.level.toUpperCase()} Level`}</p>
                      <p className="font-bold text-[16px]">
                        ${courseItem?.pricing}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : loadingState ? (
              <Skeleton />
            ) : (
              <h1 className="text-4xl font-extrabold">No course Found</h1>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentViewCoursePage;
