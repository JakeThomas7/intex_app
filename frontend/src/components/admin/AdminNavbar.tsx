const AdminNavbar = ({ 
  isMobile, 
  onToggleSidebar 
}:{
  isMobile: boolean;
  onToggleSidebar: () => void;
}) => {
  return (
      <div className="navbar shadow-sm admin-navbar sticky-top section-padding" style={{ zIndex: 999, height: "55px"}}>
        <div className="text-start">
          <div className="d-block d-lg-none" onClick={onToggleSidebar} style={{ cursor: "pointer" }}>
            <i className="fa-solid fa-grip-lines fa-lg"></i>
          </div>
        </div>

        <div className="text-end">
              <i className="fa-regular fa-circle-user me-2"></i>
              Welcome Jake
        </div>
      </div>
    
  );
};

export default AdminNavbar;