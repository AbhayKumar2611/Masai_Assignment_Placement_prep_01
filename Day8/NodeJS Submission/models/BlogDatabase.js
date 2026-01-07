/**
 * Blog Database - In-Memory Data Model
 * Implements Users, Posts, Comments with relationships and cascading deletes
 */

class BlogDatabase {
  constructor() {
    // In-memory storage
    this.users = new Map(); // userId -> User object
    this.posts = new Map(); // postId -> Post object
    this.comments = new Map(); // commentId -> Comment object
    
    // Indexes for faster queries
    this.userPostsIndex = new Map(); // userId -> Set of postIds
    this.postCommentsIndex = new Map(); // postId -> Set of commentIds
    this.userCommentsIndex = new Map(); // userId -> Set of commentIds
    
    // Auto-increment IDs
    this.nextUserId = 1;
    this.nextPostId = 1;
    this.nextCommentId = 1;
  }

  // ==================== USER OPERATIONS ====================

  /**
   * Create a new user
   * @param {Object} userData - User data (username, email, name)
   * @returns {Object} Created user
   */
  createUser(userData) {
    const { username, email, name } = userData;
    
    if (!username || !email) {
      throw new Error('Username and email are required');
    }

    // Check for duplicate username or email
    for (const user of this.users.values()) {
      if (user.username === username) {
        throw new Error('Username already exists');
      }
      if (user.email === email) {
        throw new Error('Email already exists');
      }
    }

    const userId = this.nextUserId++;
    const user = {
      id: userId,
      username,
      email,
      name: name || username,
      createdAt: new Date().toISOString()
    };

    this.users.set(userId, user);
    this.userPostsIndex.set(userId, new Set());
    this.userCommentsIndex.set(userId, new Set());

    return { ...user };
  }

  /**
   * Get user by ID
   */
  getUserById(userId) {
    return this.users.get(userId) ? { ...this.users.get(userId) } : null;
  }

  /**
   * Get all users
   */
  getAllUsers() {
    return Array.from(this.users.values()).map(user => ({ ...user }));
  }

  /**
   * Query users by criteria
   */
  queryUsers(criteria) {
    let results = Array.from(this.users.values());

    if (criteria.username) {
      results = results.filter(u => u.username.includes(criteria.username));
    }
    if (criteria.email) {
      results = results.filter(u => u.email.includes(criteria.email));
    }
    if (criteria.name) {
      results = results.filter(u => u.name.includes(criteria.name));
    }

    return results.map(user => ({ ...user }));
  }

  // ==================== POST OPERATIONS ====================

  /**
   * Create a new post
   * @param {Object} postData - Post data (userId, title, content)
   * @returns {Object} Created post
   */
  createPost(postData) {
    const { userId, title, content } = postData;

    if (!userId || !title || !content) {
      throw new Error('UserId, title, and content are required');
    }

    // Verify user exists
    if (!this.users.has(userId)) {
      throw new Error('User not found');
    }

    const postId = this.nextPostId++;
    const post = {
      id: postId,
      userId,
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.posts.set(postId, post);
    this.userPostsIndex.get(userId).add(postId);
    this.postCommentsIndex.set(postId, new Set());

    return { ...post };
  }

  /**
   * Get post by ID
   */
  getPostById(postId) {
    return this.posts.get(postId) ? { ...this.posts.get(postId) } : null;
  }

  /**
   * Get all posts
   */
  getAllPosts() {
    return Array.from(this.posts.values()).map(post => ({ ...post }));
  }

  /**
   * Update post
   */
  updatePost(postId, updates) {
    const post = this.posts.get(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    if (updates.title) post.title = updates.title;
    if (updates.content) post.content = updates.content;
    post.updatedAt = new Date().toISOString();

    return { ...post };
  }

  /**
   * Query posts by criteria
   */
  queryPosts(criteria) {
    let results = Array.from(this.posts.values());

    if (criteria.userId) {
      results = results.filter(p => p.userId === criteria.userId);
    }
    if (criteria.title) {
      results = results.filter(p => 
        p.title.toLowerCase().includes(criteria.title.toLowerCase())
      );
    }
    if (criteria.content) {
      results = results.filter(p => 
        p.content.toLowerCase().includes(criteria.content.toLowerCase())
      );
    }
    if (criteria.createdAfter) {
      results = results.filter(p => p.createdAt >= criteria.createdAfter);
    }
    if (criteria.createdBefore) {
      results = results.filter(p => p.createdAt <= criteria.createdBefore);
    }

    return results.map(post => ({ ...post }));
  }

  /**
   * Get posts by user ID
   */
  getPostsByUserId(userId) {
    const postIds = this.userPostsIndex.get(userId);
    if (!postIds) return [];

    return Array.from(postIds)
      .map(postId => this.posts.get(postId))
      .filter(Boolean)
      .map(post => ({ ...post }));
  }

  // ==================== COMMENT OPERATIONS ====================

  /**
   * Create a new comment
   * @param {Object} commentData - Comment data (userId, postId, content)
   * @returns {Object} Created comment
   */
  createComment(commentData) {
    const { userId, postId, content } = commentData;

    if (!userId || !postId || !content) {
      throw new Error('UserId, postId, and content are required');
    }

    // Verify user and post exist
    if (!this.users.has(userId)) {
      throw new Error('User not found');
    }
    if (!this.posts.has(postId)) {
      throw new Error('Post not found');
    }

    const commentId = this.nextCommentId++;
    const comment = {
      id: commentId,
      userId,
      postId,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.comments.set(commentId, comment);
    this.postCommentsIndex.get(postId).add(commentId);
    this.userCommentsIndex.get(userId).add(commentId);

    return { ...comment };
  }

  /**
   * Get comment by ID
   */
  getCommentById(commentId) {
    return this.comments.get(commentId) ? { ...this.comments.get(commentId) } : null;
  }

  /**
   * Get all comments
   */
  getAllComments() {
    return Array.from(this.comments.values()).map(comment => ({ ...comment }));
  }

  /**
   * Update comment
   */
  updateComment(commentId, updates) {
    const comment = this.comments.get(commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    if (updates.content) comment.content = updates.content;
    comment.updatedAt = new Date().toISOString();

    return { ...comment };
  }

  /**
   * Query comments by criteria
   */
  queryComments(criteria) {
    let results = Array.from(this.comments.values());

    if (criteria.userId) {
      results = results.filter(c => c.userId === criteria.userId);
    }
    if (criteria.postId) {
      results = results.filter(c => c.postId === criteria.postId);
    }
    if (criteria.content) {
      results = results.filter(c => 
        c.content.toLowerCase().includes(criteria.content.toLowerCase())
      );
    }
    if (criteria.createdAfter) {
      results = results.filter(c => c.createdAt >= criteria.createdAfter);
    }

    return results.map(comment => ({ ...comment }));
  }

  /**
   * Get comments by post ID
   */
  getCommentsByPostId(postId) {
    const commentIds = this.postCommentsIndex.get(postId);
    if (!commentIds) return [];

    return Array.from(commentIds)
      .map(commentId => this.comments.get(commentId))
      .filter(Boolean)
      .map(comment => ({ ...comment }));
  }

  /**
   * Get comments by user ID
   */
  getCommentsByUserId(userId) {
    const commentIds = this.userCommentsIndex.get(userId);
    if (!commentIds) return [];

    return Array.from(commentIds)
      .map(commentId => this.comments.get(commentId))
      .filter(Boolean)
      .map(comment => ({ ...comment }));
  }

  // ==================== RELATIONSHIP QUERIES ====================

  /**
   * Get post with all comments
   */
  getPostWithComments(postId) {
    const post = this.getPostById(postId);
    if (!post) return null;

    const comments = this.getCommentsByPostId(postId);
    return {
      ...post,
      comments: comments.map(c => ({
        ...c,
        user: this.getUserById(c.userId)
      }))
    };
  }

  /**
   * Get user with all posts and comments
   */
  getUserWithRelations(userId) {
    const user = this.getUserById(userId);
    if (!user) return null;

    const posts = this.getPostsByUserId(userId);
    const comments = this.getCommentsByUserId(userId);

    return {
      ...user,
      posts: posts.map(p => ({
        ...p,
        commentCount: this.getCommentsByPostId(p.id).length
      })),
      comments: comments.map(c => ({
        ...c,
        post: this.getPostById(c.postId)
      }))
    };
  }

  // ==================== CASCADING DELETES ====================

  /**
   * Delete user and all related posts and comments (CASCADE)
   */
  deleteUser(userId) {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get all posts by this user
    const postIds = Array.from(this.userPostsIndex.get(userId) || []);

    // Delete all posts (which will cascade to comments)
    postIds.forEach(postId => {
      this.deletePost(postId);
    });

    // Get remaining comments by this user (on other users' posts)
    const commentIds = Array.from(this.userCommentsIndex.get(userId) || []);
    commentIds.forEach(commentId => {
      this.deleteComment(commentId);
    });

    // Remove user from indexes
    this.userPostsIndex.delete(userId);
    this.userCommentsIndex.delete(userId);

    // Delete user
    this.users.delete(userId);

    return { deleted: true, userId };
  }

  /**
   * Delete post and all related comments (CASCADE)
   */
  deletePost(postId) {
    const post = this.posts.get(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    // Get all comments on this post
    const commentIds = Array.from(this.postCommentsIndex.get(postId) || []);

    // Delete all comments
    commentIds.forEach(commentId => {
      this.deleteComment(commentId);
    });

    // Remove post from user's posts index
    const userId = post.userId;
    this.userPostsIndex.get(userId)?.delete(postId);

    // Remove post from indexes
    this.postCommentsIndex.delete(postId);

    // Delete post
    this.posts.delete(postId);

    return { deleted: true, postId, deletedComments: commentIds.length };
  }

  /**
   * Delete comment
   */
  deleteComment(commentId) {
    const comment = this.comments.get(commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    // Remove comment from post's comments index
    const postId = comment.postId;
    this.postCommentsIndex.get(postId)?.delete(commentId);

    // Remove comment from user's comments index
    const userId = comment.userId;
    this.userCommentsIndex.get(userId)?.delete(commentId);

    // Delete comment
    this.comments.delete(commentId);

    return { deleted: true, commentId };
  }

  // ==================== STATISTICS ====================

  /**
   * Get database statistics
   */
  getStats() {
    return {
      totalUsers: this.users.size,
      totalPosts: this.posts.size,
      totalComments: this.comments.size,
      averagePostsPerUser: this.users.size > 0 
        ? (this.posts.size / this.users.size).toFixed(2) 
        : 0,
      averageCommentsPerPost: this.posts.size > 0
        ? (this.comments.size / this.posts.size).toFixed(2)
        : 0
    };
  }

  /**
   * Clear all data
   */
  clear() {
    this.users.clear();
    this.posts.clear();
    this.comments.clear();
    this.userPostsIndex.clear();
    this.postCommentsIndex.clear();
    this.userCommentsIndex.clear();
    this.nextUserId = 1;
    this.nextPostId = 1;
    this.nextCommentId = 1;
  }
}

module.exports = BlogDatabase;

