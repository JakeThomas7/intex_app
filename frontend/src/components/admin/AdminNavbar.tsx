import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RouteBreadcrumbs from "./RouteBreadcrumbs";

const AdminNavbar = ({ 
  //isMobile, 
  onToggleSidebar 
}:{
  //isMobile: boolean;
  onToggleSidebar: () => void;
}) => {

  const { user } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="navbar shadow-sm admin-navbar sticky-top section-padding d-flex align-items-center justify-content-between" 
    style={{ zIndex: 999, height: "55px" }}>
    
    {/* Left side - Hamburger & Breadcrumbs */}
    <div className="d-flex align-items-center">
      <div className="d-block d-lg-none me-3" onClick={onToggleSidebar} style={{ cursor: "pointer" }}>
        <i className="fa-solid fa-grip-lines fa-lg"></i>
      </div>
      <div className="d-none d-lg-block">
        <RouteBreadcrumbs />
      </div>
      
    </div>

    {/* Right side - User info */}
    <ul className="navbar-nav d-flex flex-row align-items-center">
      <li className="nav-item">
        <div className="d-flex align-items-center" onClick={() => navigate('/admin/users/account')} style={{ cursor: 'pointer' }}>
          <i className="fa-regular fa-user-circle me-2"></i>
          {user?.firstName 
            ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
            : user?.email
          }
        </div>
      </li>
    </ul>
    </div>
    
  );
};

export default AdminNavbar;