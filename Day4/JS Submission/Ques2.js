// Solution: Implement custom forEach function
Array.prototype.myForEach = function(callback, thisArg) {
  // Check if callback is a function
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }
  
  // Iterate through each element in the array
  for (let i = 0; i < this.length; i++) {
    // Only process elements that exist in the array (handle sparse arrays)
    if (i in this) {
      // Call the callback with (element, index, array)
      // forEach doesn't use the return value of callback
      callback.call(thisArg, this[i], i, this);
    }
  }
  
  // forEach always returns undefined
  return undefined;
};

// Test Case: Multiply each number by its index
const nums = [1, 2, 3, 4, 5];
const result = [];
nums.myForEach((num, index) => {
  result.push(num * index);
});
console.log(result); // [0, 2, 6, 12, 20]

// Additional test to verify forEach returns undefined
const returnValue = nums.myForEach(() => {});
console.log('Return value:', returnValue); // undefined

