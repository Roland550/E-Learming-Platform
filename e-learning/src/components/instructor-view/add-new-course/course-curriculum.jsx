import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { courseLandingInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/service";
import { Label } from "@radix-ui/react-label";
import { useContext } from "react";

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const handleNewLecture = () => {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseLandingInitialFormData[0],
      },
    ]);
  };

  const handleCourseTitleChange = (event, currentIndex) => {
    let copyCourseCurriculumFormData = [...courseCurriculumFormData];

    copyCourseCurriculumFormData[currentIndex] = {
      ...copyCourseCurriculumFormData[currentIndex],
      title: event.target.value,
    };
    setCourseCurriculumFormData(copyCourseCurriculumFormData);
  };

  const handleFreePreviewChange = (currentValue, currentIndex) => {
    let copyCourseCurriculumFormData = [...courseCurriculumFormData];

    copyCourseCurriculumFormData[currentIndex] = {
      ...copyCourseCurriculumFormData[currentIndex],
      freePreview: currentValue,
    };
    setCourseCurriculumFormData(copyCourseCurriculumFormData);
  };

  const handleSingleLectureUpload = async (event, currentIndex) => {
    const selecTedFile = event.target.files[0];
    if (selecTedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selecTedFile);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        );
        console.log(response);
        if (response.success) {
          let copyCourseCurriculumFormData = [...courseCurriculumFormData];
          copyCourseCurriculumFormData[currentIndex] = {
            ...copyCourseCurriculumFormData[currentIndex],
            videoUrl: response.data.url,
            public_id: response.data.public_id,
          };
          setCourseCurriculumFormData(copyCourseCurriculumFormData);
          setMediaUploadProgress(false);
        }
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    }
  };
  console.log(courseCurriculumFormData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Course Curriculum</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleNewLecture}>Add lecture</Button>
        {mediaUploadProgress ? (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        ) : null}
        <div className="mt-4 space-y-4">
          {Array.isArray(courseCurriculumFormData) &&
            courseCurriculumFormData.map((curriculumItem, index) => (
              <div key={index} className="border p-5 rounded-md">
                <div className="flex gap-5">
                  <h3 className="font-semibold">Lecture {index + 1}</h3>
                  <Input
                    name={`title-${index + 1}`}
                    placeholder="Enter lecture title"
                    className="max-w-96"
                    onChange={(event) => handleCourseTitleChange(event, index)}
                    value={courseCurriculumFormData[index]?.title}
                  />

                  <div className="flex items-center space-x-2">
                    <Switch
                      onCheckedChange={(value) =>
                        handleFreePreviewChange(value, index)
                      }
                      checked={courseCurriculumFormData[index]?.freePreview}
                      id={`freePreview-${index + 1}`}
                    />
                    <Label htmlFor={`freePreview-${index + 1}`}>
                      Free Preview
                    </Label>
                  </div>
                </div>
                <div className=" mt-6">
                  {/* <h3 className="font-semibold">Video URL</h3> */}
                  {courseCurriculumFormData[index]?.videoUrl ? (
                    <div className="flex gap-3">
                      <VideoPlayer
                        url={courseCurriculumFormData[index]?.videoUrl}
                        
                      />
                      <Button>Replace Video</Button>
                      <Button className="bg-red-900">Delete Lecture</Button>
                    </div>
                  ) : (
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={(event) =>
                        handleSingleLectureUpload(event, index)
                      }
                      className="mb-4"
                    />
                  )}
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCurriculum;
