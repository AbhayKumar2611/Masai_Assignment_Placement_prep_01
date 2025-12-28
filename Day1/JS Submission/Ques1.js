const products = [
  ['Electronics', 'Laptop', 999],
  ['Clothing', 'Shirt', 29],
  ['Electronics', 'Mouse', 25],
  ['Clothing', 'Pants', 49],
  ['Electronics', 'Keyboard', 75],
  ['Clothing', 'Jacket', 89]
];

// Solution: Convert nested array to categorized and sorted object
const categorizeAndSortProducts = (products) => {
  // Step 1: Group products by category
  const grouped = products.reduce((result, [category, name, price]) => {
    // Initialize category array if it doesn't exist
    if (!result[category]) {
      result[category] = [];
    }
    
    // Add product object to the category
    result[category].push({ name, price });
    
    return result;
  }, {});
  
  // Step 2: Sort products within each category by price (ascending)
  Object.keys(grouped).forEach(category => {
    grouped[category].sort((a, b) => a.price - b.price);
  });
  
  return grouped;
};

// Execute the transformation
const result = categorizeAndSortProducts(products);

console.log(result);

// Output:
// {
//   Electronics: [
//     { name: 'Mouse', price: 25 },
//     { name: 'Keyboard', price: 75 },
//     { name: 'Laptop', price: 999 }
//   ],
//   Clothing: [
//     { name: 'Shirt', price: 29 },
//     { name: 'Pants', price: 49 },
//     { name: 'Jacket', price: 89 }
//   ]
// }
