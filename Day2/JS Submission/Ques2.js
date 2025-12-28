const orders = [
  {
    orderId: 'A1',
    customer: { name: 'John', location: { city: 'NYC', country: 'USA' } },
    items: [
      { product: 'Laptop', quantity: 1, price: 999 },
      { product: 'Mouse', quantity: 2, price: 25 }
    ]
  },
  {
    orderId: 'A2',
    customer: { name: 'Jane', location: { city: 'LA', country: 'USA' } },
    items: [
      { product: 'Keyboard', quantity: 1, price: 75 }
    ]
  }
];

// Solution: Extract and flatten nested properties
const extractOrderDetails = (orders) => {
  return orders.map(order => {
    // Calculate total amount by summing (quantity * price) for all items
    const totalAmount = order.items.reduce((sum, item) => {
      return sum + (item.quantity * item.price);
    }, 0);
    
    // Return flattened structure with extracted properties
    return {
      orderId: order.orderId,
      customerName: order.customer.name,
      city: order.customer.location.city,
      totalAmount: totalAmount
    };
  });
};

// Execute the transformation
const result = extractOrderDetails(orders);

console.log(result);

// Output:
// [
//   { orderId: 'A1', customerName: 'John', city: 'NYC', totalAmount: 1049 },
//   { orderId: 'A2', customerName: 'Jane', city: 'LA', totalAmount: 75 }
// ]