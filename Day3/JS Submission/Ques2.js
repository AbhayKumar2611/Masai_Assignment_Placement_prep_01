// Solution: Implement custom filter function
Array.prototype.myFilter = function(callback, thisArg) {
  // Check if callback is a function
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }
  
  // Create a new array to store filtered results
  const result = [];
  
  // Iterate through each element in the array
  for (let i = 0; i < this.length; i++) {
    // Only process elements that exist in the array (handle sparse arrays)
    if (i in this) {
      // Call the callback with (element, index, array)
      // If callback returns truthy value, add element to result
      if (callback.call(thisArg, this[i], i, this)) {
        result.push(this[i]);
      }
    }
  }
  
  return result;
};

// Test Case 1: Filter even numbers
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const evens = nums.myFilter(x => x % 2 === 0);
console.log(evens); // [2, 4, 6, 8, 10]

// Test Case 2: Filter available products under $800
const products = [
  { name: 'Laptop', price: 999, inStock: true },
  { name: 'Phone', price: 699, inStock: false },
  { name: 'Tablet', price: 499, inStock: true }
];
const available = products.myFilter(p => p.inStock && p.price < 800);
console.log(available); // [{ name: 'Tablet', price: 499, inStock: true }]

