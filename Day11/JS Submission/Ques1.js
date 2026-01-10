// Q1: Shopping Cart with Local State

const products = [
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Mouse', price: 25 },
  { id: 3, name: 'Keyboard', price: 75 },
  { id: 4, name: 'Monitor', price: 299 }
];

// State
let cart = []; // Array of { productId, quantity }

// Add product to cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) {
    console.log('Product not found');
    return;
  }
  
  const existingItem = cart.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ productId: productId, quantity: 1 });
  }
  
  displayCart();
  calculateTotals();
}

// Remove product from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.productId !== productId);
  displayCart();
  calculateTotals();
}

// Update quantity
function updateQuantity(productId, change) {
  const item = cart.find(item => item.productId === productId);
  if (!item) return;
  
  item.quantity += change;
  
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    displayCart();
    calculateTotals();
  }
}

// Display products
function displayProducts() {
  console.log('\n=== Available Products ===');
  products.forEach(product => {
    console.log(`ID: ${product.id} | ${product.name} - $${product.price}`);
    console.log(`   [Add to Cart]`);
  });
}

// Display cart
function displayCart() {
  console.log('\n=== Shopping Cart ===');
  
  if (cart.length === 0) {
    console.log('Cart is empty');
    return;
  }
  
  cart.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    const itemTotal = product.price * item.quantity;
    
    console.log(`\n${product.name}`);
    console.log(`  Price: $${product.price}`);
    console.log(`  Quantity: [${item.quantity}]`);
    console.log(`  [−] [+]`);
    console.log(`  Item Total: $${itemTotal}`);
    console.log(`  [Remove]`);
  });
}

// Calculate and display totals
function calculateTotals() {
  console.log('\n=== Cart Summary ===');
  
  if (cart.length === 0) {
    console.log('Subtotal: $0.00');
    console.log('Tax (10%): $0.00');
    console.log('Total: $0.00');
    return;
  }
  
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product.price * item.quantity);
  }, 0);
  
  const tax = subtotal * 0.10; // 10% tax
  const total = subtotal + tax;
  
  console.log(`Subtotal: $${subtotal.toFixed(2)}`);
  console.log(`Tax (10%): $${tax.toFixed(2)}`);
  console.log(`Total: $${total.toFixed(2)}`);
  
  return { subtotal, tax, total };
}

// Demo usage
console.log('=== Shopping Cart Demo ===');
displayProducts();

console.log('\n--- Adding Laptop to cart ---');
addToCart(1);

console.log('\n--- Adding Mouse to cart ---');
addToCart(2);

console.log('\n--- Adding Laptop again (increment quantity) ---');
addToCart(1);

console.log('\n--- Adding Keyboard ---');
addToCart(3);

console.log('\n--- Increasing Mouse quantity ---');
updateQuantity(2, 1);

console.log('\n--- Decreasing Keyboard quantity ---');
updateQuantity(3, -1);

console.log('\n--- Removing Mouse from cart ---');
removeFromCart(2);

// Export for use in HTML/React
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    products,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    displayProducts,
    displayCart,
    calculateTotals
  };
}

