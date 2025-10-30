import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const { token, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark shadow-lg">
        <div className="container-fluid px-4">
          {/* Brand/Logo - Enhanced */}
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <span className="bg-white text-primary rounded-circle p-2 me-2 d-flex align-items-center justify-content-center" 
                  style={{width: '42px', height: '42px'}}>
              <i className="bi bi-chat-square-text fs-5"></i>
            </span>
            <span className="fw-bold fs-4 d-none d-sm-inline">Feedback Hub</span>
            <span className="fw-bold fs-4 d-inline d-sm-none">Feedback</span>
          </Link>

          {/* Mobile Toggle Button */}
          <button
            className="navbar-toggler border-0 shadow-sm"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation Items */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-1">
              {token ? (
                // Authenticated User Menu
                <>
                  <li className="nav-item">
                    <Link to="/" className="nav-link px-3 py-2 rounded-3">
                      <i className="bi bi-house-door me-2"></i>
                      <span className="fw-medium">Dashboard</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/add-feedback" className="nav-link px-3 py-2 rounded-3">
                      <i className="bi bi-plus-circle me-2"></i>
                      <span className="fw-medium">New Feedback</span>
                    </Link>
                  </li>
                  <li className="nav-item d-none d-lg-block">
                    <div className="vr mx-2" style={{height: '30px', opacity: 0.3}}></div>
                  </li>
                  <li className="nav-item">
                    <div className="d-flex align-items-center bg-white bg-opacity-10 rounded-pill px-3 py-2 mx-lg-1">
                      <div className="bg-white bg-opacity-25 rounded-circle p-1 me-2 d-flex align-items-center justify-content-center"
                           style={{width: '32px', height: '32px'}}>
                        <i className="bi bi-person-fill text-white"></i>
                      </div>
                      <span className="text-white fw-medium small">{user?.name || 'User'}</span>
                    </div>
                  </li>
                  <li className="nav-item ms-lg-2">
                    <button 
                      onClick={handleLogout}
                      className="btn btn-light text-primary px-4 py-2 rounded-pill fw-semibold shadow-sm border-0"
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                // Guest Menu
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link px-3 py-2 rounded-3">
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      <span className="fw-medium">Login</span>
                    </Link>
                  </li>
                  <li className="nav-item ms-lg-2">
                    <Link to="/register" className="btn btn-light text-primary px-4 py-2 rounded-pill fw-semibold shadow-sm border-0">
                      <i className="bi bi-person-plus me-2"></i>
                      Get Started
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Inline Styles for Enhanced Design */}
      <style>{`
        /* Gradient Background */
        .navbar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          padding: 0.75rem 0;
          position: sticky;
          top: 0;
          z-index: 1030;
        }
        
        /* Nav Links Hover Effect */
        .nav-link {
          color: rgba(255, 255, 255, 0.95) !important;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .nav-link:hover {
          color: white !important;
          background-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-1px);
        }
        
        /* Button Hover Effects */
        .btn-light {
          transition: all 0.3s ease;
        }
        
        .btn-light:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2) !important;
          background-color: white !important;
        }
        
        /* Brand Logo Hover */
        .navbar-brand {
          transition: transform 0.3s ease;
        }
        
        .navbar-brand:hover {
          transform: scale(1.05);
        }
        
        /* User Badge Animation */
        .bg-opacity-10 {
          transition: all 0.3s ease;
        }
        
        .bg-opacity-10:hover {
          background-color: rgba(255, 255, 255, 0.2) !important;
        }
        
        /* Mobile Responsive Adjustments */
        @media (max-width: 991.98px) {
          .navbar-nav {
            padding-top: 1rem;
            gap: 0.5rem;
          }
          
          .nav-item .btn-light {
            width: 100%;
            text-align: center;
          }
          
          .nav-link {
            padding: 0.75rem 1rem !important;
          }
        }
        
        /* Toggler Animation */
        .navbar-toggler:focus {
          box-shadow: none;
          outline: 2px solid rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </>
  );
};

export default Navbar;