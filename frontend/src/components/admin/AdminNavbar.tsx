import { useAuth } from "../context/AuthContext";

const AdminNavbar = ({ 
  //isMobile, 
  onToggleSidebar 
}:{
  //isMobile: boolean;
  onToggleSidebar: () => void;
}) => {

  const { user } = useAuth();

  return (
      <div className="navbar shadow-sm admin-navbar sticky-top section-padding" style={{ zIndex: 999, height: "55px"}}>
        <div className="text-start">
          <div className="d-block d-lg-none" onClick={onToggleSidebar} style={{ cursor: "pointer" }}>
            <i className="fa-solid fa-grip-lines fa-lg"></i>
          </div>
        </div>

        <div className="text-end">
        </div>
      </div>
    
  );
};

export default AdminNavbar;