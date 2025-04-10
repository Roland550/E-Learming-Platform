import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { InstructorContext } from '@/context/instructor-context'
import { mediaUploadService } from '@/service'
import React, { useContext } from 'react'

function CourseSettings() {
  const{ coursLandingFormData, setCoursLandingFormData} = useContext(InstructorContext)

  const handleImageUploadChange = async(event) => {
    const seleTedImage = event.target.files[0]

    if (seleTedImage) {
      const imageFormData = new FormData()
      imageFormData.append('file', seleTedImage)
      try {
        const response = await mediaUploadService(imageFormData)
        console.log('resonse', response);
        if(response.success){
          setCoursLandingFormData({
            ...coursLandingFormData,
            image: response.data.url,
          })
        }
        
      } catch (error) {
        console.error('Error uploading image:', error)
        
      }
    }

  }
  return (
    <Card>
       <CardHeader>
        <CardTitle>Course Settings</CardTitle>
       </CardHeader>
       <CardContent>
       {
        coursLandingFormData.image ? 
          <img src={coursLandingFormData.image} alt="Course Image" />:
          <div className="flex flex-col gap-3">
          <Label>Upload Course Image</Label>
          <Input
            type='file'
            accept='image/*'
            onChange={handleImageUploadChange} 
            
           />
        </div>
        
       }
        
       </CardContent>
    </Card>
  )
}

export default CourseSettings