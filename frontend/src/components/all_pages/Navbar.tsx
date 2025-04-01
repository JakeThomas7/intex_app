import { useNavigate } from 'react-router-dom'
import { logout } from '../../api/AuthenticationAPI';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {

  const navigate = useNavigate();
  const { isAuth , checkAuth} = useAuth(); 

  return (
    <nav className="navbar main-navbar section-padding navbar-expand-lg bg-body-tertiary sticky-top navbar-color">
      <div className="container-fluid">
        <a className="navbar-brand grow" onClick={()=>navigate('/')}>
            Cervélo
        </a>
        <div className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <i className="fa-solid fa-grip-lines"></i>
        </div>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">

        <ul className="navbar-nav mb-lg-0">

          <li className="nav-item me-3">
              <a className="nav-link active" aria-current="page" onClick={()=>navigate('/')}>
                {/* <i className="fa-solid fa-house"></i>  */}
                Home
              </a>
            </li>

            <li className="nav-item me-3">
              <a className="nav-link active" aria-current="page" onClick={()=>navigate('/shop')}>
                Shop
              </a>
            </li>

            <li className="nav-item me-3">
              <a className="nav-link active" aria-current="page" onClick={()=>navigate('/')}>
                About
              </a>
            </li>

            <li className="nav-item me-3">
              <a className="nav-link active" aria-current="page" onClick={()=>navigate('/')}>
                Stories
              </a>
            </li>
          </ul>

          <ul className="navbar-nav mb-lg-0 mb-2 ms-auto">

            {isAuth &&
              <>
                <li className="nav-item me-3 mb-2 mb-lg-0">
                  <a className="nav-link active" aria-current="page" onClick={async () => {
                    await logout();
                    await checkAuth();
                    navigate('/');
                  }}>
                    Sign out
                  </a>
                </li>
                <li className="nav-item me-lg-3 mb-2 mb-lg-0 d-flex align-items-center">
                  <button className='btn btn-dark text-white grow' onClick={()=>navigate('/account')}>
                    My Account
                  </button>
                </li>
              </>
            }
            {!isAuth &&
              <>
                <li className="nav-item me-3 mb-2 mb-lg-0">
                  <a className="nav-link active" aria-current="page" onClick={()=>navigate('/login')}>
                    {/* <i className="fa-solid fa-user"></i>  */}
                    Log in
                  </a>
                </li>
                <li className="nav-item me-lg-3 mb-2 mb-lg-0 d-flex align-items-center">
                  <button className='btn btn-dark text-white grow' onClick={()=>navigate('/join')}>
                    Join Now
                  </button>
                </li>
              </>
            } 

            {isAuth &&
            <li className="nav-item d-flex align-items-center">
              <button className='btn btn-primary text-white grow' onClick={()=>navigate('/admin')}>
                <i className="fa-regular fa-circle-user me-2"></i>
                Admin
              </button>
            </li>
            }

          </ul>

        </div>
        </div>
      </nav>
  )
}

export default NavBar