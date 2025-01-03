import React from 'react';
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import Spinner from './Spinner';

const SearchBar = () => {
  const location = useLocation();

  const [ keyword, setKeyword ] = useState('');
  const [ showAutoComplete, setShowAutoComplete ] = useState(false);
  const [ companies, setCompanies ] = useState([]);
  const [ loading, setLoading ] = useState(true);

  const getCompanies = async (keyword) => {
    const fetchCompanies = async () => { 
        try {
            const res = await fetch(`/api/companies/${keyword}`);
            const data = await res.json();
            setCompanies(data.slice(0, 3));
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
    if (e.target.value.length > 0) {
        setShowAutoComplete(true);
        getCompanies(e.target.value);
    } else {
        setShowAutoComplete(false);
    }
  };

  useEffect(() => {
    setKeyword('');
    setShowAutoComplete(false);
    setLoading(true);
  }, [location]);

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