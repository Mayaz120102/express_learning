// App.jsx — defines all routes of the application
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoruAuthProvider } from "./context/GoruAuthContext";
import GoruLayout from "./components/layout/GoruLayout";
import GoruHome from "./pages/GoruHome";
import GoruNotFound from "./pages/GoruNotFound";
import About from "./pages/About";

const App = () => {
  return (
    // BrowserRouter enables URL-based navigation
    <BrowserRouter>
      {/* AuthProvider wraps everything — auth state available everywhere */}
      <GoruAuthProvider>
        <GoruLayout>
          <Routes>
            <Route path="/" element={<GoruHome />} />
            {/* More routes added as we build each feature */}
            <Route path="*" element={<GoruNotFound />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </GoruLayout>
      </GoruAuthProvider>
    </BrowserRouter>
  );
};

export default App;
