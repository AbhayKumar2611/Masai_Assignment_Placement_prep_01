const BlogDatabase = require('./models/BlogDatabase');

// Create database instance
const db = new BlogDatabase();

console.log('=== Blog Database Demo ===\n');

try {
  // ==================== CREATE USERS ====================
  console.log('1. Creating Users...');
  const user1 = db.createUser({
    username: 'john_doe',
    email: 'john@example.com',
    name: 'John Doe'
  });
  console.log('Created user:', user1);

  const user2 = db.createUser({
    username: 'jane_smith',
    email: 'jane@example.com',
    name: 'Jane Smith'
  });
  console.log('Created user:', user2);

  const user3 = db.createUser({
    username: 'bob_wilson',
    email: 'bob@example.com',
    name: 'Bob Wilson'
  });
  console.log('Created user:', user3);
  console.log();

  // ==================== CREATE POSTS ====================
  console.log('2. Creating Posts...');
  const post1 = db.createPost({
    userId: user1.id,
    title: 'Introduction to JavaScript',
    content: 'JavaScript is a powerful programming language...'
  });
  console.log('Created post:', post1);

  const post2 = db.createPost({
    userId: user1.id,
    title: 'React Hooks Explained',
    content: 'React Hooks allow you to use state and other features...'
  });
  console.log('Created post:', post2);

  const post3 = db.createPost({
    userId: user2.id,
    title: 'Node.js Best Practices',
    content: 'Here are some best practices for Node.js development...'
  });
  console.log('Created post:', post3);
  console.log();

  // ==================== CREATE COMMENTS ====================
  console.log('3. Creating Comments...');
  const comment1 = db.createComment({
    userId: user2.id,
    postId: post1.id,
    content: 'Great article! Very informative.'
  });
  console.log('Created comment:', comment1);

  const comment2 = db.createComment({
    userId: user3.id,
    postId: post1.id,
    content: 'Thanks for sharing this!'
  });
  console.log('Created comment:', comment2);

  const comment3 = db.createComment({
    userId: user3.id,
    postId: post2.id,
    content: 'This helped me understand React better.'
  });
  console.log('Created comment:', comment3);

  const comment4 = db.createComment({
    userId: user1.id,
    postId: post3.id,
    content: 'Excellent tips!'
  });
  console.log('Created comment:', comment4);
  console.log();

  // ==================== QUERY OPERATIONS ====================
  console.log('4. Query Operations...');
  
  console.log('\n4.1. Get all users:');
  console.log(db.getAllUsers());

  console.log('\n4.2. Query users by username:');
  console.log(db.queryUsers({ username: 'john' }));

  console.log('\n4.3. Get posts by user ID:');
  console.log(db.getPostsByUserId(user1.id));

  console.log('\n4.4. Query posts by title:');
  console.log(db.queryPosts({ title: 'React' }));

  console.log('\n4.5. Get comments by post ID:');
  console.log(db.getCommentsByPostId(post1.id));

  console.log('\n4.6. Query comments by user ID:');
  console.log(db.getCommentsByUserId(user3.id));
  console.log();

  // ==================== RELATIONSHIP QUERIES ====================
  console.log('5. Relationship Queries...');
  
  console.log('\n5.1. Get post with all comments:');
  const postWithComments = db.getPostWithComments(post1.id);
  console.log(JSON.stringify(postWithComments, null, 2));

  console.log('\n5.2. Get user with all posts and comments:');
  const userWithRelations = db.getUserWithRelations(user1.id);
  console.log(JSON.stringify(userWithRelations, null, 2));
  console.log();

  // ==================== UPDATE OPERATIONS ====================
  console.log('6. Update Operations...');
  const updatedPost = db.updatePost(post1.id, {
    title: 'Introduction to JavaScript (Updated)',
    content: 'Updated content...'
  });
  console.log('Updated post:', updatedPost);

  const updatedComment = db.updateComment(comment1.id, {
    content: 'Updated comment: Great article! Very informative and helpful.'
  });
  console.log('Updated comment:', updatedComment);
  console.log();

  // ==================== STATISTICS ====================
  console.log('7. Database Statistics:');
  console.log(db.getStats());
  console.log();

  // ==================== CASCADING DELETE DEMO ====================
  console.log('8. Cascading Delete Demo...');
  console.log('\n8.1. Before deleting post:');
  console.log('Total comments:', db.getAllComments().length);
  console.log('Comments on post1:', db.getCommentsByPostId(post1.id).length);

  console.log('\n8.2. Deleting post (should cascade delete comments):');
  const deleteResult = db.deletePost(post1.id);
  console.log('Delete result:', deleteResult);
  console.log('Total comments after delete:', db.getAllComments().length);
  console.log('Comments on post1 (should be empty):', db.getCommentsByPostId(post1.id).length);

  console.log('\n8.3. Before deleting user:');
  console.log('Total posts:', db.getAllPosts().length);
  console.log('Total comments:', db.getAllComments().length);
  console.log('Posts by user1:', db.getPostsByUserId(user1.id).length);

  console.log('\n8.4. Deleting user (should cascade delete posts and comments):');
  const userDeleteResult = db.deleteUser(user1.id);
  console.log('User delete completed');
  console.log('Total posts after delete:', db.getAllPosts().length);
  console.log('Total comments after delete:', db.getAllComments().length);
  console.log('Posts by user1 (should be empty):', db.getPostsByUserId(user1.id).length);
  console.log();

  // ==================== FINAL STATISTICS ====================
  console.log('9. Final Statistics:');
  console.log(db.getStats());

} catch (error) {
  console.error('Error:', error.message);
}

