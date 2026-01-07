const transactions = [
  { id: 1, category: 'Food', amount: 45.50, date: '2024-01-15' },
  { id: 2, category: 'Transport', amount: 20.00, date: '2024-01-16' },
  { id: 3, category: 'Food', amount: 30.75, date: '2024-01-17' },
  { id: 4, category: 'Entertainment', amount: 50.00, date: '2024-01-18' },
  { id: 5, category: 'Food', amount: 25.25, date: '2024-01-19' },
  { id: 6, category: 'Transport', amount: 15.50, date: '2024-01-20' }
];

/* Expected Output:
{
  Food: {
    total: 101.50,
    average: 33.83,
    count: 3,
    highest: 45.50,
    lowest: 25.25
  },
  Transport: {
    total: 35.50,
    average: 17.75,
    count: 2,
    highest: 20.00,
    lowest: 15.50
  },
  Entertainment: {
    total: 50.00,
    average: 50.00,
    count: 1,
    highest: 50.00,
    lowest: 50.00
  }
}
*/

function aggregateData(transactions){
    const res = {};

    for (let txn of transactions){
        const {category, amount} = txn

        // If category not present, initialize it...
        if(!res[category]){
            res[category] = {
                total: 0,
                count: 0,
                highest: amount,
                lowest: amount
            }
        }

        // update values
        res[category].total += amount;
        res[category].count += 1;
        res[category].highest = Math.max(res[category].highest, amount);
        res[category].lowest = Math.min(res[category].lowest, amount);
    }

    // calculate average
    for (let category in res){
        res[category].average = Number(
            (res[category].total / res[category].count).toFixed(2)
        )
    }

    return res
}

const result = aggregateData(transactions)
console.log(result)