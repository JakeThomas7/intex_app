import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import JoinPage from "./pages/JoinPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminHomePage from "./pages/admin/AdminHomePage";
import ManageSitePage from "./pages/admin/ManageSitePage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import CookieConsent from "./components/all_pages/CookieConsent";
import ProtectedRoute from "./components/all_pages/ProtectedRoute";
import { AuthProvider } from "./components/context/AuthContext";
import AccountPage from "./pages/AccountPage";
import ShopPage from "./pages/ShopPage";
import AdminAccountPage from "./pages/admin/AdminAccountPage";
import PrivacyPage from "./pages/PrivacyPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/details" element={<DetailsPage />} />
          <Route path="/login" element={<LoginPage />} />  {/* Lowercase */}
          <Route path="/join" element={<JoinPage />} />    {/* Lowercase */}
          
          {/* Protected User Route */}
          <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}
          >
            <Route index element={<AdminHomePage />} />
            <Route path="site" element={<ManageSitePage />} />
            <Route path="users">
              <Route index element={<ManageUsersPage />} />
              <Route path="account" element={<AdminAccountPage />} />
            </Route>
          </Route>

          {/* Optional: 404 Catch-all */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </Router>
      <CookieConsent />
    </AuthProvider>
  );
}

export default App;
