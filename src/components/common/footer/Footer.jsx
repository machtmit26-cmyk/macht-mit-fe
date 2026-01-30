import React from "react"
import { blog } from "../../../dummydata"
import "./footer.css"
import Logo from "./Logo.jpg";
import { Link } from "react-router-dom"
const Footer = () => {
  return (
    <>
      <section className='newletter'>
        <div className='container flexSB'>
          <div className='left row'>
            <h1>Macht-Mit - Stay tune and get the latest update</h1>
            
          </div>
          <div className='right row'>
            <input type='text' placeholder='Enter email address' />
            <i className='fa fa-paper-plane'></i>
          </div>
        </div>
      </section>
      <footer>
        <div className='container padding'>
          <div className='box logo'>
            <img src={Logo} alt="Logo" />
           <span><br></br>The essence of Macht Mit lies in its simplicity and sincerity. It transcends language and profession, reaching the human spirit that longs for connection and purpose.</span>
            <p>get free to contact us</p>

            <i className='fab fa-facebook-f icon'></i>
            <i className='fab fa-twitter icon'></i>
            <i className='fab fa-instagram icon'></i>
          </div>
          <div className='box link'>
            <h3>Explore</h3>
            <ul>
             <li><Link to='/about'>About</Link></li>
             
              <li> <Link to='/courses'>All Courses</Link></li>
              <li><Link to='/team'>Team</Link></li>
              <li><Link to='/contact'>Contact Us</Link></li>
            </ul>
          </div>
          <div className='box link'>
            <h3>Quick Links</h3>
            <ul>
              
              <li><Link to='/pricing'>Pricing</Link></li>
              
              <li>Privacy</li>
              <li>Feedbacks</li>
            </ul>
          </div>
         
          <div className='box last'>
            <h3>Official info</h3>
            <ul>
              <li>
                <i className='fa fa-map'></i>
                 JP Nagar, Kanakapura Rd, Bengaluru, Karnataka 560082 India.
              </li>
              <li>
                <i className='fa fa-phone-alt'></i>
                	+91 91485 26550		
              </li>
              <li>
                <i className='fa fa-paper-plane'></i>
                Macht-mit@gmail.com
              </li>
            </ul>
          </div>
        </div>
      </footer>
      <div className='legal'>
        <p>
          MACHT-MIT Copyright ©2026 All rights reserved <i className='fa fa-heart'></i> by KAUSTUBH R
        </p>
      </div>
    </>
  )
}

export default Footer
