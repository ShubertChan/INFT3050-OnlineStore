import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email || !password) {
      setMessage('Please fill in email and password.');
      return;
    }

    setMessage('Login button clicked. Database connection will be added later.');

    setEmail('');
    setPassword('');
    setRememberMe(false);
  };

  return (
    <div className="page-wrapper">
      <Header />

      <main className="main-content">
        <h1>My Account</h1>

        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Sign In</h2>

          {message && <p className="message">{message}</p>}

          <label>Email</label>
          <input
            type="email"
            className="input-box"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            className="input-box"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="form-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>

            <Link to="/register" className="small-link">
              Create Account
            </Link>
          </div>

          <Link to="/forgot-password" className="forgot-link">
            Forgot Password?
          </Link>

          <button type="submit" className="main-button">
            Login
          </button>
        </form>
      </main>
    </div>
  );
};

export default Login;