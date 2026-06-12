import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from './Header';

const Products = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const sampleProducts = [
    {
      id: 1,
      name: 'The Adventures of Augie March',
      author: 'Saul Bellow',
      category: 'Books',
      price: 47.35,
      description: 'A classic book product from the store database.',
      stock: 29
    },
    {
      id: 2,
      name: "All the King's Men",
      author: 'Robert Penn Warren',
      category: 'Books',
      price: 29.76,
      description: 'A historical fiction book product.',
      stock: 115
    },
    {
      id: 201,
      name: 'Aguirre: The Wrath of God',
      author: 'Werner Herzog',
      category: 'Movies',
      price: 16.59,
      description: 'A movie product from the store database.',
      stock: 21
    },
    {
      id: 208,
      name: 'Blade Runner',
      author: 'Ridley Scott',
      category: 'Movies',
      price: 5.82,
      description: 'A science fiction movie product.',
      stock: 22
    },
    {
      id: 301,
      name: 'Star Wars: Knights of the Old Republic',
      author: 'Bioware',
      category: 'Games',
      price: 33.94,
      description: 'A game product from the store database.',
      stock: 100
    },
    {
      id: 400,
      name: 'The Legend of Zelda: Breath of the Wild',
      author: 'Nintendo',
      category: 'Games',
      price: 48.49,
      description: 'A popular open world game product.',
      stock: 130
    }
  ];

  const [searchText, setSearchText] = useState('');

  const selectedCategory = categoryName ? categoryName.toLowerCase() : 'all';

  const getPageTitle = () => {
    if (selectedCategory === 'books') {
      return 'Books';
    }

    if (selectedCategory === 'movies') {
      return 'Movies';
    }

    if (selectedCategory === 'games') {
      return 'Games';
    }

    return 'All Products';
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;

    if (value === 'all') {
      navigate('/products');
    } else {
      navigate(`/products/${value}`);
    }
  };

  const filteredProducts = sampleProducts.filter((product) => {
    const matchSearch =
      product.name.toLowerCase().includes(searchText.toLowerCase()) ||
      product.author.toLowerCase().includes(searchText.toLowerCase());

    const matchCategory =
      selectedCategory === 'all' ||
      product.category.toLowerCase() === selectedCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div className="page-wrapper">
      <Header />

      <main className="products-main">
        <h1>{getPageTitle()}</h1>

        <div className="products-tools">
          <input
            type="text"
            placeholder="Search by product name or creator"
            className="product-search-input"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <select
            className="category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="all">All Categories</option>
            <option value="books">Books</option>
            <option value="movies">Movies</option>
            <option value="games">Games</option>
          </select>
        </div>

        <p className="result-text">
          {filteredProducts.length} product(s) found
        </p>

        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div className="product-list-card" key={product.id}>
              <div className="product-list-image">
                {product.category}
              </div>

              <div className="product-list-info">
                <h2>{product.name}</h2>

                <p>
                  <strong>Author / Creator:</strong> {product.author}
                </p>

                <p>{product.description}</p>

                <p className="product-category">
                  Category: {product.category}
                </p>

                <p className="product-stock">
                  Stock: {product.stock}
                </p>

                <div className="product-list-bottom">
                  <span>${product.price}</span>

                  <div>
                    <Link
                      to={`/products/detail/${product.id}`}
                      className="details-button"
                    >
                      View Details
                    </Link>

                    <button className="cart-button">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="empty-result">
            <h2>No item found</h2>
            <p>Please try another keyword or category.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;