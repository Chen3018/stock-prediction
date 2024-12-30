import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaArrowTrendUp } from 'react-icons/fa6';

import SearchBar from './SearchBar';

const NavBar = () => {
  const linkClass = ({ isActive }) => isActive ? 'bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2' : 'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'

  return (
    <nav className="bg-sky-500 border-b border-sky-300">
        <div className="mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div
              className="flex flex-1 items-center justify-center md:items-stretch md:justify-start"
            >
              <NavLink className="flex flex-shrink-0 items-center mr-4" to="/">
                <FaArrowTrendUp className="text-white text-2xl" />
                <span className="hidden md:block text-white text-2xl font-bold ml-2"
                  >Stocker
                </span>
              </NavLink>
              <div className="md:ml-auto">
                <div className="flex space-x-2">
                  <NavLink
                    to="/"
                    className={ linkClass }
                    >Home
                  </NavLink>
                  <SearchBar />
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </nav>
  );
}

export default NavBar