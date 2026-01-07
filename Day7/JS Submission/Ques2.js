// Q2: API with Error Handling & Retry
// Implement a fetch function with automatic retry logic (max 3 attempts) and proper error handling
// Handle network failures gracefully and implement exponential backoff

/**
 * Fetches data from an API with automatic retry logic and exponential backoff
 * @param {string} url - The API URL to fetch
 * @param {Object} options - Fetch options (same as standard fetch API)
 * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
 * @param {number} initialDelay - Initial delay in milliseconds for exponential backoff (default: 1000)
 * @returns {Promise} - Promise that resolves with the response data
 */
async function fetchWithRetry(url, options = {}, maxRetries = 3, initialDelay = 1000) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Check if response is successful (status 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse and return the JSON data
      const data = await response.json();
      return data;
    } catch (error) {
      lastError = error;

      // Don't retry on the last attempt
      if (attempt < maxRetries) {
        // Calculate exponential backoff delay: initialDelay * 2^attempt
        const delay = initialDelay * Math.pow(2, attempt);
        
        console.warn(
          `Attempt ${attempt + 1} failed: ${error.message}. Retrying in ${delay}ms...`
        );

        // Wait for the calculated delay before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error(`All ${maxRetries + 1} attempts failed. Last error: ${error.message}`);
      }
    }
  }

  // If all retries failed, throw the last error
  throw new Error(
    `Failed to fetch after ${maxRetries + 1} attempts: ${lastError.message}`
  );
}

// Example usage with the specified API
async function fetchPostWithRetry() {
  try {
    const post = await fetchWithRetry('https://jsonplaceholder.typicode.com/posts/1');
    console.log('Successfully fetched post:', post);
    return post;
  } catch (error) {
    console.error('Failed to fetch post after all retries:', error);
    throw error;
  }
}

// Execute the example
fetchPostWithRetry()
  .then(post => {
    console.log('Post data:', post);
  })
  .catch(error => {
    console.error('Final error:', error);
  });

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { fetchWithRetry, fetchPostWithRetry };
}

