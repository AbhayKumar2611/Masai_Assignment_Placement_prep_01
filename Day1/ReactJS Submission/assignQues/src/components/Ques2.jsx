import React, { useState } from 'react'

const Ques2 = () => {
  const [quantity, setQuantity] = useState(0)
  const unitPrice = 29.99

  const increment = () => {
    setQuantity(prev => prev + 1)
  }

  const decrement = () => {
    setQuantity(prev => Math.max(0, prev - 1))
  }

  // Derived state - computed on render
  const discount = quantity >= 5 ? 0.1 : 0
  const subtotal = quantity * unitPrice
  const discountAmount = subtotal * discount
  const total = subtotal - discountAmount

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Shopping Cart Counter</h1>
      
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0 }}>Product Card</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '18px', margin: '10px 0' }}>
            <strong>Unit Price:</strong> ${unitPrice.toFixed(2)}
          </p>
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <label style={{ fontSize: '16px', fontWeight: 'bold' }}>Quantity:</label>
          <button
            onClick={decrement}
            disabled={quantity === 0}
            style={{
              padding: '8px 15px',
              backgroundColor: quantity === 0 ? '#ccc' : '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: quantity === 0 ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            -
          </button>
          <span style={{ 
            fontSize: '20px', 
            fontWeight: 'bold',
            minWidth: '40px',
            textAlign: 'center'
          }}>
            {quantity}
          </span>
          <button
            onClick={increment}
            style={{
              padding: '8px 15px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            +
          </button>
        </div>

        {discount > 0 && (
          <div style={{
            padding: '12px',
            backgroundColor: '#4CAF50',
            color: 'white',
            borderRadius: '4px',
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            🎉 Bulk Discount Applied! 10% OFF
          </div>
        )}

        <div style={{
          borderTop: '2px solid #eee',
          paddingTop: '15px',
          marginTop: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '10px',
              color: '#4CAF50',
              fontWeight: 'bold'
            }}>
              <span>Discount (10%):</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '20px',
            fontWeight: 'bold',
            paddingTop: '10px',
            borderTop: '2px solid #333'
          }}>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ques2