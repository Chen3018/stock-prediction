import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';

import Spinner from '../components/Spinner';
import Chart from '../components/Chart';

const CompanyPage = () => {
  const { id } = useParams();
  const [ company, setCompany ] = useState({});
  const [ loading, setLoading ] = useState(true);
  const [ latestPrice, setLatestPrice ] = useState(0);
  const [ change, setChange ] = useState(true);
  const [ changeAmount, setChangeAmount ] = useState('');
  const [ changePercent, setChangePercent ] = useState('');

  const changeClass = change ? 'text-lg text-green-500' : 'text-lg text-red-500';

  const updatePrices = (latest, previousClose) => {
    setLatestPrice(latest.price);

    const amount = latest.price - previousClose;
    const percent = (amount / previousClose) * 100;
    if (amount > 0) {
      setChange(true);
      setChangeAmount(`+${amount.toFixed(2)}`);
      setChangePercent(`(${percent.toFixed(2)}%)`);
    } else {
      setChange(false);
      setChangeAmount(amount.toFixed(2));
      setChangePercent(`(${(percent * -1).toFixed(2)}%)`);
    }
  };
  
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API + `/companies/info/${id}`);
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

          <div className='flex space-x-2'>
            <p className="text-3xl">{latestPrice}</p>
            { change ? (
              <FaCaretUp className='text-3xl text-green-500' />
            ) : (
              <FaCaretDown className='text-3xl text-red-500' />
            )}
          </div>

          <div className='flex space-x-2'>
            <p className={changeClass}>{changeAmount + ' ' + changePercent}</p>
          </div>

          <p className="mb-4">{company.description}</p>

          <div className='flex'>
            <div className='w-1/2'>
              <Chart updatePrice={updatePrices} company={id} />
            </div>
            <p>Stock Prediction here: WIP</p>
          </div>
        </div>
      </section>
    )
  );
};

export default CompanyPage;