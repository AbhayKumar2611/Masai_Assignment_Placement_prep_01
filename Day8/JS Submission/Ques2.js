// Q2: Dynamic Filter Builder
// Create a function that accepts multiple filter criteria
// and applies them dynamically to a products list.

const products = [
  { id: 1, name: 'Laptop', category: 'Electronics', price: 999, rating: 4.5, inStock: true },
  { id: 2, name: 'Shirt', category: 'Clothing', price: 29, rating: 4.0, inStock: true },
  { id: 3, name: 'Phone', category: 'Electronics', price: 699, rating: 4.7, inStock: false },
  { id: 4, name: 'Pants', category: 'Clothing', price: 49, rating: 3.8, inStock: true },
  { id: 5, name: 'Tablet', category: 'Electronics', price: 499, rating: 4.3, inStock: true }
];

const filters = {
  category: 'Electronics',
  minPrice: 400,
  minRating: 4.0,
  inStock: true
};

/**
 * Dynamically filters products based on provided criteria.
 *
 * Supported filters:
 *  - category: string (exact match)
 *  - minPrice: number (price >= minPrice)
 *  - maxPrice: number (price <= maxPrice)
 *  - minRating: number (rating >= minRating)
 *  - inStock: boolean (inStock === true/false)
 *
 * @param {Array} list - array of product objects
 * @param {Object} criteria - filter criteria
 * @returns {Array} filtered products
 */
function filterProducts(list, criteria = {}) {
  return list.filter((product) => {
    // Category filter
    if (criteria.category && product.category !== criteria.category) {
      return false;
    }

    // Min price filter
    if (typeof criteria.minPrice === 'number' && product.price < criteria.minPrice) {
      return false;
    }

    // Max price filter
    if (typeof criteria.maxPrice === 'number' && product.price > criteria.maxPrice) {
      return false;
    }

    // Min rating filter
    if (typeof criteria.minRating === 'number' && product.rating < criteria.minRating) {
      return false;
    }

    // inStock filter
    if (typeof criteria.inStock === 'boolean' && product.inStock !== criteria.inStock) {
      return false;
    }

    return true;
  });
}

// Demo output for the given example
const filtered = filterProducts(products, filters);
console.log('Filtered Products:', filtered);

// Export for testing (Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { products, filters, filterProducts };
}


