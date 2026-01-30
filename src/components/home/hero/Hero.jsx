import React from "react"
import Heading from "../../common/heading/Heading"
import "./Hero.css"
import { Link } from "react-router-dom"
import logo from '../Logo.jpg';
const Hero = () => {
  return (
    <>
    
      <section className='hero'>
        <div className='container'>
          <div className='row'>
            <Heading subtitle='WELCOME TO MACHT-MIT' title='True insight into Germany begins with its people' />
           
            <div className='button'>
              <Link to='/contact'><button className='primary-btn'>
                GET STARTED NOW <i className='fa fa-long-arrow-alt-right'></i>
              </button></Link>
              <Link to='/course'><button>
                VIEW COURSE <i className='fa fa-long-arrow-alt-right'></i>
              </button></Link>
            </div>
          </div>
        </div>
      </section>
      <div className='margin'></div>
    </>
  )
}

export default Hero
