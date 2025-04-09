import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Delete, Edit } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

function InstructorCourses() {
  const navigate = useNavigate()
  return (
    <Card>
      <CardHeader className="flex items-center justify-between flex-row">
        <CardTitle className="text-3xl font-extrabold">All Courses</CardTitle>
        <Button onClick={() => navigate("/instructor/create-new-course")} className="p-5">Create new course</Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden">
          <Table>
            
            <TableHeader>
              <TableRow>
                <TableHead >Course</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">React JS Full Course 2025</TableCell>
                <TableCell>100</TableCell>
                <TableCell>$2000</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Edit className="h06 w-6" />
                    
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Delete className="h06 w-6" />
                    
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default InstructorCourses;
