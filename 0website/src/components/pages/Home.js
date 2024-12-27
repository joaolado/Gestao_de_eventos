
import React from 'react';
import '../../App.css';

// Components
import Cards         from '../cards/Cards';
import BannerSection from '../bannerSection/BannerSection';

function Home() 
{
  return (
    <>
      <BannerSection />
      <Cards />
    </>
  );
}

export default Home;