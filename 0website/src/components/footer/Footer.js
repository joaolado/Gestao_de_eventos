
import React from 'react';

// Import Navigation
import { Link } from 'react-router-dom';

// CSS
import '../footer/Footer.css';

// Components
import { Button } from '../button/Button';

function Footer() 
{
  //-----------------------------------------------------------------------------------------------------------------
  // FRONTEND
  //-----------------------------------------------------------------------------------------------------------------
  return (

    <div className='footer-container'>

      <section className='footer-subscription'>

        <p className='footer-subscription-heading'>
          Subscribe to the EventFlow Newsletter and be the First to Know About Upcoming Events!
        </p>

        <p className='footer-subscription-text'>
          You can unsubscribe at any time.
        </p>

        <div className='input-areas'>
          <form>
            <input
              className='footer-input'
              name='email'
              type='email'
              placeholder='Your email please...'
            />

            <Button buttonStyle='btn--outline'>Subscribe</Button>

          </form>
        </div>

      </section>

      <div class='footer-links'>
        <div className='footer-link-wrapper'>

          <div class='footer-link-items'>
            <h2>About Us</h2>
            <Link to='/login'>How it works</Link>
            <Link to='/'>Testimonials</Link>
            <Link to='/'>Terms of Service</Link>
          </div>

          <div class='footer-link-items'>
            <h2>Contact Us</h2>
            <Link to='/'>Contact</Link>
            <Link to='/'>Support</Link>
            <Link to='/'>Destinations</Link>
            <Link to='/'>Sponsorships</Link>
          </div>

        </div>

        <div className='footer-link-wrapper'>

          <div class='footer-link-items'>
            <h2>Videos</h2>
            <Link to='/'>Submit Video</Link>
            <Link to='/'>Ambassadors</Link>
            <Link to='/'>Influencer</Link>
          </div>

          <div class='footer-link-items'>
            <h2>Social Media</h2>
            <Link to='/'>Facebook</Link>
            <Link to='/'>Instagram</Link>
            <Link to='/'>Youtube</Link>
            <Link to='/'>Tiktok</Link>
          </div>
          
        </div>
      </div>

      <section class='social-media'>
        <div class='social-media-wrap'>
          <div class='footer-logo'>

            <Link to='/' className='social-logo'>
              EventFlow
              <i class='fab fa-odnoklassniki' />
            </Link>

          </div>

          <small class='website-rights'>EventFlow © 2024  | All Rights Reserved.</small>

          <div class='social-icons'>
            <Link
              class='social-icon-link facebook'
              to='/'
              target='_blank'
              aria-label='Facebook'
            >
              <i class='fab fa-facebook-f' />
            </Link>

            <Link
              class='social-icon-link instagram'
              to='/'
              target='_blank'
              aria-label='Instagram'
            >
              <i class='fab fa-instagram' />
            </Link>

            <Link
              class='social-icon-link youtube'
              to='/'
              target='_blank'
              aria-label='Youtube'
            >
              <i class='fab fa-youtube' />
            </Link>

            <Link
              class='social-icon-link tiktok'
              to='/'
              target='_blank'
              aria-label='Tiktok'
            >
              <i class="fab fa-tiktok"></i>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;