import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import registerService, { checkAuthService, loginService } from "@/service";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormDat, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true); // Add loading state

  async function handleregisterUser(event) {
    event.preventDefault();
    try {
      const response = await registerService(signUpFormDat);
      console.log(response);
      console.log("Login successful:", response);
    } catch (error) {
      console.error(error);
      console.log("Error registering user");
    }
  }

  async function handleLoginUser(event) {
    event.preventDefault();
    try {
      const data = await loginService(signInFormData);
      if (data.success) {
        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(data.data.accessToken)
        );
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        // Clear form data after successful login
        setSignInFormData(initialSignInFormData);
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
      }
      console.log(data);
      console.log("User logged in successfully");
    } catch (error) {
      console.error(error);
      console.log("Error logging user");
    }
  }

  // Check auth user
  async function checkAuthUser() {
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false); // Stop loading
        return;
      }
      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        sessionStorage.removeItem("accessToken");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuth({
        authenticate: false,
        user: null,
      });
      sessionStorage.removeItem("accessToken");
    } finally {
      setLoading(false); // Stop loading after auth check
    }
  }

  useEffect(() => {
    checkAuthUser();
  }, []);


  function resetCredential(){
    setAuth({
      authenticate: false,
      user: null
    })
  }


  if (loading) {
    // Render Skeleton while loading
    return <Skeleton className="h-screen w-full" />;
  }

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormDat,
        setSignUpFormData,
        handleregisterUser,
        handleLoginUser,
        auth,
        resetCredential
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
