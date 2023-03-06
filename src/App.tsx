import './App.css'
import Login from './pages/Login';
import { useState } from 'react';
import { useAppContext } from './context/AppContext';
import ProductsPainel from './pages/ProductsPainel';

function App() {
  const { user } = useAppContext();

  return (
    <>
      {user ? <ProductsPainel /> : <Login />}
    </>
  )
}

export default App
