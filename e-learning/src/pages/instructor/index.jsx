import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/service";
import { BarChart, Book, LogOut } from "lucide-react";
import { useContext, useEffect, useState } from "react";

function InstructorDashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const {resetCredential} = useContext(AuthContext);

  const {instructorCourseList, setInstructorCourseList} = useContext(InstructorContext)

  async function fetchAllCourse() {
    const response = await fetchInstructorCourseListService()

    console.log(response);
    if(response?.success) setInstructorCourseList(response?.data)
    
  }

  useEffect(() => {
   fetchAllCourse();
  }, [])
  

  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: <InstructorDashboard listOfCourses={instructorCourseList}/>,
    },
    {
      icon: Book,
      label: "My Courses",
      value: "courses",
      component: <InstructorCourses listOfCourses={instructorCourseList} />,
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    },
  ];
  
  const handleLogout = () => {
    resetCredential();
    sessionStorage.clear();
  };

  console.log("instructorCourseList", instructorCourseList);
  

  return (
    <div className="flex h-full min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4">
          <h2 className="text-2xl font-bold md-4">Instructor View</h2>
          <nav>
            {menuItems.map((menuItem) => (
              <Button
                className="w-full justify-start mb-2"
                key={menuItem.value}
                variant={activeTab === menuItem.value ? "secondary" : "ghost"}
                onClick={menuItem.value === 'logout' ? handleLogout: ()  =>setActiveTab(menuItem.value)  }

              >
                <menuItem.icon className="mr-2 h-4 w-4" />
                {menuItem.label}
              </Button>
            ))}
          </nav>

          
        </div>
      </aside>
      <main className="flex-1  overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold mb-8"> Dashboard</h1>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                {menuItems.map((menuItem) => <TabsContent key={menuItem.value} value={menuItem.value}>
                  {
                    menuItem.component !== null ? menuItem.component : null
                  }
                </TabsContent>
                )}

              </Tabs>
            </div>
          </main>
    </div>
  );
}

export default InstructorDashboardPage;
