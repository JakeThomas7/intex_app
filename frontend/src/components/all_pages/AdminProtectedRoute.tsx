import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, checkAuth } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    
    async function verifyAuth() {
      await checkAuth();
      if (isMounted) {
        setIsChecking(false);
      }
    }

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [checkAuth, location.pathname]); // Re-run when route changes

  if (isChecking) {
    return <div></div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;