import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email) {
      setMessage('Please enter your email address.');
      return;
    }

    setMessage('Reset link sent. Database and email function will be added later.');
    setEmail('');
  };

  return (
    <div className="page-wrapper">
      <Header />

      <main className="main-content">
        <h1>Forgot Password</h1>

        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Reset your password</h2>

          <p className="small-text">
            Enter your email address. We will send a password reset link.
          </p>

          {message && <p className="message">{message}</p>}

          <label>Email</label>
          <input
            type="email"
            className="input-box"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" className="main-button">
            Send reset link
          </button>

          <Link to="/login" className="bottom-link">
            Back to sign in
          </Link>
        </form>
      </main>
    </div>
  );
};

export default ForgotPassword;