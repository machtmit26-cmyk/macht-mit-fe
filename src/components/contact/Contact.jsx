import Back from "../common/back/Back"
import "./contact.css"

const Contact = () => {
  const map = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.676062276742!2d77.5857632!3d12.9104914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae151bd1e5a4a7%3A0x9cbbf4b5c4b7e4d7!2sJP%20Nagar%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1734040000000'

  return (
    <>
      <Back title='Contact us' />
      <section className='contacts padding'>
        <div className='container shadow flexSB'>
          <div className='left row'>
            <iframe src={map}></iframe>
          </div>
          <div className='right row'>
           
           

            <div className='items grid2'>
              <div className='box'>
                <h4>ADDRESS:</h4>
                <p>JP Nagar, Kanakapura Rd, Bengaluru, Karnataka 560082 India.</p>
              </div>
              <div className='box'>
                <h4>EMAIL:</h4>
                <p> Macht-mit@gmail.com</p>
              </div>
              <div className='box'>
                <h4>PHONE:</h4>
                <p> 	+91 91485 26550		</p>
              </div>
            </div>

            <form action=''>
              <div className='flexSB'>
                <input type='text' placeholder='Name' />
                <input type='email' placeholder='Email' />
              </div>
              <input type='text' placeholder='Subject' />
              <textarea cols='30' rows='10'>
                Create a message here...
              </textarea>
              <button className='primary-btn'>SEND MESSAGE</button>
            </form>

            
          </div>
        </div>
      </section>
    </>
  )
}

export default Contact
