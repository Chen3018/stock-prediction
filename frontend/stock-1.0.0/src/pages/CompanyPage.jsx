import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';

import Spinner from '../components/Spinner';
import Chart from '../components/Chart';
import { use } from 'react';

const CompanyPage = () => {
  const { id } = useParams();
  const [ company, setCompany ] = useState({});
  const [ loading, setLoading ] = useState(true);
  const [ latestPrice, setLatestPrice ] = useState(0);
  const [ change, setChange ] = useState(true);
  const [ changeAmount, setChangeAmount ] = useState('');
  const [ changePercent, setChangePercent ] = useState('');
  const [ showFullDescription, setShowFullDescription ] = useState(false);
  const [ prediction, setPrediction ] = useState(-1);
  const [ predictionChange, setPredictionChange ] = useState(true);

  const changeClass = change ? 'text-lg text-green-500' : 'text-lg text-red-500';

  let description = company.description;

  if (!showFullDescription && company.description && company.description.length > 1000) {
    description = description.substring(0, 1000) + '...';
  }

  const updatePrices = (latest, amount) => {
    setLatestPrice(latest.toFixed(2));

    const percent = (amount / latest) * 100;
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
        updatePrices(Number(data.price), Number(data.change))
      } catch (error) {
        console.log('Error fetching company', error);
      } finally {
        setLoading(false);
      }
    }

    const fetchPrediction = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API + `/predictions/${id}`);
        const data = await res.json();
        setPrediction(Number(data.prediction).toFixed(2));
      } catch (error) {
        console.log('Error fetching prediction', error);
      }
    }

    setPrediction(-1);
    fetchCompany();
    fetchPrediction();
  }, [id]);

  useEffect(() => {
    setPredictionChange(prediction > latestPrice);
  }, [latestPrice, prediction]);

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

          <p className="mb-4">{description}</p>

          <button
          onClick={() => setShowFullDescription((prevState) => !prevState)}
          className='text-sky-500 mb-5 hover:text-sky-600'
          >
          { company.description && company.description.length > 1000 ?
            (showFullDescription ? 'Less' : 'More') : ''
          }
          </button>

          <div className='flex'>
            <div className='w-1/2'>
              <Chart company={id} />
            </div>
            
            <div className='flex-1 flex justify-center'>
              <div>
                <p className='text-2xl'>Next Hour Prediction</p>

                <div className='flex items-center justify-center'>
                  { prediction === -1 ? 
                    <Spinner loading={true} /> :
                    (<>
                      <p className='text-xl'>{prediction}</p>
                      { predictionChange ? (
                        <FaCaretUp className='text-3xl text-green-500' />
                      ) : (
                        <FaCaretDown className='text-3xl text-red-500' />
                      )}
                    </>)
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  );
};

export default CompanyPage;