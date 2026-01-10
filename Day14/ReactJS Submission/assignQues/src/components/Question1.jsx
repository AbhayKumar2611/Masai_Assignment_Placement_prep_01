import React, { useState, useEffect, useMemo } from 'react'

const Question1 = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [sortBy, setSortBy] = useState('rating') // 'rating' or 'year'
  const [currentPage, setCurrentPage] = useState(1)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    genre: '',
    rating: ''
  })

  const pageSize = 10

  // Fetch initial movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=20')
        const posts = await response.json()
        
        // Transform posts to movie structure
        const initialMovies = posts.map((post, index) => ({
          id: post.id,
          title: post.title.charAt(0).toUpperCase() + post.title.slice(1),
          year: 2015 + (index % 10),
          genre: ['Action', 'Drama', 'Comedy', 'Thriller', 'Sci-Fi'][index % 5],
          rating: (Math.random() * 3 + 2).toFixed(1) // Random rating between 2.0 and 5.0
        }))
        
        setMovies(initialMovies)
      } catch (err) {
        setError('Failed to load movies. Please try again.')
        console.error('Error fetching movies:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  // Debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1) // Reset to first page on search
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Filter and sort movies
  const filteredAndSortedMovies = useMemo(() => {
    let filtered = movies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      const matchesGenre = selectedGenre === 'all' || movie.genre === selectedGenre
      return matchesSearch && matchesGenre
    })

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'rating') {
        return parseFloat(b.rating) - parseFloat(a.rating)
      } else if (sortBy === 'year') {
        return b.year - a.year
      }
      return 0
    })

    return filtered
  }, [movies, debouncedSearchTerm, selectedGenre, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedMovies.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedMovies = filteredAndSortedMovies.slice(startIndex, startIndex + pageSize)

  // Get unique genres
  const genres = useMemo(() => {
    return ['all', ...new Set(movies.map(m => m.genre))]
  }, [movies])

  // Handle form input
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Add new movie
  const handleAddMovie = (e) => {
    e.preventDefault()
    const newMovie = {
      id: movies.length > 0 ? Math.max(...movies.map(m => m.id)) + 1 : 1,
      title: formData.title,
      year: parseInt(formData.year),
      genre: formData.genre,
      rating: parseFloat(formData.rating).toFixed(1)
    }
    setMovies([...movies, newMovie])
    setFormData({ title: '', year: '', genre: '', rating: '' })
  }

  // Start editing
  const handleEdit = (movie) => {
    setEditingId(movie.id)
    setFormData({
      title: movie.title,
      year: movie.year.toString(),
      genre: movie.genre,
      rating: movie.rating
    })
  }

  // Save edit
  const handleSaveEdit = () => {
    setMovies(movies.map(movie =>
      movie.id === editingId
        ? {
            ...movie,
            title: formData.title,
            year: parseInt(formData.year),
            genre: formData.genre,
            rating: parseFloat(formData.rating).toFixed(1)
          }
        : movie
    ))
    setEditingId(null)
    setFormData({ title: '', year: '', genre: '', rating: '' })
  }

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null)
    setFormData({ title: '', year: '', genre: '', rating: '' })
  }

  // Delete movie
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      setMovies(movies.filter(movie => movie.id !== id))
      if (paginatedMovies.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Loading movies...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#dc3545' }}>
        <div>{error}</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Movie Collection Manager</h1>

      {/* Add/Edit Form */}
      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2>{editingId ? 'Edit Movie' : 'Add New Movie'}</h2>
        <form onSubmit={editingId ? handleSaveEdit : handleAddMovie}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleInputChange}
              required
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              type="number"
              name="year"
              placeholder="Year"
              value={formData.year}
              onChange={handleInputChange}
              min="1900"
              max="2024"
              required
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <select
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              required
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="">Select Genre</option>
              <option value="Action">Action</option>
              <option value="Drama">Drama</option>
              <option value="Comedy">Comedy</option>
              <option value="Thriller">Thriller</option>
              <option value="Sci-Fi">Sci-Fi</option>
            </select>
            <input
              type="number"
              name="rating"
              placeholder="Rating (0-5)"
              value={formData.rating}
              onChange={handleInputChange}
              min="0"
              max="5"
              step="0.1"
              required
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {editingId ? 'Save Changes' : 'Add Movie'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Filters and Search */}
      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            flex: '1',
            minWidth: '200px'
          }}
        />
        <select
          value={selectedGenre}
          onChange={(e) => {
            setSelectedGenre(e.target.value)
            setCurrentPage(1)
          }}
          style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          {genres.map(genre => (
            <option key={genre} value={genre}>
              {genre === 'all' ? 'All Genres' : genre}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value)
            setCurrentPage(1)
          }}
          style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="rating">Sort by Rating</option>
          <option value="year">Sort by Year</option>
        </select>
      </div>

      {/* Movies Table */}
      <div style={{ marginBottom: '20px' }}>
        Showing {filteredAndSortedMovies.length} movie{filteredAndSortedMovies.length !== 1 ? 's' : ''}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Title</th>
            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Year</th>
            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Genre</th>
            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Rating</th>
            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedMovies.map((movie) => (
            <tr key={movie.id}>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{movie.title}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{movie.year}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{movie.genre}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>⭐ {movie.rating}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                <button
                  onClick={() => handleEdit(movie)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '5px'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(movie.id)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              borderRadius: '4px'
            }}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              backgroundColor: currentPage === totalPages ? '#f5f5f5' : 'white',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              borderRadius: '4px'
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default Question1
