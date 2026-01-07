// Q1: Multi-level Sorting
// Sort employees by:
// 1) dept (ascending)
// 2) salary (descending)
// 3) name (ascending)

const employees = [
  { name: 'John', dept: 'Engineering', salary: 80000 },
  { name: 'Alice', dept: 'Engineering', salary: 95000 },
  { name: 'Bob', dept: 'Marketing', salary: 95000 },
  { name: 'Charlie', dept: 'Engineering', salary: 95000 },
  { name: 'Diana', dept: 'Marketing', salary: 95000 },
  { name: 'Eve', dept: 'HR', salary: 70000 }
];

/**
 * Sorts an array of employee objects by:
 *  - dept ascending (A → Z)
 *  - salary descending (high → low)
 *  - name ascending (A → Z)
 *
 * @param {Array} list - array of employee objects
 * @returns {Array} new sorted array (original is not mutated)
 */
function sortEmployees(list) {
  // Create a shallow copy so original array is not mutated
  return [...list].sort((a, b) => {
    // 1) Department ascending
    if (a.dept !== b.dept) {
      return a.dept.localeCompare(b.dept);
    }

    // 2) Salary descending
    if (a.salary !== b.salary) {
      return b.salary - a.salary;
    }

    // 3) Name ascending
    return a.name.localeCompare(b.name);
  });
}

// Demo output
const sortedEmployees = sortEmployees(employees);
console.log('Sorted Employees:', sortedEmployees);

// Export for testing (Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { employees, sortEmployees };
}


