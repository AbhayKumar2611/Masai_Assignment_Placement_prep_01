const obj = {
  name: 'John',
  address: {
    city: 'NYC',
    coordinates: {
      lat: 40.7128,
      lng: -74.0060
    }
  },
  hobbies: ['reading', 'gaming']
};

// Method 1: Recursive function to flatten nested object with dot notation
function flattenObject(obj, prefix = '', result = {}) {
  // Iterate through each key-value pair in the object
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // Build the new key with dot notation
      const newKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
      
      // Check if value is an array
      if (Array.isArray(value)) {
        // Handle arrays - use index notation (e.g., hobbies.0, hobbies.1)
        value.forEach((item, index) => {
          const arrayKey = `${newKey}.${index}`;
          // If array item is object/array, recursively flatten
          if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
            flattenObject(item, arrayKey, result);
          } else {
            result[arrayKey] = item;
          }
        });
      }
      // Check if value is an object (but not array, null, or Date)
      else if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
        // Recursively flatten nested objects
        flattenObject(value, newKey, result);
      }
      // Primitive value - add directly to result
      else {
        result[newKey] = value;
      }
    }
  }
  
  return result;
}

// Method 2: Alternative implementation using reduce
function flattenObjectReduce(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const arrayKey = `${newKey}.${index}`;
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          Object.assign(acc, flattenObjectReduce(item, arrayKey));
        } else {
          acc[arrayKey] = item;
        }
      });
    } else if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
      Object.assign(acc, flattenObjectReduce(value, newKey));
    } else {
      acc[newKey] = value;
    }
    
    return acc;
  }, {});
}

// Test the function
const flattened = flattenObject(obj);
console.log('Flattened Object:', flattened);

// Verify expected output
console.log('\nExpected Output:');
console.log({
  'name': 'John',
  'address.city': 'NYC',
  'address.coordinates.lat': 40.7128,
  'address.coordinates.lng': -74.0060,
  'hobbies.0': 'reading',
  'hobbies.1': 'gaming'
});

// Test with reduce method
const flattenedReduce = flattenObjectReduce(obj);
console.log('\nUsing Reduce Method:', flattenedReduce);

// Expected Output:
// {
//   'name': 'John',
//   'address.city': 'NYC',
//   'address.coordinates.lat': 40.7128,
//   'address.coordinates.lng': -74.0060,
//   'hobbies.0': 'reading',
//   'hobbies.1': 'gaming'
// }

