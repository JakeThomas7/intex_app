import { useNavigate } from 'react-router-dom';
import { logout } from '../../api/AuthenticationAPI';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const navigate = useNavigate();
  const { isAdmin, isAuth, user, checkAuth } = useAuth();

  return (
    <nav className="navbar main-navbar section-padding navbar-expand-lg bg-body-tertiary sticky-top navbar-color border-bottom thin-border">
      <div className="container-fluid">
        <a
          className="navbar-brand grow righteous-title"
          onClick={() => navigate(isAuth ? '/browse' : '/')}
        >
          CineNiche
        </a>
        <div
          className="navbar-toggler text-white"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fa-solid fa-grip-lines"></i>
        </div>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mb-lg-0">
            {/* <li className="nav-item me-3">
              <a className="nav-link active" aria-current="page" onClick={()=>navigate('/')}>
                Home
              </a>
            </li> */}

            {isAuth && (
              <li className="nav-item me-3">
                <a
                  className="nav-link active"
                  aria-current="page"
                  onClick={() => navigate('/browse')}
                >
                  Recommendations
                </a>
              </li>
            )}

            {/* <li className="nav-item me-3">
              <a className="nav-link active" aria-current="page" onClick={()=>navigate('/ai')}>
                Chat Bot
              </a>
            </li> */}
          </ul>

          <ul className="navbar-nav mb-lg-0 mb-2 ms-auto">
            {isAuth && (
              <>
                <li className="nav-item me-3 mb-2 mb-lg-0">
                  <a
                    className="nav-link active"
                    aria-current="page"
                    onClick={async () => {
                      await logout();
                      await checkAuth();
                      navigate('/');
                    }}
                  >
                    Sign out
                  </a>
                </li>
                {/* <li className="nav-item me-lg-3 mb-2 mb-lg-0 d-flex align-items-center">
                  <button className='btn btn-dark text-white grow' onClick={()=>navigate('/account')}>
                    My Account
                  </button>
                </li> */}
              </>
            )}
            {!isAuth && (
              <>
                <li className="nav-item me-3 mb-2 mb-lg-0">
                  <a
                    className="nav-link active"
                    aria-current="page"
                    onClick={() => navigate('/login')}
                  >
                    Log in
                  </a>
                </li>
                <li className="nav-item me-lg-3 mb-2 mb-lg-0 d-flex align-items-center">
                  <button
                    className="btn btn-primary text-white grow"
                    onClick={() => navigate('/join')}
                  >
                    Join Now
                  </button>
                </li>
              </>
            )}

            {isAuth && !isAdmin && (
              <li className="nav-item d-flex align-items-center text-gray me-3">
                <button className="btn btn-primary text-white grow">
                  <span className="me-2">{user?.email}</span>
                  <i className="fa-regular fa-circle-user me-2"></i>
                </button>
              </li>
            )}

            {isAdmin && (
              <li className="nav-item d-flex align-items-center">
                <button
                  className="btn btn-primary text-white grow"
                  onClick={() => navigate('/admin')}
                >
                  <i className="fa-regular fa-circle-user me-2"></i>
                  Admin
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
