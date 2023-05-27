import React, { useContext } from "react";
import Logo from "../images/img1.png";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

function Navbar() {
  
  const navigate = useNavigate();

  const { currentUser, logout } = useContext(AuthContext);
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="container">
        <Link to="/">
          <div className="logo">
            <img src={Logo} alt="error" />
            <span className="title">Enlighten</span>
          </div>
        </Link>

        <div className="links">
          <Link className="link" to="/?cat=art">
            <h6>ART</h6>
          </Link>
          <Link className="link" to="/?cat=travel">
            <h6>TRAVEL</h6>
          </Link>
          <Link className="link" to="/?cat=technology">
            <h6>TECHNOLOGY</h6>
          </Link>
          <Link className="link" to="/?cat=growth">
            <h6>GROWTH</h6>
          </Link>
          <Link className="link" to="/?cat=cinema">
            <h6>CINEMA</h6>
          </Link>
          <Link className="link" to="/?cat=sports">
            <h6>SPORTS</h6>
          </Link>
          <Link className="link" to="/?cat=food">
            <h6>FOOD</h6>
          </Link>
        </div>

        <div className="rightlinks">
          <span>
            {" "}
            <Link to="/">Home</Link>{" "}
          </span>
          {currentUser ? (
            <span className="write">
              <Link to="/write">Write</Link>
            </span>
          ) : (
            <span className="write">
              <Link to="/login">Write</Link>
            </span>
          )} 
          
          <span className=" login"><Link to="/profile">{currentUser?.username}</Link></span>

          {currentUser ? (
            <span className=" login" onClick={handleLogout}>LogOut</span>
          ) : (
            <>
              <Link className="link login" to="/login">
                Login
              </Link>
              <Link className="link login" to="/register">
                SignUp
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
