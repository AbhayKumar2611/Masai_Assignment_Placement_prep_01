// Q2: Sortable Table

const tableData = [
  { name: 'John', age: 25, salary: 50000 },
  { name: 'Alice', age: 30, salary: 75000 },
  { name: 'Bob', age: 22, salary: 45000 },
  { name: 'Charlie', age: 35, salary: 90000 }
];

// State
let sortedData = [...tableData];
let sortColumn = null; // Current column being sorted
let sortDirection = null; // 'asc', 'desc', or null

// Display table data
function displayTable() {
  console.log('\n=== Sortable Table ===');
  console.log('Column Headers: [Name] [Age] [Salary]');
  console.log('(Click headers to sort)');
  console.log('\nData:');
  
  sortedData.forEach((row, index) => {
    console.log(`${index + 1}. Name: ${row.name} | Age: ${row.age} | Salary: $${row.salary}`);
  });
  
  displaySortIndicator();
}

// Display sort indicator
function displaySortIndicator() {
  if (sortColumn) {
    const indicator = sortDirection === 'asc' ? '↑' : '↓';
    console.log(`\nSorted by: ${sortColumn} ${indicator}`);
  } else {
    console.log('\nNo sorting applied');
  }
}

// Sort data by column
function sortByColumn(column) {
  // Toggle sort direction
  if (sortColumn === column) {
    if (sortDirection === 'asc') {
      sortDirection = 'desc';
    } else if (sortDirection === 'desc') {
      // Third click: remove sort (reset to original)
      sortColumn = null;
      sortDirection = null;
      sortedData = [...tableData];
      displayTable();
      return;
    }
  } else {
    // New column: start with ascending
    sortColumn = column;
    sortDirection = 'asc';
  }
  
  // Perform sort
  sortedData = [...tableData].sort((a, b) => {
    let aVal = a[column];
    let bVal = b[column];
    
    // Handle different data types
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      // Numeric sorting
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    } else {
      // String sorting
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();
      
      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    }
  });
  
  displayTable();
}

// Demo usage
console.log('=== Sortable Table Demo ===');
displayTable();

console.log('\n--- Clicking "Name" header (1st click - ascending) ---');
sortByColumn('name');

console.log('\n--- Clicking "Name" header (2nd click - descending) ---');
sortByColumn('name');

console.log('\n--- Clicking "Name" header (3rd click - reset) ---');
sortByColumn('name');

console.log('\n--- Clicking "Age" header (1st click - ascending) ---');
sortByColumn('age');

console.log('\n--- Clicking "Salary" header (1st click - ascending) ---');
sortByColumn('salary');

console.log('\n--- Clicking "Salary" header (2nd click - descending) ---');
sortByColumn('salary');

// Export for use in HTML/React
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    tableData,
    sortedData,
    sortByColumn,
    displayTable,
    sortColumn,
    sortDirection
  };
}

