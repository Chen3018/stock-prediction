import React from 'react';

const HomeCard = () => {
  return (
    <section className='py-4'>
      <div className='container-xl lg:container m-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg'>
          <div className='bg-gray-100 p-6 rounded-lg shadow-md'>
            <h2 className='text-2xl font-bold'>Diverse Training Data</h2>
            <p className='mt-2 mb-4'>
              Model trained on recent prices of Apple, Meta, Google, Amazon, and more S&P 500 companies   
            </p>
          </div>
          <div className='bg-sky-100 p-6 rounded-lg shadow-md'>
            <h2 className='text-2xl font-bold'>High Accuracy</h2>
            <p className='mt-2 mb-4'>
              Directional accuracy of 80% for next hour predictions
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCard