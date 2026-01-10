// Q1: Debounce Implementation

/**
 * Debounce function implementation
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay) {
  let timeoutId;
  
  return function (...args) {
    // Clear the previous timeout
    clearTimeout(timeoutId);
    
    // Set a new timeout
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Test Case
function apiCall(query) {
  console.log('API called with:', query);
}

const debouncedApi = debounce(apiCall, 500);

// Demo usage
console.log('=== Debounce Implementation Demo ===\n');
console.log('Calling debounced function multiple times:');
console.log('debouncedApi("a");');
debouncedApi('a');

console.log('debouncedApi("ab");');
debouncedApi('ab');

console.log('debouncedApi("abc");');
debouncedApi('abc');

console.log('\nOnly the last call with "abc" should execute after 500ms...\n');

// Simulate the delay
setTimeout(() => {
  console.log('=== After 500ms ===');
  console.log('(In real scenario, only "abc" would be logged)');
}, 600);

// Additional test cases
console.log('\n--- Additional Test Cases ---\n');

// Test with different function
function searchFunction(term) {
  console.log(`Searching for: "${term}"`);
}

const debouncedSearch = debounce(searchFunction, 300);

console.log('Rapid calls:');
debouncedSearch('r');
debouncedSearch('re');
debouncedSearch('rea');
debouncedSearch('read');

setTimeout(() => {
  console.log('\n(After delay, only "read" should be searched)');
}, 400);

// Test with context binding
const obj = {
  name: 'TestObject',
  logName: debounce(function() {
    console.log(`Object name: ${this.name}`);
  }, 200)
};

console.log('\n--- Testing context binding ---');
obj.logName();
obj.logName();

setTimeout(() => {
  console.log('(Should log: Object name: TestObject)');
}, 300);

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    debounce
  };
}

