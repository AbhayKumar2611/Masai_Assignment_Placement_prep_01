// Solution: Implement custom reduce function
Array.prototype.myReduce = function(callback, initialValue) {
  // Check if callback is a function
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }
  
  // Check if array is empty and no initial value provided
  if (this.length === 0 && arguments.length < 2) {
    throw new TypeError('Reduce of empty array with no initial value');
  }
  
  let accumulator;
  let startIndex;
  
  // Determine starting conditions
  if (arguments.length >= 2) {
    // Initial value provided
    accumulator = initialValue;
    startIndex = 0;
  } else {
    // No initial value - use first element as accumulator
    accumulator = this[0];
    startIndex = 1;
  }
  
  // Iterate through the array
  for (let i = startIndex; i < this.length; i++) {
    // Only process elements that exist (handle sparse arrays)
    if (i in this) {
      // Call callback with (accumulator, currentValue, currentIndex, array)
      accumulator = callback(accumulator, this[i], i, this);
    }
  }
  
  return accumulator;
};

// Test Case 1: Sum of numbers
const nums = [1, 2, 3, 4, 5];
const sum = nums.myReduce((acc, curr) => acc + curr, 0);
console.log(sum); // 15

// Test Case 2: Group items by category
const items = [
  { category: 'fruit', name: 'apple' },
  { category: 'vegetable', name: 'carrot' },
  { category: 'fruit', name: 'banana' }
];
const grouped = items.myReduce((acc, item) => {
  if (!acc[item.category]) acc[item.category] = [];
  acc[item.category].push(item.name);
  return acc;
}, {});
console.log(grouped);
// { fruit: ['apple', 'banana'], vegetable: ['carrot'] }

