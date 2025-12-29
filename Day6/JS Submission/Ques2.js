// Q2: Parallel API Calls with Data Merging
// Fetch users and posts separately, then merge them to show each user with their post count

// Method 1: Using Promise.all() with async/await
async function fetchUsersAndPosts() {
  try {
    // Fetch both APIs in parallel
    const [usersResponse, postsResponse] = await Promise.all([
      fetch('https://jsonplaceholder.typicode.com/users'),
      fetch('https://jsonplaceholder.typicode.com/posts')
    ])
    
    // Check if both requests were successful
    if (!usersResponse.ok) {
      throw new Error(`Users API error! status: ${usersResponse.status}`)
    }
    if (!postsResponse.ok) {
      throw new Error(`Posts API error! status: ${postsResponse.status}`)
    }
    
    // Parse JSON responses
    const users = await usersResponse.json()
    const posts = await postsResponse.json()
    
    // Count posts per user
    const postCountByUserId = posts.reduce((acc, post) => {
      acc[post.userId] = (acc[post.userId] || 0) + 1
      return acc
    }, {})
    
    // Merge users with post counts
    const mergedData = users.map(user => ({
      userId: user.id,
      name: user.name,
      postCount: postCountByUserId[user.id] || 0
    }))
    
    console.log('Merged Users with Post Counts:', mergedData)
    return mergedData
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

// Method 2: Using Promise.all() with .then()
function fetchUsersAndPostsPromise() {
  return Promise.all([
    fetch('https://jsonplaceholder.typicode.com/users'),
    fetch('https://jsonplaceholder.typicode.com/posts')
  ])
    .then(([usersResponse, postsResponse]) => {
      if (!usersResponse.ok || !postsResponse.ok) {
        throw new Error('One or more API requests failed')
      }
      return Promise.all([usersResponse.json(), postsResponse.json()])
    })
    .then(([users, posts]) => {
      // Count posts per user
      const postCountByUserId = posts.reduce((acc, post) => {
        acc[post.userId] = (acc[post.userId] || 0) + 1
        return acc
      }, {})
      
      // Merge users with post counts
      return users.map(user => ({
        userId: user.id,
        name: user.name,
        postCount: postCountByUserId[user.id] || 0
      }))
    })
    .catch(error => {
      console.error('Error fetching data:', error)
      throw error
    })
}

// Method 3: Using async/await with separate error handling
async function fetchUsersAndPostsWithErrorHandling() {
  try {
    // Start both fetch requests in parallel
    const usersPromise = fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        if (!response.ok) throw new Error(`Users API failed: ${response.status}`)
        return response.json()
      })
    
    const postsPromise = fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => {
        if (!response.ok) throw new Error(`Posts API failed: ${response.status}`)
        return response.json()
      })
    
    // Wait for both to complete
    const [users, posts] = await Promise.all([usersPromise, postsPromise])
    
    // Count posts per user using Map for better performance
    const postCountMap = new Map()
    posts.forEach(post => {
      postCountMap.set(post.userId, (postCountMap.get(post.userId) || 0) + 1)
    })
    
    // Merge data
    const mergedData = users.map(user => ({
      userId: user.id,
      name: user.name,
      postCount: postCountMap.get(user.id) || 0
    }))
    
    return mergedData
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

// Execute the function
fetchUsersAndPosts()
  .then(result => {
    console.log('\n=== Final Result ===')
    console.log(JSON.stringify(result, null, 2))
  })
  .catch(error => {
    console.error('Failed to fetch and merge data:', error)
  })

// Expected Output:
// [
//   { userId: 1, name: 'Leanne Graham', postCount: 10 },
//   { userId: 2, name: 'Ervin Howell', postCount: 10 },
//   // ... all users with their post counts
// ]

