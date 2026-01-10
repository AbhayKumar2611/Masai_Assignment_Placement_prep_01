// Q1: Pivot Table Transformation

const sales = [
  { month: 'Jan', product: 'A', amount: 100 },
  { month: 'Jan', product: 'B', amount: 150 },
  { month: 'Feb', product: 'A', amount: 120 },
  { month: 'Feb', product: 'B', amount: 180 },
  { month: 'Mar', product: 'A', amount: 110 },
  { month: 'Mar', product: 'B', amount: 160 }
];

// Transform sales data into a pivot table format
function transformToPivotTable(salesData) {
  const pivotTable = {};

  // Iterate through each sale record
  salesData.forEach(sale => {
    const { product, month, amount } = sale;

    // Initialize product if it doesn't exist
    if (!pivotTable[product]) {
      pivotTable[product] = {};
    }

    // Add the amount for the specific month
    pivotTable[product][month] = amount;
  });

  // Calculate totals for each product
  Object.keys(pivotTable).forEach(product => {
    let total = 0;
    Object.keys(pivotTable[product]).forEach(month => {
      total += pivotTable[product][month];
    });
    pivotTable[product].total = total;
  });

  return pivotTable;
}

// Test the function
const result = transformToPivotTable(sales);
console.log(result);

// Expected Output:
// {
//   A: { Jan: 100, Feb: 120, Mar: 110, total: 330 },
//   B: { Jan: 150, Feb: 180, Mar: 160, total: 490 }
// }
