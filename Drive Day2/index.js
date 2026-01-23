const employees = [
  { id: 1, name: "Alice", department: "Engineering", salary: 120000, experience: 5, rating: 4.8 },
  { id: 2, name: "Bob", department: "Engineering", salary: 95000, experience: 2, rating: 3.9 },
  { id: 3, name: "Charlie", department: "Sales", salary: 80000, experience: 4, rating: 4.5 },
  { id: 4, name: "Diana", department: "HR", salary: 70000, experience: 1, rating: 3.2 },
  { id: 5, name: "Evan", department: "Engineering", salary: 135000, experience: 7, rating: 4.9 },
  { id: 6, name: "Fiona", department: "Marketing", salary: 90000, experience: 3, rating: 4.1 },
  { id: 7, name: "George", department: "Sales", salary: 65000, experience: 1, rating: 3.5 },
  { id: 8, name: "Hannah", department: "Engineering", salary: 110000, experience: 4, rating: 4.6 },
  { id: 9, name: "Ian", department: "Marketing", salary: 105000, experience: 6, rating: 4.7 },
  { id: 10, name: "Jenny", department: "HR", salary: 72000, experience: 3, rating: 3.8 },
  { id: 11, name: "Kevin", department: "Sales", salary: 125000, experience: 8, rating: 4.2 },
  { id: 12, name: "Liam", department: "Engineering", salary: 98000, experience: 3, rating: 4.0 },
  { id: 13, name: "Mia", department: "Design", salary: 85000, experience: 2, rating: 4.3 },
  { id: 14, name: "Noah", department: "Design", salary: 115000, experience: 9, rating: 4.8 },
  { id: 15, name: "Olivia", department: "Marketing", salary: 78000, experience: 2, rating: 3.9 }
];

// 1. The "VIP List" (Chaining: Filter + Map)
// Requirement: HR wants a list of names of "High Performers" (rating 4.5) to send them a thank-you email.

// Input: The employees array.
// Output: An array of strings: ["Alice", "Charlie", "Evan", ...]

let vipArray = employees.filter((employee) => employee.rating >= 4.5).map((emp) => emp.name)
console.log("VIP List:", vipArray)


// 2. Budget Planning (Chaining: Filter + Reduce)
// Requirement: We need to know the Total Annual Salary cost for the Engineering department specifically.

// Input: The employees array.
// Output: A single number (e.g., 558000).

const res = employees.filter((emp) => emp.department === "Engineering").reduce((acc, cv) => acc + cv.salary, 0)
console.log(res)


// 3. Experience Ranking (Sort)
// Requirement: Sort the employees by Experience (Descending). If two people have the same experience, sort them by Salary (Descending) as a tie-breaker.

// Input: The employees array.
// Output: The sorted array of objects.

let sortedArr = employees.sort((a, b) => b.experience - a.experience || b.salary - a.salary)
console.log(sortedArr)


// 4. Department Census (Aggregation: Reduce)
// Requirement: We need to know how many people work in each department.

//   Input: The employees array.
//     Output: An object looking like this:
// { Engineering: 5, Sales: 3, ... }

// without reduce
let obj1 = {}
for (let emp of employees) {
  if (!obj1[emp.department]) {
    obj1[emp.department] = 1
  }
  else {
    obj1[emp.department] += 1
  }
}

// console.log("Object grouped by department without reduce", obj1)

// with reduce
obj = employees.reduce((ac, cv) => {
  if (!ac[cv.department]) {
    ac[cv.department] = 1
  } else {
    ac[cv.department] += 1
  }

  return ac
}, {})

console.log("Object grouped by department using reduce", obj)


// 5. The "Boss Level" (Complex Aggregation)
// Requirement: HR wants to know the Average Salary per department.

// Input: The employees array.
// Output: An object where the key is the department and the value is the average salary.
// { Engineering: 111600, Sales: ..., HR: ... }

let obj2 = {}
for (let emp of employees) {
  if (!obj2[emp.department]) {
    obj2[emp.department] = [emp.salary]
  } else {
    obj2[emp.department].push(emp.salary)
  }
}

// console.log(obj2)
// obj2 is :-
// {
//   Engineering: [ 120000, 95000, 135000, 110000, 98000 ],
//   Sales: [ 80000, 65000, 125000 ],
//   HR: [ 70000, 72000 ],
//   Marketing: [ 90000, 105000, 78000 ],
//   Design: [ 85000, 115000 ]
// }


let obj3 = {}

for (let key in obj2) {
    obj3[key] = obj2[key].reduce((ac, cv) => ac + cv, 0) / obj2[key].length
}

console.log("Average Salary per department", obj3)