import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import React from 'react';
import './index.css';
import App from './App.jsx';
import AdvancedMode from './components/AdvancedMode.jsx';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
    },
    {
      path: '/advanced',
      element: <AdvancedMode />,
    },
  ],
  {
    basename: '/rhymeApp',
  }
);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
