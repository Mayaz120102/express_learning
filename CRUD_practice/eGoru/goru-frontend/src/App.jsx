import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoruAuthProvider } from "./context/GoruAuthContext";
import GoruLayout from "./components/layout/GoruLayout";
import GoruProtectedRoute from "./components/GoruProtectedRoute";
import GoruPublicRoute from "./components/GoruPublicRoute";
import { Toaster } from "react-hot-toast";

import GoruHome from "./pages/GoruHome";
import GoruAbout from "./pages/About";
import GoruLogin from "./pages/GoruLogin";
import GoruRegister from "./pages/GoruRegister";
import GoruDashboard from "./pages/GoruDashBoard";
import GoruCowList from "./pages/GoruCowList";
import GoruCowDetail from "./pages/GoruCowDetail";
import GoruAddCow from "./pages/GoruAddCow";
import GoruEditCow from "./pages/GoruEditCow";
import GoruMyOrders from "./pages/GoruMyOrders";
import GoruNotFound from "./pages/GoruNotFound";

const App = () => {
  return (
    <BrowserRouter>
      <GoruAuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "10px",
              fontFamily: "inherit",
            },
            success: {
              iconTheme: {
                primary: "#15803d",
                secondary: "#fff",
              },
            },
          }}
        />
        <GoruLayout>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<GoruHome />} />
            <Route path="/about" element={<GoruAbout />} />
            <Route path="/cows" element={<GoruCowList />} />
            <Route path="/cows/:id" element={<GoruCowDetail />} />

            {/* Auth routes — redirect if already logged in */}
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

            {/* Seller only */}
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

            {/* Buyer only */}
            <Route
              path="/my-orders"
              element={
                <GoruProtectedRoute allowedRoles={["buyer"]}>
                  <GoruMyOrders />
                </GoruProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<GoruNotFound />} />
          </Routes>
        </GoruLayout>
      </GoruAuthProvider>
    </BrowserRouter>
  );
};

export default App;
