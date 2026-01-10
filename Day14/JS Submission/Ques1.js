// Q1: Mini Dashboard

// State
let users = [];
let filteredUsers = [];
let sortColumn = null;
let sortDirection = 'asc';
let searchQuery = '';
let selectedDomain = 'all';
let isLoading = false;
let error = null;

// Fetch data from API
async function fetchUsers() {
  isLoading = true;
  error = null;
  
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    users = data.map(user => ({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      website: user.website,
      company: user.company.name,
      city: user.address.city
    }));
    
    filteredUsers = [...users];
    isLoading = false;
    displayDashboard();
  } catch (err) {
    error = err.message;
    isLoading = false;
    displayError();
  }
}

// Display error
function displayError() {
  console.log('\n=== Error ===');
  console.log(`Error: ${error}`);
  console.log('Please try again later.');
}

// Search users
function searchUsers(query) {
  searchQuery = query.toLowerCase();
  applyFilters();
}

// Filter by domain
function filterByDomain(domain) {
  selectedDomain = domain;
  applyFilters();
}

// Apply all filters and search
function applyFilters() {
  filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch = !searchQuery || 
      user.name.toLowerCase().includes(searchQuery) ||
      user.email.toLowerCase().includes(searchQuery) ||
      user.username.toLowerCase().includes(searchQuery);
    
    // Domain filter
    const matchesDomain = selectedDomain === 'all' || 
      user.email.split('@')[1] === selectedDomain;
    
    return matchesSearch && matchesDomain;
  });
  
  // Apply sorting
  if (sortColumn) {
    sortUsers(sortColumn, sortDirection, false);
  } else {
    displayDashboard();
  }
}

// Sort users
function sortUsers(column, direction = 'asc', updateState = true) {
  if (updateState) {
    if (sortColumn === column) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = column;
      sortDirection = 'asc';
    }
  }
  
  filteredUsers = [...filteredUsers].sort((a, b) => {
    let aVal = a[column];
    let bVal = b[column];
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });
  
  displayDashboard();
}

// Calculate statistics
function calculateStatistics() {
  const totalUsers = users.length;
  
  // Mock average posts per user (since API doesn't provide this)
  // In real scenario, this would come from API or separate endpoint
  const averagePosts = 10; // Placeholder
  
  return {
    totalUsers,
    filteredUsers: filteredUsers.length,
    averagePosts
  };
}

// Get unique domains
function getUniqueDomains() {
  const domains = new Set(users.map(user => user.email.split('@')[1]));
  return Array.from(domains).sort();
}

// Display dashboard
function displayDashboard() {
  const stats = calculateStatistics();
  
  console.log('\n=== Mini Dashboard ===\n');
  
  // Statistics
  console.log('--- Statistics ---');
  console.log(`Total Users: ${stats.totalUsers}`);
  console.log(`Filtered Users: ${stats.filteredUsers}`);
  console.log(`Average Posts per User: ${stats.averagePosts}`);
  
  // Filters
  console.log('\n--- Filters ---');
  console.log(`Search: "${searchQuery}"`);
  console.log(`Domain Filter: ${selectedDomain}`);
  
  // Sort indicator
  if (sortColumn) {
    const indicator = sortDirection === 'asc' ? '↑' : '↓';
    console.log(`Sorted by: ${sortColumn} ${indicator}`);
  }
  
  // Users table
  console.log('\n--- Users Table ---');
  if (filteredUsers.length === 0) {
    console.log('No users found matching filters.');
  } else {
    console.log('ID | Name | Username | Email | City | Company');
    console.log('---'.repeat(20));
    filteredUsers.forEach(user => {
      console.log(`${user.id} | ${user.name} | ${user.username} | ${user.email} | ${user.city} | ${user.company}`);
    });
  }
  
  // Available domains
  console.log('\n--- Available Domains ---');
  const domains = getUniqueDomains();
  console.log(domains.join(', '));
}

// Demo usage (Note: This requires fetch API, works in Node.js 18+ or browser)
console.log('=== Mini Dashboard Demo ===');
console.log('Fetching users from API...\n');

// If running in Node.js environment, use node-fetch or similar
// For browser, fetch is available natively
if (typeof fetch === 'undefined') {
  console.log('Note: fetch API not available in this environment.');
  console.log('For Node.js, install: npm install node-fetch');
  console.log('Or use this in a browser environment.\n');
  
  // Mock data for demonstration
  users = [
    { id: 1, name: 'John Doe', username: 'johndoe', email: 'john@example.com', phone: '123-456-7890', website: 'johndoe.com', company: 'Acme Corp', city: 'NYC' },
    { id: 2, name: 'Jane Smith', username: 'janesmith', email: 'jane@example.com', phone: '123-456-7891', website: 'janesmith.com', company: 'Tech Inc', city: 'LA' },
    { id: 3, name: 'Bob Johnson', username: 'bobjohnson', email: 'bob@test.com', phone: '123-456-7892', website: 'bobjohnson.com', company: 'Startup Co', city: 'SF' }
  ];
  filteredUsers = [...users];
  displayDashboard();
  
  console.log('\n--- Testing search ---');
  searchUsers('john');
  
  console.log('\n--- Testing domain filter ---');
  filterByDomain('example.com');
  
  console.log('\n--- Testing sorting ---');
  sortUsers('name');
  
} else {
  // Actual API call (works in browser or Node.js 18+)
  fetchUsers();
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchUsers,
    searchUsers,
    filterByDomain,
    sortUsers,
    calculateStatistics,
    displayDashboard,
    users,
    filteredUsers
  };
}

