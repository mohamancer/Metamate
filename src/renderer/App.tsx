import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Post from '../pages/Post';
import Ads from '../pages/Ads';
import Chatbot from '../components/Chatbot';
import './App.css';

/**
 * Renders the main application.
 *
 * @returns The rendered application component.
 */
export default function App(): React.JSX.Element {
  return (
    <HashRouter>
      <div className="flex bg-gray-900 text-white">
        <Navigation />
        <div className="grow">
          <Routes>
            <Route path="/" Component={Post} />
            <Route path="/Ads" Component={Ads} />
          </Routes>
        </div>
        <Chatbot />
      </div>
    </HashRouter>
  );
}
