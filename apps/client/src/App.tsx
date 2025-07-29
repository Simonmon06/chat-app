import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" index element={<HomePage />} />
        <Route
          path="/signup"
          element={
            <div className="flex items-center justify-center h-screen">
              <SignUpPage />
            </div>
          }
        />
        <Route
          path="/login"
          element={
            <div className="flex items-center justify-center h-screen">
              <LoginPage />
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
