import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import "../../styles/admin/Admin.css"

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width < 992;

  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    console.log('sidebar Toggle')
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="d-flex flex-grow-1" 
    style={{
      height: "100vh",}}
    >
      <AdminSidebar 
        isMobile={isMobile} 
        isOpen={isSidebarOpen} 
        onClose={toggleSidebar}
      />
      
      <div className="flex-grow-1 admin-background" style={{ height: "100vh", overflowY: "auto" }}>
        <div>
          <AdminNavbar 
          //isMobile={isMobile} 
          onToggleSidebar={toggleSidebar} />
          
          <div className="">
            <Outlet /> {/* This is where child routes will render */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;