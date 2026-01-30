import React, { useState } from "react";
import { Link } from "react-router-dom";
import Head from "./Head";
import "./header.css";
import UserMenu from "./UserMennu";
import { getAuthCookie, isAuthenticated } from "../../auth";

const Header = () => {
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
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/courses">All Courses</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
           
            <li>
              <Link to="/pricing">FAQ'S</Link>
            </li>

            <li>
              <Link to="/contact">Contact</Link>
            </li>
            {user?.role === "admin" && (
              <li>
                <Link to="/admin-dashboard">Dashboard</Link>
              </li>
            )}
            {!isAuthenticated() && (
              <>
                <li>
                  <Link to="/login">
                    <div className="get">Login</div>
                  </Link>
                </li>
                <li>
                  <Link to="/signup">
                    <div className="get">Sign Up</div>
                  </Link>
                </li>
              </>
            )}
          </ul>
          <div className="start">{isAuthenticated() && <UserMenu />}</div>
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
