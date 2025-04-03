
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import registerService, { checkAuthService, loginService } from "@/service";
import { createContext, use, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormDat, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });

  async function handleregisterUser(event) {
    event.preventDefault();
    try {
      const response = await registerService(signUpFormDat);
      console.log(response);
      console.log('Login successful:', response);
      
    } catch (error) {
      console.error(error);
      console.log('Error registering user');
      // Add error handling here
    }
    
    
  }
  async function handleLoginUser(event) {
    event.preventDefault();
    try {
      const data = await loginService(signInFormData);
      if(data.success){
        sessionStorage.setItem('accessToken', JSON.stringify(data.data.accessToken));
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      }else{
        setAuth({
          authenticate: false,
          user: null,
        });
      }
      console.log(data);
      console.log('User logged in successfully');
      
    } catch (error) {
      console.error(error);
      console.log('Error loging user');
      
    }
    
    
  }

  // check auth user
  async function checkAuthUser(){
    const data = await checkAuthService();
    if(data.success){
      setAuth({
        authenticate: true,
        user: data.data.user,
      });
    }else{
      setAuth({
        authenticate: false,
        user: null,
      });
    }
  }

  useEffect(() => {
    checkAuthUser();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormDat,
        setSignUpFormData,
        handleregisterUser,
        handleLoginUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
