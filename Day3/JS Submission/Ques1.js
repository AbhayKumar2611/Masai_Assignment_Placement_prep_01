// Solution: Implement custom map function
Array.prototype.myMap = function(callback, thisArg) {
  // Check if callback is a function
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }
  
  // Create a new array to store results
  const result = [];
  
  // Iterate through each element in the array
  for (let i = 0; i < this.length; i++) {
    // Only process elements that exist in the array (handle sparse arrays)
    if (i in this) {
      // Call the callback with (element, index, array) and push result
      result[i] = callback.call(thisArg, this[i], i, this);
    }
  }
  
  return result;
};

// Test Case 1: Double numbers
const nums = [1, 2, 3, 4, 5];
const doubled = nums.myMap(x => x * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Test Case 2: Extract names from objects
const users = [{ name: 'John', age: 25 }, { name: 'Jane', age: 30 }];
const names = users.myMap(u => u.name);
console.log(names); // ['John', 'Jane']