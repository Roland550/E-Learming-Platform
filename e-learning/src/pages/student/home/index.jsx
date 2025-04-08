import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { useContext } from "react";




function StudentHomePage() {
 const {resetCredential} = useContext(AuthContext)
  const handleLogout = () => {
    resetCredential();
    sessionStorage.clear();
  };
  return (
    <div>StudentHomePage
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  )
}

export default StudentHomePage