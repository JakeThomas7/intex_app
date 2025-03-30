import { NavLink } from "react-router-dom";

const AdminSidebar = ({ 
  isMobile, 
  isOpen, 
  onClose 
}: {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void; // Same as onToggleSidebar but more specific
}) => {
  // Define an array of routes for the sidebar
  const routes = [
    { path: "/admin", label: "Home", icon: "fa-house" },
    { path: "/admin/users", label: "Users", icon: "fa-user" },
    { path: "/admin/site", label: "Site", icon: "fa-pen" },
    // Add other routes here as needed
  ];

  return (
    <div
      className="shadow-sm d-flex flex-column text-white flex-shrink-0 p-4 admin-sidebar"
      style={{
        width: "280px",
        height: "100%",
        position: isMobile ? "fixed" : "sticky",
        top: 0,
        left: isMobile ? (isOpen ? 0 : -280) : 0,
        transition: "left 0.3s",
        zIndex: 1000,
      }}
    >
      <div className="d-flex justify-content-between align-items-center">
  <h5>
    Admin Portal
  </h5>
  <div className="text-end">
    <div className="sidebar-toggle d-block d-lg-none" onClick={onClose} style={{ cursor: "pointer" }}>
      <i className="fa-solid fa-chevron-left"></i>
    </div>
  </div>
</div>
      <hr />

      <ul className="nav nav-pills flex-column mb-auto">
        {routes.map((route) => (
          <li className="nav-item mb-2" key={route.path}>
            <NavLink
              to={route.path}
              end
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
              aria-current="page"
            >
              <i className={`fa-solid ${route.icon} me-2`}></i>
              {route.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <hr />
      <div className="nav nav-pills flex-column">
        <div className="nav-item">
          <NavLink to="/" end className="ps-2 nav-link">
            <i className="fa-solid fa-right-from-bracket me-2 fa-rotate-180"></i>
            Back
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;