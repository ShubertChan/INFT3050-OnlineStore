import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!fullName || !email || !address || !postcode || !password || !confirmPassword) {
      setMessage('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Password and confirm password are different.');
      return;
    }

    if (!agree) {
      setMessage('Please agree to the Terms.');
      return;
    }

    if (isNaN(postcode)) {
      setMessage('Postcode must be numbers only.');
      return;
    }

    setMessage('Account created. Database connection will be added later.');
  };

  return (
    <div className="page-wrapper">
      <Header />

      <main className="main-content">
        <h1>Create Account</h1>

        <form className="form-card register-card" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>

          {message && <p className="message">{message}</p>}

          <label>Full Name</label>
          <input
            type="text"
            className="input-box"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <label>Email</label>
          <input
            type="email"
            className="input-box"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Address</label>
          <input
            type="text"
            className="input-box"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <label>Postcode</label>
          <input
            type="text"
            className="input-box"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            className="input-box"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            className="input-box"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <label className="checkbox-label terms">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            I agree to the Terms
          </label>

          <button type="submit" className="main-button">
            Create Account
          </button>

          <Link to="/login" className="bottom-link">
            Back to Sign In
          </Link>
        </form>
      </main>
    </div>
  );
};

export default Register;