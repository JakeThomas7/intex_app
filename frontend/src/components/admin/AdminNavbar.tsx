const AdminNavbar = ({ 
  isMobile, 
  onToggleSidebar 
}:{
  isMobile: boolean;
  onToggleSidebar: () => void;
}) => {
  return (
    isMobile && (
      <div className="navbar d-block d-lg-none sticky-top bg-light section-padding" style={{ zIndex: 999 }}>
        <div onClick={onToggleSidebar} style={{ cursor: "pointer" }}>
          <i className="fa-solid fa-grip-lines fa-lg"></i>
        </div>
      </div>
    )
  );
};

export default AdminNavbar;