// Q1: Fetch and Transform User Data
// Fetch users from API and transform to show only active users with their full names

// Method 1: Using async/await
async function fetchAndTransformUsers() {
  try {
    // Fetch users from API
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const users = await response.json()
    
    // Filter and transform users
    // Condition: username length > 6 (active users)
    const transformedUsers = users
      .filter(user => user.username && user.username.length > 6) // Filter condition
      .map(user => ({
        id: user.id,
        fullName: user.name, // Full name from name field
        email: user.email
      }))
    
    console.log('Transformed Users:', transformedUsers)
    return transformedUsers
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

// Method 2: Using .then() promises
function fetchAndTransformUsersPromise() {
  return fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    })
    .then(users => {
      // Filter and transform
      return users
        .filter(user => user.username && user.username.length > 6)
        .map(user => ({
          id: user.id,
          fullName: user.name,
          email: user.email
        }))
    })
    .catch(error => {
      console.error('Error fetching users:', error)
      throw error
    })
}

// Execute the function
fetchAndTransformUsers()
  .then(result => {
    console.log('\n=== Final Result ===')
    console.log(JSON.stringify(result, null, 2))
  })
  .catch(error => {
    console.error('Failed to fetch and transform users:', error)
  })

// Expected Output:
// [
//   { id: 1, fullName: 'Leanne Graham', email: 'Sincere@april.biz' },
//   { id: 2, fullName: 'Ervin Howell', email: 'Shanna@melissa.tv' },
//   // ... only users with username length > 6
// ]

