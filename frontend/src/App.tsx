import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignupPage from "./pages/signupPage";
import SigninPage from "./pages/signinPage";
//import AuthRoute from "./components/AuthRoute";
import DashboardPage from "./pages/DashboardPage";
import AuthRoute from "./components/AuthRoute";
import SendMoney from "./pages/SendMoney";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route
          path="/"
          element={
            <AuthRoute>
              <DashboardPage />
            </AuthRoute>
          }
        >
          <Route path="/send" element={<SendMoney />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
