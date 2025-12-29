import React, { useState } from 'react'

const Ques2 = () => {
  // Only quantity is stored in state - everything else is derived
  const [quantity, setQuantity] = useState(1)
  
  // Constants
  const UNIT_PRICE = 29.99
  const DISCOUNT_THRESHOLD = 5
  const DISCOUNT_PERCENTAGE = 10
  
  // Derived values - computed on every render (not stored in state)
  const subtotal = quantity * UNIT_PRICE
  const qualifiesForDiscount = quantity >= DISCOUNT_THRESHOLD
  const discountAmount = qualifiesForDiscount ? subtotal * (DISCOUNT_PERCENTAGE / 100) : 0
  const finalTotal = subtotal - discountAmount
  
  // Handlers
  const handleIncrement = () => {
    setQuantity(prev => prev + 1)
  }
  
  const handleDecrement = () => {
    setQuantity(prev => Math.max(1, prev - 1)) // Minimum quantity is 1
  }
  
  const handleReset = () => {
    setQuantity(1)
  }

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#333',
        marginBottom: '30px',
        fontSize: '28px'
      }}>Shopping Cart</h2>
      
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #dee2e6',
        borderRadius: '12px',
        padding: '25px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        {/* Product Info */}
        <div style={{
          marginBottom: '25px',
          paddingBottom: '20px',
          borderBottom: '2px solid #e9ecef'
        }}>
          <h3 style={{
            fontSize: '20px',
            color: '#333',
            marginBottom: '10px'
          }}>Premium Product</h3>
          <p style={{
            fontSize: '16px',
            color: '#666',
            margin: 0
          }}>High-quality item with excellent features</p>
        </div>

        {/* Quantity Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '25px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <label style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#495057'
          }}>Quantity:</label>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              style={{
                width: '40px',
                height: '40px',
                fontSize: '20px',
                fontWeight: 'bold',
                border: '2px solid #007bff',
                backgroundColor: quantity <= 1 ? '#e9ecef' : '#007bff',
                color: quantity <= 1 ? '#6c757d' : 'white',
                borderRadius: '8px',
                cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseOver={(e) => {
                if (quantity > 1) {
                  e.target.style.backgroundColor = '#0056b3'
                  e.target.style.transform = 'scale(1.1)'
                }
              }}
              onMouseOut={(e) => {
                if (quantity > 1) {
                  e.target.style.backgroundColor = '#007bff'
                  e.target.style.transform = 'scale(1)'
                }
              }}
            >
              −
            </button>
            
            <div style={{
              minWidth: '60px',
              textAlign: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#333',
              padding: '8px 15px',
              backgroundColor: 'white',
              border: '2px solid #dee2e6',
              borderRadius: '8px'
            }}>
              {quantity}
            </div>
            
            <button
              onClick={handleIncrement}
              style={{
                width: '40px',
                height: '40px',
                fontSize: '20px',
                fontWeight: 'bold',
                border: '2px solid #007bff',
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#0056b3'
                e.target.style.transform = 'scale(1.1)'
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#007bff'
                e.target.style.transform = 'scale(1)'
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Discount Banner - Derived from quantity */}
        {qualifiesForDiscount && (
          <div style={{
            backgroundColor: '#d4edda',
            border: '2px solid #28a745',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px',
            textAlign: 'center',
            animation: 'slideDown 0.3s ease-out'
          }}>
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#155724',
              marginBottom: '5px'
            }}>
              🎉 Bulk Discount Applied!
            </div>
            <div style={{
              fontSize: '14px',
              color: '#155724'
            }}>
              You saved {DISCOUNT_PERCENTAGE}% on {quantity} items!
            </div>
            <style>{`
              @keyframes slideDown {
                from {
                  opacity: 0;
                  transform: translateY(-10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
          </div>
        )}

        {/* Price Breakdown */}
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
            fontSize: '16px',
            color: '#495057'
          }}>
            <span>Unit Price:</span>
            <span>${UNIT_PRICE.toFixed(2)}</span>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
            fontSize: '16px',
            color: '#495057'
          }}>
            <span>Subtotal ({quantity} {quantity === 1 ? 'item' : 'items'}):</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          {qualifiesForDiscount && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10px',
              fontSize: '16px',
              color: '#28a745',
              fontWeight: 'bold'
            }}>
              <span>Discount ({DISCOUNT_PERCENTAGE}%):</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          
          <div style={{
            borderTop: '2px solid #dee2e6',
            paddingTop: '15px',
            marginTop: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            <span>Total:</span>
            <span style={{
              color: '#007bff',
              fontSize: '28px'
            }}>${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
        >
          Reset to 1
        </button>
      </div>

      {/* Info Note */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e7f3ff',
        border: '1px solid #b3d9ff',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#004085',
        textAlign: 'center'
      }}>
        💡 <strong>Tip:</strong> Order {DISCOUNT_THRESHOLD} or more items to get {DISCOUNT_PERCENTAGE}% off!
      </div>
    </div>
  )
}

export default Ques2