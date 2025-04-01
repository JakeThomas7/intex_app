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

          <button className='btn btn-dark text-white grow'>
            <i className="fa-regular fa-circle-user me-2"></i>
            {user?.email}
          </button>
        </div>
      </div>
    
  );
};

export default AdminNavbar;