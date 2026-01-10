import React, { useState, useEffect, useRef } from 'react'

const Question2 = () => {
  const initialStocks = [
    { symbol: 'AAPL', price: 178.50, name: 'Apple Inc.', previousPrice: 178.50 },
    { symbol: 'GOOGL', price: 142.30, name: 'Alphabet Inc.', previousPrice: 142.30 },
    { symbol: 'MSFT', price: 378.90, name: 'Microsoft Corp.', previousPrice: 378.90 },
    { symbol: 'AMZN', price: 145.20, name: 'Amazon.com Inc.', previousPrice: 145.20 },
    { symbol: 'TSLA', price: 242.80, name: 'Tesla Inc.', previousPrice: 242.80 }
  ]

  const [stocks, setStocks] = useState(initialStocks)
  const [isUpdating, setIsUpdating] = useState(false)
  const intervalRef = useRef(null)

  const updatePrices = () => {
    setStocks(prevStocks => 
      prevStocks.map(stock => {
        const change = (Math.random() - 0.5) * 1.0 // Random change between -0.5 and +0.5
        const newPrice = Math.max(0.01, stock.price + change) // Ensure price doesn't go negative
        const percentageChange = ((newPrice - stock.previousPrice) / stock.previousPrice) * 100
        
        return {
          ...stock,
          price: parseFloat(newPrice.toFixed(2)),
          previousPrice: stock.price,
          percentageChange: parseFloat(percentageChange.toFixed(2))
        }
      })
    )
  }

  useEffect(() => {
    if (isUpdating) {
      intervalRef.current = setInterval(updatePrices, 2000) // Update every 2 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isUpdating])

  const toggleUpdates = () => {
    setIsUpdating(prev => !prev)
  }

  const resetPrices = () => {
    setIsUpdating(false)
    setStocks(initialStocks.map(stock => ({
      ...stock,
      previousPrice: stock.price
    })))
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Stock Price Ticker</h1>

      {/* Control Buttons */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={toggleUpdates}
          style={{
            padding: '10px 20px',
            backgroundColor: isUpdating ? '#dc3545' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {isUpdating ? 'Stop Updates' : 'Start Updates'}
        </button>
        <button
          onClick={resetPrices}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Reset Prices
        </button>
      </div>

      {/* Status */}
      <div style={{
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: isUpdating ? '#d4edda' : '#f8d7da',
        borderRadius: '6px',
        color: isUpdating ? '#155724' : '#721c24',
        fontWeight: 'bold'
      }}>
        Status: {isUpdating ? '🟢 Updating every 2 seconds' : '🔴 Updates stopped'}
      </div>

      {/* Stocks Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Symbol</th>
            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Company</th>
            <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Price</th>
            <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Change</th>
            <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>% Change</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => {
            const priceChange = stock.price - stock.previousPrice
            const isPositive = priceChange >= 0
            const percentageChange = stock.percentageChange || 0

            return (
              <tr key={stock.symbol}>
                <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold' }}>
                  {stock.symbol}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{stock.name}</td>
                <td style={{
                  padding: '12px',
                  border: '1px solid #ddd',
                  textAlign: 'right',
                  fontWeight: 'bold',
                  color: isPositive ? '#28a745' : '#dc3545'
                }}>
                  ${stock.price.toFixed(2)}
                </td>
                <td style={{
                  padding: '12px',
                  border: '1px solid #ddd',
                  textAlign: 'right',
                  color: isPositive ? '#28a745' : '#dc3545',
                  fontWeight: 'bold'
                }}>
                  {isPositive ? '+' : ''}{priceChange.toFixed(2)}
                </td>
                <td style={{
                  padding: '12px',
                  border: '1px solid #ddd',
                  textAlign: 'right',
                  color: isPositive ? '#28a745' : '#dc3545',
                  fontWeight: 'bold'
                }}>
                  {isPositive ? '+' : ''}{percentageChange.toFixed(2)}%
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e9ecef',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#666'
      }}>
        <strong>Note:</strong> Prices update every 2 seconds when updates are enabled. 
        Green indicates price increase, red indicates decrease.
      </div>
    </div>
  )
}

export default Question2
