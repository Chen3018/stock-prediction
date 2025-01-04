import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import Spinner from './Spinner';

const SearchBar = () => {
  const location = useLocation();

  const [ keyword, setKeyword ] = useState('');
  const [ showAutoComplete, setShowAutoComplete ] = useState(false);
  const [ companies, setCompanies ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const latestRequest = useRef(0);

  const getCompanies = (keyword, requestID) => {
    const fetchCompanies = async () => { 
        try {
            const res = await fetch(import.meta.env.VITE_API + `/companies/${keyword}`);
            const data = await res.json();
            if (requestID === latestRequest.current){
                setCompanies(data.slice(0, 3));
            }
        } catch (error) {
            console.log('Error fetching companies', error);
        } finally {
            setLoading(false);
        }
    }

    fetchCompanies()
  };

  const searchKeyword = (e) => {
    setKeyword(e.target.value);
  };

  useEffect(() => {
    setKeyword('');
    setShowAutoComplete(false);
    setLoading(true);
  }, [location]);

  useEffect(() => {
    if (!keyword.trim()) {
        setShowAutoComplete(false);
        return;
    }

    const debounceTimer = setTimeout(() => {
        setShowAutoComplete(true);
        latestRequest.current += 1;
        const requestID = latestRequest.current;
        getCompanies(keyword, requestID);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [keyword]);

  return (
    <div>
        <input type="text" className="rounded px-4 py-2" placeholder='🔍Search Companies' value={keyword} onChange={(e) => searchKeyword(e)}/>
        { showAutoComplete ? (
            loading ? (
                <div className='absolute bg-white px-9'>
                    <Spinner loading={loading}/>
                </div>
            ) : (
                <table className='absolute bg-white'>
                    <tbody>
                    {companies.map((company, index) => (
                            <tr className='border hover:bg-gray-100' key={index}>
                                <td>
                                    <NavLink className='block w-full h-full px-2' to={`/company/${company.symbol}`}>{company.symbol}</NavLink>
                                </td>
                                <td>
                                    <NavLink className='block w-full h-full px-8' to={`/company/${company.symbol}`}>{company.name}</NavLink>
                                </td>
                            </tr>
                    ))}
                    </tbody>
                </table>
            )
        ) : (
            <></>
        )}
    </div>
  );
};

export default SearchBar;