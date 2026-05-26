import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoruAuthProvider } from "./context/GoruAuthContext";
import GoruLayout from "./components/layout/GoruLayout";
import GoruProtectedRoute from "./components/GoruProtectedRoute";
import GoruPublicRoute from "./components/GoruPublicRoute";

import GoruHome from "./pages/GoruHome";
import GoruAbout from "./pages/About";
import GoruLogin from "./pages/GoruLogin";
import GoruRegister from "./pages/GoruRegister";
import GoruDashboard from "./pages/GoruDashboard";
import GoruCowList from "./pages/GoruCowList";
import GoruCowDetail from "./pages/GoruCowDetail";
import GoruAddCow from "./pages/GoruAddCow";
import GoruEditCow from "./pages/GoruEditCow";
import GoruNotFound from "./pages/GoruNotFound";

const App = () => {
  return (
    <BrowserRouter>
      <GoruAuthProvider>
        <GoruLayout>
          <Routes>
            <Route path="/" element={<GoruHome />} />
            <Route path="/about" element={<GoruAbout />} />
            <Route path="/cows" element={<GoruCowList />} />
            <Route path="/cows/:id" element={<GoruCowDetail />} />

            <Route
              path="/login"
              element={
                <GoruPublicRoute>
                  <GoruLogin />
                </GoruPublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GoruPublicRoute>
                  <GoruRegister />
                </GoruPublicRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <GoruProtectedRoute allowedRoles={["seller", "admin"]}>
                  <GoruDashboard />
                </GoruProtectedRoute>
              }
            />
            <Route
              path="/cows/add"
              element={
                <GoruProtectedRoute allowedRoles={["seller", "admin"]}>
                  <GoruAddCow />
                </GoruProtectedRoute>
              }
            />
            <Route
              path="/cows/:id/edit"
              element={
                <GoruProtectedRoute allowedRoles={["seller", "admin"]}>
                  <GoruEditCow />
                </GoruProtectedRoute>
              }
            />

            <Route path="*" element={<GoruNotFound />} />
          </Routes>
        </GoruLayout>
      </GoruAuthProvider>
    </BrowserRouter>
  );
};

export default App;
