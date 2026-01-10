// Q1: Dynamic Search Filter

const items = [
  { id: 1, name: 'MacBook Pro', category: 'Electronics' },
  { id: 2, name: 'Nike Shoes', category: 'Footwear' },
  { id: 3, name: 'iPhone 15', category: 'Electronics' },
  { id: 4, name: 'Adidas Jacket', category: 'Clothing' },
  { id: 5, name: 'Sony Headphones', category: 'Electronics' }
];

// State
let searchQuery = '';
let filteredItems = [...items];

// Filter items based on search query
function filterItems(query) {
  searchQuery = query.toLowerCase().trim();
  
  if (!searchQuery) {
    filteredItems = [...items];
  } else {
    filteredItems = items.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(searchQuery);
      const categoryMatch = item.category.toLowerCase().includes(searchQuery);
      return nameMatch || categoryMatch;
    });
  }
  
  displayItems();
  updateItemCount();
}

// Display filtered items
function displayItems() {
  console.log('\n=== Filtered Items ===');
  
  if (filteredItems.length === 0) {
    console.log('No items found matching your search.');
    return;
  }
  
  filteredItems.forEach(item => {
    // Highlight matching text in name
    const highlightedName = highlightText(item.name, searchQuery);
    const highlightedCategory = highlightText(item.category, searchQuery);
    
    console.log(`ID: ${item.id} | Name: ${highlightedName} | Category: ${highlightedCategory}`);
  });
}

// Highlight matching text
function highlightText(text, query) {
  if (!query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  const highlighted = text.replace(regex, (match) => `[${match}]`); // Using brackets to simulate highlighting
  
  return highlighted;
}

// Update item count display
function updateItemCount() {
  console.log(`\nTotal items: ${items.length} | Filtered items: ${filteredItems.length}`);
}

// Search input handler (simulating real-time search)
function performSearch(query) {
  filterItems(query);
}

// Demo usage
console.log('=== Dynamic Search Filter ===\n');
console.log('Initial items:');
displayItems();
updateItemCount();

console.log('\n--- Searching for "electronics" ---');
performSearch('electronics');

console.log('\n--- Searching for "nike" ---');
performSearch('nike');

console.log('\n--- Searching for "shoe" ---');
performSearch('shoe');

console.log('\n--- Clearing search ---');
performSearch('');

// Export for use in HTML/React
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    items,
    filterItems,
    displayItems,
    highlightText,
    updateItemCount,
    performSearch,
    filteredItems
  };
}
