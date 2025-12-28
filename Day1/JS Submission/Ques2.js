const users = [
  {
    id: 1,
    name: 'Alice',
    courses: [
      { title: 'React', rating: 4.5, completed: true },
      { title: 'Node', rating: 3.8, completed: true },
      { title: 'CSS', rating: 4.2, completed: true }
    ]
  },
  {
    id: 2,
    name: 'Bob',
    courses: [
      { title: 'React', rating: 4.7, completed: true },
      { title: 'Vue', rating: 4.3, completed: false }
    ]
  },
  {
    id: 3,
    name: 'Charlie',
    courses: [
      { title: 'Angular', rating: 4.6, completed: true },
      { title: 'React', rating: 4.8, completed: true },
      { title: 'Node', rating: 4.1, completed: true }
    ]
  }
];

// Solution: Filter users with at least 2 completed courses rated above 4.0
const filterQualifiedUsers = (users) => {
  return users
    .filter(user => {
      // Count courses that are both completed AND have rating > 4.0
      const qualifiedCoursesCount = user.courses.filter(
        course => course.completed && course.rating > 4.0
      ).length;
      
      // Keep user if they have at least 2 qualified courses
      return qualifiedCoursesCount >= 2;
    })
    .map(user => ({
      // Return only id and name
      id: user.id,
      name: user.name
    }));
};

// Execute the filtering
const result = filterQualifiedUsers(users);

console.log(result);

// Output:
// [
//   { id: 1, name: 'Alice' },
//   { id: 3, name: 'Charlie' }
// ]

// Breakdown:
// Alice: React (4.5✓), CSS (4.2✓) = 2 qualified courses ✓
// Bob: React (4.7✓), Vue (not completed✗) = 1 qualified course ✗
// Charlie: Angular (4.6✓), React (4.8✓), Node (4.1✓) = 3 qualified courses ✓