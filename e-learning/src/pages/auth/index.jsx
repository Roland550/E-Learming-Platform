import ComonForm from "@/components/common-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { GraduationCap } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const {
    signInFormData,
        setSignInFormData,
        signUpFormDat,
        setSignUpFormData,
        handleregisterUser,
        handleLoginUser
  }  = useContext(AuthContext)

  const handleTabChange = (value) => {
    setActiveTab(value);
  };


  function CheckSignInisValid (){
    return signInFormData && signInFormData.userEmail !=='' && signInFormData.password !== ''
  }
  function CheckSignUpisValid (){
    return signUpFormDat && signUpFormDat.userName !=='' && signUpFormDat.userEmail !=='' && signUpFormDat.password !== ''
  }
  console.log(signInFormData,signUpFormDat);
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to={"/"} className="flex items-center justify-center">
          <GraduationCap className="h-8 w-8 mr-4" />
          <span className="font-extrabold text-xl"> E-Learning</span>
        </Link>
      </header>
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Tabs
          values={activeTab}
          defaultValue="signin"
          onValueChange={handleTabChange}
          className="w-full max-w-md"
        >
          <TabsList className="grid w-full grid-cols-2 ">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Card className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>Sign in to your account</CardTitle>
                <CardDescription>
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <ComonForm
                  formControls={signInFormControls}
                  buttonText={"Sign in"}
                  formData={signInFormData}
                  setFormData={setSignInFormData}
                  isButtonDisabled={!CheckSignInisValid()}
                  handleSubmit={handleLoginUser}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup" >
            <Card className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>Create a new account</CardTitle>
                <CardDescription>
                  Enter your details to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <ComonForm
                  formControls={signUpFormControls}
                  buttonText={"Sign up"}
                  formData={signUpFormDat}
                  setFormData={setSignUpFormData}
                  isButtonDisabled={!CheckSignUpisValid()}
                  handleSubmit={handleregisterUser}

                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AuthPage;
