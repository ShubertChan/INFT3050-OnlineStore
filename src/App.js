import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './Home';
import Products from './Products';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import './App.css';

function App() {
  return (
     <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:categoryName" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;