import  { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import Head from "./Head";
import "./header.css";
import UserMenu from "./UserMennu";
import { getAuthCookie, isAuthenticated } from "../../auth";
import { AuthContext } from "../../auth/authcontext";

const Header = () => {
  const { userDetails } = useContext(AuthContext);
  const [click, setClick] = useState(false);
  const user = getAuthCookie();
  return (
    <>
      <Head />
      <header>
        <nav className="flexSB">
          <ul
            className={click ? "mobile-nav" : "flexSB "}
            onClick={() => setClick(false)}
          >
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/courses">All Courses</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>

            <li>
              <NavLink to="/pricing">FAQ'S</NavLink>
            </li>

            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
            {(user?.role === "admin" || userDetails?.role === "admin") && (
              <>
                <li>
                  <NavLink to="/admin-dashboard">Dashboard</NavLink>
                </li>
                <li>
                  <NavLink to="/analytics">Analytics</NavLink>
                </li>
              </>
            )}
            {(!isAuthenticated() || userDetails === null) && (
              <>
                <li>
                  <NavLink to="/login">
                    <div className="get">Login</div>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/signup">
                    <div className="get">Sign Up</div>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
          <div className="start">
            {(isAuthenticated() || !!userDetails?.id) && <UserMenu />}
          </div>
          <button className="toggle" onClick={() => setClick(!click)}>
            {click ? (
              <i className="fa fa-times"> </i>
            ) : (
              <i className="fa fa-bars"></i>
            )}
          </button>
        </nav>
      </header>
    </>
  );
};

export default Header;
