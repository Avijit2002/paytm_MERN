import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignupPage from "./pages/signupPage";
import SigninPage from "./pages/signinPage";
//import AuthRoute from "./components/AuthRoute";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignupPage />}/> 
        <Route path="/signin" element={<SigninPage />}/> 
        <Route path="/dashboard" element={<DashboardPage />} /> 
        <Route path="/send" /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App;
