
import React from 'react';

// CSS
import '../../App.css';

// Components
import Cards         from '../cards/Cards';
import BannerSection from '../bannerSection/BannerSection';

function Home() 
{

  //-----------------------------------------------------------------------------------------------------------------
  // FRONTEND
  //-----------------------------------------------------------------------------------------------------------------
  return (
    <>
      <BannerSection />
      <Cards />
    </>
  );
}

export default Home;