import { Navigate, Route } from "react-router-dom"

interface authRouteType{
    path: string;
    element: React.ReactElement
}

function AuthRoute({path, element}:authRouteType) {
    if(!localStorage.getItem("token")){
        <Navigate to="/signin" />
    }
    return (
        <Route path={path} element={element} />
    )
}

export default AuthRoute
