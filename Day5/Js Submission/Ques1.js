const nested = [1, [2, [3, [4, 5]], 6], [7, 8], 9, [[10]]];

// Method 1: Recursive function
function deepFlatten(arr) {
  let result = [];
  
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      // If element is an array, recursively flatten it
      result = result.concat(deepFlatten(arr[i]));
    } else {
      // If element is not an array, add it directly
      result.push(arr[i]);
    }
  }
  
  return result;
}

// Method 2: Using reduce (more functional approach)
function deepFlattenReduce(arr) {
  return arr.reduce((acc, val) => {
    return acc.concat(Array.isArray(val) ? deepFlattenReduce(val) : val);
  }, []);
}

// Method 3: Using Array.flat() with Infinity (built-in method)
function deepFlattenBuiltIn(arr) {
  return arr.flat(Infinity);
}

// Test all methods
console.log("Method 1 (Recursive):", deepFlatten(nested));
console.log("Method 2 (Reduce):", deepFlattenReduce(nested));
console.log("Method 3 (Built-in):", deepFlattenBuiltIn(nested));

// Expected Output: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]