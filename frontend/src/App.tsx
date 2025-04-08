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
import DetailsPage from "./pages/DetailsPage";
import AdminProtectedRoute from "./components/all_pages/AdminProtectedRoute";
import ScrollToTop from "./components/all_pages/ScrollToTop";
import ChatbotPage from "./pages/ChatbotPage";
import JoinMovieUserPage from "./pages/JoinPageMovieUserPage";
import AdminEditMoviePage from "./pages/admin/AdminEditMoviePage";
import AdminAddTitlePage from "./pages/admin/AdminAddTitlePage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop/>  
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<ShopPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/details" element={<DetailsPage />} />
          <Route path="/ai" element={<ChatbotPage />} />
          <Route path="/login" element={<LoginPage />} />  
          <Route path="/join" element={<JoinPage />} />    
          <Route path="/accountsetup" element={<JoinMovieUserPage />} />    
          
          {/* Protected User Route */}
          <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}
          >
  
            <Route index element={<AdminHomePage />} />
            <Route path="add/:type" element={<AdminAddTitlePage />} />
            <Route path="add" element={<AdminAddTitlePage />} />
            <Route path="edit" element={<AdminEditMoviePage />} />

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
