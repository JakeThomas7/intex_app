import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../../api/AuthenticationAPI";

const Account = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const {checkAuth} = useAuth();

  return (
    <div className="section-padding account-section d-flex justify-content-center align-items-center w-100">
        <div className="account-width">
            <h4 className="">Logged in as</h4>
            <h1 className="fw-bold">{user?.email}</h1>
            <hr/>
            <button className="btn btn-dark me-2 grow" onClick={async () => {
                await logout();
                await checkAuth();
                navigate('/');
            }}>Sign out</button>
            <button className="btn btn-primary text-white grow" onClick={()=> navigate('/admin')}>Continue to Admin</button>
        </div>
    </div>
  )
}

export default Account