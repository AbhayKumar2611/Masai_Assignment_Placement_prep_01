// Q2: Deep Clone with Circular Reference Handling

/**
 * Deep clone function that handles circular references
 * @param {*} obj - Object to clone
 * @param {Map} visited - Map to track visited objects (prevents infinite recursion)
 * @returns {*} Deep cloned object
 */
function deepClone(obj, visited = new WeakMap()) {
  // Handle null and undefined
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  // Handle primitives
  if (typeof obj !== 'object') {
    return obj;
  }
  
  // Handle Date objects
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  // Handle Array objects
  if (Array.isArray(obj)) {
    // Check for circular reference
    if (visited.has(obj)) {
      return visited.get(obj);
    }
    
    const clonedArray = [];
    visited.set(obj, clonedArray);
    
    clonedArray.push(...obj.map(item => deepClone(item, visited)));
    return clonedArray;
  }
  
  // Handle RegExp objects
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }
  
  // Handle plain objects
  // Check for circular reference
  if (visited.has(obj)) {
    return visited.get(obj);
  }
  
  const clonedObj = {};
  visited.set(obj, clonedObj);
  
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key], visited);
    }
  }
  
  return clonedObj;
}

// Test with circular reference
const obj = {
  name: 'John',
  address: {
    city: 'NYC',
    coords: { lat: 40, lng: -74 }
  },
  hobbies: ['reading', 'gaming']
};

// Create circular reference
obj.self = obj;
obj.address.parent = obj;

// Test deep clone
console.log('=== Deep Clone with Circular Reference Handling ===\n');

console.log('Original object:');
console.log(JSON.stringify(obj, null, 2));
console.log('\n(Note: JSON.stringify fails on circular references)');

try {
  JSON.stringify(obj);
} catch (e) {
  console.log('JSON.stringify error:', e.message);
}

console.log('\n--- Performing deep clone ---');
const cloned = deepClone(obj);

console.log('\nCloned object (without circular reference issues):');
console.log('cloned.name:', cloned.name);
console.log('cloned.address.city:', cloned.address.city);
console.log('cloned.address.coords:', cloned.address.coords);
console.log('cloned.hobbies:', cloned.hobbies);
console.log('cloned.self === cloned:', cloned.self === cloned); // Should be true (circular ref maintained)
console.log('cloned !== obj:', cloned !== obj); // Should be true (different object)
console.log('cloned.address !== obj.address:', cloned.address !== obj.address); // Should be true (deep cloned)

// Verify deep clone worked
console.log('\n--- Verifying deep clone ---');
console.log('Modified cloned object:');
cloned.name = 'Jane';
cloned.address.city = 'LA';
cloned.hobbies.push('swimming');

console.log('cloned.name:', cloned.name);
console.log('original obj.name:', obj.name); // Should still be 'John'
console.log('cloned.address.city:', cloned.address.city);
console.log('original obj.address.city:', obj.address.city); // Should still be 'NYC'
console.log('cloned.hobbies:', cloned.hobbies);
console.log('original obj.hobbies:', obj.hobbies); // Should still be ['reading', 'gaming']

// Test with array
console.log('\n--- Testing with array containing circular reference ---');
const arr = [{ id: 1, name: 'Item 1' }];
arr.push(arr); // Circular reference

const clonedArr = deepClone(arr);
console.log('Original array length:', arr.length);
console.log('Cloned array length:', clonedArr.length);
console.log('clonedArr[1] === clonedArr:', clonedArr[1] === clonedArr); // Should be true

// Test with nested circular references
console.log('\n--- Testing nested circular references ---');
const complex = {
  a: { value: 1 },
  b: { value: 2 }
};
complex.a.ref = complex.b;
complex.b.ref = complex.a; // Mutual circular reference
complex.c = complex; // Self reference

const clonedComplex = deepClone(complex);
console.log('clonedComplex.a.ref === clonedComplex.b:', clonedComplex.a.ref === clonedComplex.b);
console.log('clonedComplex.b.ref === clonedComplex.a:', clonedComplex.b.ref === clonedComplex.a);
console.log('clonedComplex.c === clonedComplex:', clonedComplex.c === clonedComplex);

console.log('\n✓ Deep clone successfully handles circular references!');

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    deepClone
  };
}

