import React from 'react';

import Hero from '../components/Hero';
import HomeCard from '../components/HomeCard';

const HomePage = () => {
  return (
    <>
        <Hero title='Stock Predictions' subtitle='Find stock price history and trend predictions'/>
        <HomeCard />
    </>
  );
};

export default HomePage;