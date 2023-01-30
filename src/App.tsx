import './App.css'
import Login from './pages/Login';
import { StockForm } from './pages/StockForm';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from 'react';
import { useAuth } from './context/AuthContext';

function App() {
  const [toRender, setToRender] = useState(<></>)
  const { user } = useAuth();

  return (
    <>
      {user ? <StockForm /> : <Login />}
    </>
  )
}

export default App
