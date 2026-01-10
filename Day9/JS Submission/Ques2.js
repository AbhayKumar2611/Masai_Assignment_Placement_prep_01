// Q2: Hierarchical Data Aggregation

const transactions = [
  {
    date: '2024-01-15',
    category: 'Food',
    items: [
      { name: 'Groceries', amount: 50 },
      { name: 'Restaurant', amount: 75 }
    ]
  },
  {
    date: '2024-01-16',
    category: 'Transport',
    items: [
      { name: 'Gas', amount: 40 },
      { name: 'Parking', amount: 10 }
    ]
  },
  {
    date: '2024-01-17',
    category: 'Food',
    items: [
      { name: 'Coffee', amount: 5 }
    ]
  }
];

// Aggregate nested transaction data with running totals
function aggregateTransactions(transactions) {
  const aggregated = {};

  // Iterate through each transaction
  transactions.forEach(transaction => {
    const { category, items } = transaction;

    // Initialize category if it doesn't exist
    if (!aggregated[category]) {
      aggregated[category] = {
        total: 0,
        count: 0
      };
    }

    // Sum up all item amounts in this transaction
    const transactionTotal = items.reduce((sum, item) => sum + item.amount, 0);
    
    // Update the category totals
    aggregated[category].total += transactionTotal;
    aggregated[category].count += items.length; // Count number of items
  });

  return aggregated;
}

// Test the function
const result = aggregateTransactions(transactions);
console.log(result);

// Expected Output:
// {
//   Food: { total: 130, count: 3 },
//   Transport: { total: 50, count: 2 }
// }
