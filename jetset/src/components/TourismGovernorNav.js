import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Admin/navLogin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faChevronLeft,
  faSignOutAlt,
  faKey,
} from "@fortawesome/free-solid-svg-icons";

const TourismGovernor = ({ governorUsername }) => {
  const navigate = useNavigate();
  const { governorId } = useParams();

  const [profileMenuVisible, setProfileMenuVisible] = useState(false);

  useEffect(() => {
    // No notification fetching logic here
  }, [governorUsername]);

  const toggleProfileMenu = () => {
    setProfileMenuVisible((prev) => !prev);
  };

//   const handleGetProfile = () => {
//     navigate(`/governor/change-password/${governorId}`);
//   };

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/login");
  };
  const handleChangePass = () => {
    // localStorage.clear();
    navigate("/changepass");
  };


  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="tourism-governor-frontend">
      <header>
        <nav className="navbar">
          <div className="navbar-left" onClick={handleBack}>
            <FontAwesomeIcon icon={faChevronLeft} className="back-icon" />
          </div>
          <div className="navbar-center">
            <span className="app-title">Tourism Governor Dashboard</span>
          </div>
          <div className="navbar-right">
            <div className="governor-info">
              {/* <span className="username"> </span> */}
              <FontAwesomeIcon
                icon={faUser}
                className="profile-icon"
                onClick={toggleProfileMenu}
              />
              {profileMenuVisible && (
                <div className="profile-menu">
                 <button onClick={handleChangePass}>
                    {/* <FontAwesomeIcon
                      icon={faSignOutAlt}
                      className="menu-icon"
                    /> */}
                   🔑 Change Password
                  </button>
                  <button onClick={handleLogOut}>
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      className="menu-icon"
                    />
                    Log Out
                  </button>

                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default TourismGovernor;
