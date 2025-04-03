import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import JoinPage from './pages/JoinPage'
import AdminLayout from './components/admin/AdminLayout'
import AdminHomePage from './pages/admin/AdminHomePage'
import ManageSitePage from './pages/admin/ManageSitePage'
import ManageUsersPage from './pages/admin/ManageUsersPage'
import CookieConsent from './components/all_pages/CookieConsent'
import ProtectedRoute from './components/all_pages/ProtectedRoute'
import { AuthProvider } from './components/context/AuthContext'
import AccountPage from './pages/AccountPage'
import ShopPage from './pages/ShopPage'
import AdminAccountPage from './pages/admin/AdminAccountPage'
import AdminProtectedRoute from './components/all_pages/AdminProtectedRoute'
import DetailsPage from './pages/DetailsPage'


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/details" element={<DetailsPage />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/Join" element={<JoinPage />} />
          <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />

          {/* Protected Routes */}
          <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
            <Route index element={<ManageUsersPage />} />
            <Route path="site" element={<ManageSitePage />} />
            <Route path="users" element={<ManageUsersPage />} />
            <Route path="account" element={<AdminAccountPage />} />
          </Route>
        </Routes>
      </Router>
      <CookieConsent />
    </AuthProvider>
  );
}

export default App
