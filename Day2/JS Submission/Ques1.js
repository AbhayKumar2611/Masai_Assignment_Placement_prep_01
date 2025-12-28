const employees = [
  { id: 1, name: 'John', dept: 'Engineering', salary: 80000 },
  { id: 2, name: 'Jane', dept: 'Engineering', salary: 95000 },
  { id: 3, name: 'Bob', dept: 'Marketing', salary: 65000 },
  { id: 4, name: 'Alice', dept: 'Engineering', salary: 88000 },
  { id: 5, name: 'Charlie', dept: 'Marketing', salary: 72000 },
  { id: 6, name: 'Diana', dept: 'HR', salary: 70000 }
];

// Solution: Transform flat array to nested department structure
const transformToDepartmentStructure = (employees) => {
  return employees.reduce((result, employee) => {
    const { dept, name, salary } = employee;
    
    // Initialize department if it doesn't exist
    if (!result[dept]) {
      result[dept] = {
        employees: [],
        totalSalary: 0,
        totalCount: 0
      };
    }
    
    // Add employee name to the department
    result[dept].employees.push(name);
    
    // Add salary to total
    result[dept].totalSalary += salary;
    
    // Increment count
    result[dept].totalCount += 1;
    
    // Calculate average salary (rounded to 2 decimal places)
    result[dept].avgSalary = parseFloat(
      (result[dept].totalSalary / result[dept].totalCount).toFixed(2)
    );
    
    return result;
  }, {});
};

// Execute the transformation
const departmentStructure = transformToDepartmentStructure(employees);

// Clean up the result (remove totalSalary as it's not needed in final output)
Object.keys(departmentStructure).forEach(dept => {
  delete departmentStructure[dept].totalSalary;
});

console.log(departmentStructure);

// Output:
// {
//   Engineering: { employees: ['John', 'Jane', 'Alice'], avgSalary: 87666.67, totalCount: 3 },
//   Marketing: { employees: ['Bob', 'Charlie'], avgSalary: 68500, totalCount: 2 },
//   HR: { employees: ['Diana'], avgSalary: 70000, totalCount: 1 }
// }