// Q1: Sequential API Calls with Dependency
// Fetch a user, then fetch their posts, then fetch comments for their first post

async function fetchUserData() {
  try {
    // Step 1: Fetch user
    const userResponse = await fetch('https://jsonplaceholder.typicode.com/users/1');
    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user: ${userResponse.status}`);
    }
    const user = await userResponse.json();

    // Step 2: Fetch posts for the user
    const postsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`);
    if (!postsResponse.ok) {
      throw new Error(`Failed to fetch posts: ${postsResponse.status}`);
    }
    const posts = await postsResponse.json();

    if (posts.length === 0) {
      throw new Error('No posts found for this user');
    }

    // Step 3: Fetch comments for the first post
    const firstPostId = posts[0].id;
    const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${firstPostId}`);
    if (!commentsResponse.ok) {
      throw new Error(`Failed to fetch comments: ${commentsResponse.status}`);
    }
    const comments = await commentsResponse.json();

    // Format the result
    const result = {
      userName: user.name,
      firstPostTitle: posts[0].title,
      commentCount: comments.length,
      topComment: comments.length > 0 ? comments[0].body : 'No comments available'
    };

    return result;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

// Execute and log the result
fetchUserData()
  .then(result => {
    console.log('Result:', result);
  })
  .catch(error => {
    console.error('Failed to fetch user data:', error);
  });

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { fetchUserData };
}

