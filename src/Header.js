import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="site-box">
      <div className="top-header">
        <div className="logo-box">
          Entertainment<br />Guild
        </div>

        <input
          className="search-box"
          type="text"
          placeholder="Search what you want"
        />

        <div className="account-area">
          <div className="user-icon"></div>
          <Link to="/login" className="account-link">My Account</Link>
        </div>

        <div className="cart-box">cart(2)</div>
      </div>

      <nav className="nav-bar">
        <Link to="/">Home</Link>
  <Link to="/products/books">Books</Link>
  <Link to="/products/movies">Movies</Link>
  <Link to="/products/games">Games</Link>
  <Link to="/deals">Deals</Link>
  <Link to="/contact">Contact</Link>
      </nav>
    </div>
  );
};

export default Header;