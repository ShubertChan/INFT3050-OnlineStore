import Header from './Header';
import { Link } from 'react-router-dom';
const Home = () => {
  const products = [
    {
      id: 1,
      name: 'Movie Ticket',
      category: 'Movies',
      price: 15.99,
      description: 'Popular movie ticket for Entertainment Guild customers.'
    },
    {
      id: 2,
      name: 'Game Console',
      category: 'Games',
      price: 299.99,
      description: 'A game console product from the store.'
    },
    {
      id: 3,
      name: 'Board Game',
      category: 'Games',
      price: 39.99,
      description: 'A fun board game for friends and family.'
    },
    {
      id: 4,
      name: 'Movie Poster',
      category: 'Movies',
      price: 12.99,
      description: 'Entertainment poster for movie fans.'
    }
  ];

  return (
    <div className="page-wrapper">
      <Header />

      <main className="home-main">
        <section className="hero-section">
          <div className="hero-text">
            <h1>Welcome to Entertainment Guild</h1>
            <p>
              Find movies, games, and entertainment products in one online store.
            </p>
           <Link to="/products" className="hero-button">
  Shop Now
</Link>
          </div>
        </section>

        <section className="category-section">
          <h2>Shop by Category</h2>

          <div className="category-grid">
            <div className="category-card">
              <h3>Movies</h3>
              <p>Browse movie items and tickets.</p>
            </div>

            <div className="category-card">
              <h3>Games</h3>
              <p>Find games and gaming products.</p>
            </div>

            <div className="category-card">
              <h3>Deals</h3>
              <p>Check special offers and discounts.</p>
            </div>
          </div>
        </section>

        <section className="product-section">
          <h2>Featured Products</h2>

          <div className="product-grid">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                <div className="product-image">
                  {product.category}
                </div>

                <h3>{product.name}</h3>
                <p>{product.description}</p>

                <div className="product-bottom">
                  <span>${product.price}</span>
                  <button>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;