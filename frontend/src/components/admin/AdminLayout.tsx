import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

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
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <AdminSidebar 
        isMobile={isMobile} 
        isOpen={isSidebarOpen} 
        onClose={toggleSidebar} 
      />
      
      <div className="flex-grow-1" style={{ overflowY: "auto", height: "100vh" }}>
        <AdminNavbar isMobile={isMobile} onToggleSidebar={toggleSidebar} />
        
        <div className="p-3">
          <Outlet /> {/* This is where child routes will render */}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;