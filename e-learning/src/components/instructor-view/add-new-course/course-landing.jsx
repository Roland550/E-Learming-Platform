import FormControls from '@/components/common-form/form-controls'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { courseLandingPageFormControls } from '@/config'
import { InstructorContext } from '@/context/instructor-context'
import React, { useContext } from 'react'

function CourseLanding() {
    const{ coursLandingFormData, setCoursLandingFormData} = useContext(InstructorContext)
  return (
    <Card>
        <CardHeader>
            <CardTitle>Course Landing Page</CardTitle>
        </CardHeader>
        <CardContent>
            <FormControls
            formControls={courseLandingPageFormControls}
            formData={coursLandingFormData}
            setFormData={setCoursLandingFormData}
            />
        </CardContent>
    </Card>
  )
}

export default CourseLanding