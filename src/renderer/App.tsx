import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navigation from '../components/Navigation';
import MainPage from '../pages/Main';
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
      <Navigation />
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="/" Component={MainPage} />
          <Route path="/Post" Component={Post} />
          <Route path="/Ads" Component={Ads} />
        </Routes>
      </div>
      <Chatbot />
    </HashRouter>
  );
}
