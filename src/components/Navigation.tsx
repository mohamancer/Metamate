import React from 'react';
import { Link } from 'react-router-dom';
import '../../dist/output.css';

function Navigation() {
  return (
    <nav className="bg-blue-500 p-4">
      <ul className="flex">
        <li className="mr-6">
          <Link to="/" className="text-white flex items-center">
            {/* You can replace the following icon with your desired home icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Home
          </Link>
        </li>
        <li className="mr-6">
          <Link to="/Post" className="text-white">
            P
          </Link>
        </li>
        <li>
          <Link to="/Ads" className="text-white">
            A
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
