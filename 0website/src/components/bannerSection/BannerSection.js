
import React from 'react';

// CSS
import '../../App.css';
import '../bannerSection/BannerSection.css';

// Components
import Search from '../search/Search';

function BannerSection() 
{
  return (
    <div>

      <div className='banner-container'>
        
        <video src='/videos/video-1.mp4' autoPlay loop muted />
        <p>What are you waiting for?</p>

        <div>
          <Search />
        </div>

      </div>
    </div>
  );
}

export default BannerSection;