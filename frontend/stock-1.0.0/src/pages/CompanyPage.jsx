import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Spinner from '../components/Spinner';
import Chart from '../components/Chart';

const CompanyPage = () => {
  const { id } = useParams();
  const [ company, setCompany ] = useState({});
  const [ loading, setLoading ] = useState(true);
  
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(`/api/companies/info/${id}`);
        const data = await res.json();
        setCompany(data);
      } catch (error) {
        console.log('Error fetching company', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompany();
  }, []);

  return (
    loading ? (
      <Spinner loading={loading}/>
    ) : (
      <section className="bg-sky-50">
        <div className="p-6 md:text-left">
          <h1 className="text-3xl font-bold mb-4">{company.name} ({company.symbol})</h1>

          <p className="mb-4">{company.description}</p>

          <div className='flex'>
            <div className='w-1/2'>
              <Chart company='IBM' />
            </div>
            <p>Stock Prediction here: WIP</p>
          </div>
        </div>
      </section>
    )
  );
};

export default CompanyPage;