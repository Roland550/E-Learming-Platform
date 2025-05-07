import MediaProgressbar from "@/components/media-progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/service";
import React, { useContext } from "react";

function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const handleImageUploadChange = async (event) => {
    const seleTedImage = event.target.files[0];

    if (seleTedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", seleTedImage);
      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(imageFormData, setMediaUploadProgressPercentage);
        console.log("resonse", response);
        if (response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.url,
          });
          setMediaUploadProgress(false);  
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      <div className="p-4">
      {
          mediaUploadProgress ?
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
           />: null
        }
      </div>
      <CardContent>
        {courseLandingFormData.image ? (
          <img src={courseLandingFormData.image} alt="Course Image" />
        ) : (
          <div className="flex flex-col gap-3">
            <Label htmlFor="course-image">Upload Course Image</Label>
            <Input
              id="course-image"
              type="file"
              accept="image/*"
              onChange={handleImageUploadChange}
            />
          </div>
        )}
        
      </CardContent>
    </Card>
  );
}

export default CourseSettings;
