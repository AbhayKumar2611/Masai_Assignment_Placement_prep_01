import React, { useState, useMemo } from 'react'

const Question1 = () => {
  // Mock data
  const initialData = [
    { id: 1, name: 'Alice Johnson', department: 'Engineering', salary: 95000, joinDate: '2020-03-15' },
    { id: 2, name: 'Bob Smith', department: 'Marketing', salary: 75000, joinDate: '2021-07-22' },
    { id: 3, name: 'Carol White', department: 'Engineering', salary: 105000, joinDate: '2019-01-10' },
    { id: 4, name: 'David Brown', department: 'Sales', salary: 68000, joinDate: '2022-05-30' },
    { id: 5, name: 'Eve Davis', department: 'HR', salary: 72000, joinDate: '2020-11-12' },
    { id: 6, name: 'Frank Miller', department: 'Engineering', salary: 110000, joinDate: '2018-06-20' },
    { id: 7, name: 'Grace Lee', department: 'Marketing', salary: 82000, joinDate: '2021-02-14' },
    { id: 8, name: 'Henry Wilson', department: 'Sales', salary: 71000, joinDate: '2022-09-05' },
    { id: 9, name: 'Ivy Taylor', department: 'HR', salary: 69000, joinDate: '2021-12-01' },
    { id: 10, name: 'Jack Anderson', department: 'Engineering', salary: 98000, joinDate: '2020-08-18' },
    { id: 11, name: 'Kate Martinez', department: 'Marketing', salary: 78000, joinDate: '2022-01-10' },
    { id: 12, name: 'Leo Garcia', department: 'Sales', salary: 73000, joinDate: '2021-05-25' },
    { id: 13, name: 'Mia Rodriguez', department: 'HR', salary: 74000, joinDate: '2020-04-12' },
    { id: 14, name: 'Noah Lopez', department: 'Engineering', salary: 102000, joinDate: '2019-09-30' },
    { id: 15, name: 'Olivia Harris', department: 'Marketing', salary: 79000, joinDate: '2021-11-15' }
  ]

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null })

  const handleSort = (key) => {
    let direction = 'asc'
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc'
      } else if (sortConfig.direction === 'desc') {
        // Third click: remove sort
        setSortConfig({ key: null, direction: null })
        return
      }
    }
    
    setSortConfig({ key, direction })
  }

  const sortedData = useMemo(() => {
    if (!sortConfig.key) {
      return initialData
    }

    const sorted = [...initialData].sort((a, b) => {
      let aValue = a[sortConfig.key]
      let bValue = b[sortConfig.key]

      // Handle different data types
      if (sortConfig.key === 'salary') {
        aValue = Number(aValue)
        bValue = Number(bValue)
      } else if (sortConfig.key === 'joinDate') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      } else {
        aValue = String(aValue).toLowerCase()
        bValue = String(bValue).toLowerCase()
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })

    return sorted
  }, [sortConfig])

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) {
      return '↕️'
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓'
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Data Table with Sorting</h1>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th
              onClick={() => handleSort('name')}
              style={{
                padding: '12px',
                textAlign: 'left',
                border: '1px solid #ddd',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              Name {getSortIndicator('name')}
            </th>
            <th
              onClick={() => handleSort('department')}
              style={{
                padding: '12px',
                textAlign: 'left',
                border: '1px solid #ddd',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              Department {getSortIndicator('department')}
            </th>
            <th
              onClick={() => handleSort('salary')}
              style={{
                padding: '12px',
                textAlign: 'left',
                border: '1px solid #ddd',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              Salary {getSortIndicator('salary')}
            </th>
            <th
              onClick={() => handleSort('joinDate')}
              style={{
                padding: '12px',
                textAlign: 'left',
                border: '1px solid #ddd',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              Join Date {getSortIndicator('joinDate')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((employee) => (
            <tr key={employee.id}>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{employee.name}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{employee.department}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                ${employee.salary.toLocaleString()}
              </td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{employee.joinDate}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '20px', color: '#666', fontSize: '14px' }}>
        Click column headers to sort. First click: ascending ↑, second: descending ↓, third: remove sort.
      </div>
    </div>
  )
}

export default Question1
