import './App.css'
import { Login } from './pages/Login';
import { StockForm } from './pages/StockForm';
import { useAppContext } from './context/AppContext';
import { Routes, Route } from 'react-router-dom';
import ProductsPainel from './pages/ProductsPainel';

function App() {
  const { user } = useAppContext();

  return (
    <>
      <Routes>
        {user ?
          <>
            <Route path="/" element={<StockForm />} />
            <Route path="/productsPainel" element={<ProductsPainel />} />
          </>
          : <Route path="/" element={<Login />} />
        }
      </Routes>
    </>
  )
}

export default App
