// Q1: Infinite Scroll Implementation

// Generate 100 items
const allItems = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  description: `Description for item ${i + 1}`
}));

// State
const itemsPerPage = 10;
let displayedItems = [];
let currentIndex = 0;
let isLoading = false;
let hasMoreItems = true;

// Initialize: Load first batch
function initialize() {
  loadMoreItems();
}

// Load next batch of items
function loadMoreItems() {
  if (isLoading || !hasMoreItems) {
    return;
  }
  
  isLoading = true;
  showLoadingIndicator();
  
  // Simulate network delay
  setTimeout(() => {
    const nextBatch = allItems.slice(currentIndex, currentIndex + itemsPerPage);
    
    if (nextBatch.length === 0) {
      hasMoreItems = false;
      hideLoadingIndicator();
      showEndOfData();
      isLoading = false;
      return;
    }
    
    displayedItems = [...displayedItems, ...nextBatch];
    currentIndex += nextBatch.length;
    
    if (currentIndex >= allItems.length) {
      hasMoreItems = false;
    }
    
    displayItems();
    hideLoadingIndicator();
    isLoading = false;
    
    console.log(`Loaded ${nextBatch.length} items. Total displayed: ${displayedItems.length}/${allItems.length}`);
  }, 500); // Simulate 500ms loading time
}

// Display items
function displayItems() {
  console.log('\n=== Infinite Scroll Feed ===');
  console.log(`Displaying items ${displayedItems.length > 0 ? 1 : 0} to ${displayedItems.length} of ${allItems.length}`);
  console.log('\nItems:');
  
  displayedItems.forEach(item => {
    console.log(`${item.id}. ${item.title} - ${item.description}`);
  });
  
  if (hasMoreItems) {
    console.log('\n[Scroll to bottom to load more...]');
  }
}

// Show loading indicator
function showLoadingIndicator() {
  console.log('\n[Loading... 🔄]');
}

// Hide loading indicator
function hideLoadingIndicator() {
  // In real app, this would hide the loading spinner
}

// Show end of data message
function showEndOfData() {
  console.log('\n[End of data - All items loaded]');
}

// Simulate scroll detection (in real app, this would use scroll event listener)
function simulateScroll() {
  // Check if scrolled within 100px of bottom
  const scrollPosition = displayedItems.length;
  const threshold = allItems.length - 100 / itemsPerPage; // Simplified threshold
  
  if (scrollPosition >= currentIndex - 1 && hasMoreItems && !isLoading) {
    console.log('\n--- Scroll detected near bottom ---');
    loadMoreItems();
  }
}

// Demo usage
console.log('=== Infinite Scroll Demo ===');
console.log('Initial load:');
initialize();

console.log('\n--- Simulating scroll (loading more) ---');
setTimeout(() => {
  simulateScroll();
}, 600);

console.log('\n--- Simulating another scroll ---');
setTimeout(() => {
  simulateScroll();
}, 1200);

// Simulate scrolling until all items are loaded
function simulateFullScroll() {
  const interval = setInterval(() => {
    if (hasMoreItems && !isLoading) {
      simulateScroll();
    } else {
      clearInterval(interval);
      console.log('\n=== All items loaded ===');
      displayItems();
    }
  }, 700);
}

// Uncomment to simulate full scroll
// simulateFullScroll();

// Export for use in HTML/React
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    allItems,
    displayedItems,
    loadMoreItems,
    displayItems,
    initialize,
    isLoading,
    hasMoreItems,
    simulateScroll
  };
}

