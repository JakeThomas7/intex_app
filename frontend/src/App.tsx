import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import JoinPage from './pages/JoinPage'
import AdminLayout from './components/admin/AdminLayout'
import AdminHomePage from './pages/admin/AdminHomePage'
import ManageSitePage from './pages/admin/ManageSitePage'
import ManageUsersPage from './pages/admin/ManageUsersPage'
import CookieConsent from './components/all_pages/CookieConsent'

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/Join" element={<JoinPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHomePage />} />
            <Route path="site" element={<ManageSitePage />} />
            <Route path="users" element={<ManageUsersPage />} />
          </Route>
        </Routes>
      </Router>
      <CookieConsent />
    </div>
  )
}

export default App
