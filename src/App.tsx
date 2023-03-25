import './App.css'
import { Login } from './pages/Login';
import { StockForm } from './pages/StockForm';
import { useAppContext } from './context/AppContext';
import { Routes, Route } from 'react-router-dom';
import ProductsPainel from './pages/ProductsPainel';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { theme } from './theme/theme';

function App() {
  const { user } = useAppContext();

  return (
    <>
      <ThemeProvider theme={theme}>
        <Routes>
          {user ?
            <>
              <Route path="/" element={<StockForm />} />
              <Route path="/productsPainel" element={<ProductsPainel />} />
            </>
            : <Route path="/" element={<Login />} />
          }
        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App
