import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player/index";
import { courseLandingInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { mediaBulkUploadService, mediaUploadDeleteService, mediaUploadService } from "@/service";
import { Label } from "@radix-ui/react-label";
import { Upload } from "lucide-react";
import { useContext, useRef } from "react";

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

  const bulkLectureUploadRef = useRef(null);
  
  const isCourseCurriculumFormValid = () => {
    return courseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item == "object" &&
        item.title &&
        item.title.trim() !== "" &&
        item.videoUrl &&
        item.videoUrl.trim() !== ""
      );
    });
  };

  // Function to handle replacing the video URL
  async function handleReplaceVideo(currentIndex) {
    let copyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentVideoPublicId =
      copyCourseCurriculumFormData[currentIndex].public_id;
    const deleteResponse = await mediaUploadDeleteService(
      getCurrentVideoPublicId
    );
    if (deleteResponse?.success) {
      copyCourseCurriculumFormData[currentIndex] = {
        ...copyCourseCurriculumFormData[currentIndex],
        videoUrl: "",
        public_id: "",
      };
      setCourseCurriculumFormData(copyCourseCurriculumFormData);
    }
  }


  function areAllCourseCurriculumFormDataObjectsEmpty(arr){
    return arr.every((obj) => {
      return Object.entries(obj).every(([key, value])=>{
        if(typeof value == 'boolean'){
          return true
        } 
        return value === '';

      });
    });
  }
  function handleOpenBulkUpload (){
    bulkLectureUploadRef.current?.click();
  }

  async function handleMediaBulkUpload(event){
    const selectedFiles = Array.from(event.target.files);
    const bulkFormData = new FormData();
    selectedFiles.forEach((fileItem) => {
      bulkFormData.append("files", fileItem);
    });
    try {
      setMediaUploadProgress(true);
      const response = await mediaBulkUploadService(
        bulkFormData,
        setMediaUploadProgressPercentage
      );
      console.log(response, "Bresponse");
      if(response?.success){
        let copyCourseCurriculumFormData = areAllCourseCurriculumFormDataObjectsEmpty(courseCurriculumFormData) 

        ?[] : [...courseCurriculumFormData]

        copyCourseCurriculumFormData=[
          ...copyCourseCurriculumFormData,
          ...response.data.map((item, index) => ({
            videoUrl: item.url,
            public_id: item.public_id,
            title: `Lecture ${copyCourseCurriculumFormData.length + ( index + 1) }`,
            freePreview: false
          }))
        ]
        
        setCourseCurriculumFormData(copyCourseCurriculumFormData);
        setMediaUploadProgress(false);
      }
      
    } catch (error) {
      console.error("Error uploading video:", error);
    }

    
    
  }

  console.log(courseCurriculumFormData);

  return (
    <Card>
      <CardHeader className="flex  justify-between flex-row">
        <CardTitle>Create Course Curriculum</CardTitle>
        <div>
          <Input
            type="file"
            ref={bulkLectureUploadRef}
            accept="video/*"
            multiple
            className="hidden"
            id="bulk-media-upload"
            onChange={handleMediaBulkUpload}
          />
          <Button
            as="label"
            htmlFor="bulk-media-upload"
            variant="outline"
            className="cursor-pointer"
            onClick={handleOpenBulkUpload}
          >
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          disabled={!isCourseCurriculumFormValid() || mediaUploadProgress}
          onClick={handleNewLecture}
        >
          Add lecture
        </Button>
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
                      <Button onClick={() => handleReplaceVideo(index)}>
                        Replace Video
                      </Button>
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
