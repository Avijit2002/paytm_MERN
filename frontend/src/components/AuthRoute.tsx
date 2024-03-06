import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface authRouteType {
  children: React.ReactNode;
}

function AuthRoute({ children }: authRouteType) {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (localStorage.getItem("token")) {
      return true;
    } else {
      false;
    }
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        navigate("/signin");
      }
    setInterval(() => {
      if (localStorage.getItem("token")) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        navigate("/signin");
      }
    }, 1000);
  }, [isAuthenticated, setIsAuthenticated]);

  return <>{isAuthenticated ? children : null}</>;
}

export default AuthRoute;
