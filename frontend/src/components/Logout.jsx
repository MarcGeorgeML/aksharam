import { useEffect } from "react";
import { Navigate } from "react-router-dom";  // Import Navigate for redirection

const Logout = () => {
  useEffect(() => {
    localStorage.clear();
  }, []);

  return <Navigate to="/login" />;
};

export default Logout;
