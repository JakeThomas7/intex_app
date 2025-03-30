import { NavLink } from "react-router-dom";


const AdminSidebar = ({ 
  isMobile, 
  isOpen, 
  onClose 
} : {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void; // Same as onToggleSidebar but more specific
}) => {
  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-4 bg-light"
      style={{
        width: "280px",
        height: "100vh",
        position: isMobile ? "fixed" : "sticky",
        top: 0,
        left: isMobile ? (isOpen ? 0 : -280) : 0,
        transition: "left 0.3s",
        zIndex: 1000,
      }}
    >
      {isMobile && (
        <div
          onClick={onClose}
          className="position-absolute end-0 me-2"
          style={{ top: 10, cursor: "pointer" }}
        >
          <i className="fa-solid fa-chevron-left"></i>
        </div>
      )}
      
      <h4 className="fw-bold">Admin Panel</h4>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">

        <li className="nav-item mb-2">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
            aria-current="page"
          >
            <i className="fa-solid fa-house me-2"></i>
            Home
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink
            to="/admin/users"
            end
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
            aria-current="page"
          >
            <i className="fa-solid fa-user me-2"></i>
            Users
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink
            to="/admin/site"
            end
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
            aria-current="page"
          >
            <i className="fa-solid fa-pen me-2"></i>
            Site
          </NavLink>
        </li>

        {/* Other menu items... */}
      </ul>
      <hr />
      <NavLink
        to="/"
        end
        className='ps-2 nav-link'
      >
        <i className="fa-solid fa-right-from-bracket me-2 fa-rotate-180"></i>
        Back
      </NavLink>
    </div>
  );
};

export default AdminSidebar;