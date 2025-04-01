import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuth, checkAuth } = useAuth();
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
    return <div>Verifying authentication...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;