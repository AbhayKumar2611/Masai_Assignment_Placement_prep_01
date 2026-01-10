// Q2: Drag and Drop Reordering

const tasks = [
  { id: 1, text: 'Complete project proposal' },
  { id: 2, text: 'Review code submissions' },
  { id: 3, text: 'Update documentation' },
  { id: 4, text: 'Team meeting' }
];

// State
let taskList = [...tasks];
let draggedItem = null;
let draggedIndex = null;

// Display tasks
function displayTasks() {
  console.log('\n=== Drag and Drop Task List ===');
  console.log('(Drag items to reorder)');
  console.log('\nTasks:');
  
  taskList.forEach((task, index) => {
    const dragIndicator = draggedIndex === index ? '[DRAGGING]' : '[≡]';
    console.log(`${dragIndicator} ${index + 1}. ${task.text}`);
  });
}

// Handle drag start
function handleDragStart(index) {
  draggedIndex = index;
  draggedItem = taskList[index];
  console.log(`\n[Drag Start] Started dragging: "${draggedItem.text}"`);
  displayTasks();
}

// Handle drag over (prevents default to allow drop)
function handleDragOver(event, targetIndex) {
  // In real implementation, preventDefault() would be called here
  if (draggedIndex === null || draggedIndex === targetIndex) {
    return;
  }
  
  // Visual feedback: show drop zone
  console.log(`[Drag Over] Hovering over position ${targetIndex + 1}`);
}

// Handle drop
function handleDrop(targetIndex) {
  if (draggedIndex === null || draggedIndex === targetIndex) {
    return;
  }
  
  console.log(`\n[Drop] Moving item from position ${draggedIndex + 1} to position ${targetIndex + 1}`);
  
  // Reorder items
  const newList = [...taskList];
  const [removed] = newList.splice(draggedIndex, 1);
  newList.splice(targetIndex, 0, removed);
  
  taskList = newList;
  draggedIndex = null;
  draggedItem = null;
  
  displayTasks();
  console.log('\n[Order updated successfully]');
}

// Handle drag end (cleanup)
function handleDragEnd() {
  if (draggedIndex !== null) {
    console.log('\n[Drag End] Drag cancelled or completed');
    draggedIndex = null;
    draggedItem = null;
    displayTasks();
  }
}

// Simulate drag and drop operation
function simulateDragAndDrop(fromIndex, toIndex) {
  handleDragStart(fromIndex);
  handleDragOver(null, toIndex);
  handleDrop(toIndex);
}

// Demo usage
console.log('=== Drag and Drop Reordering Demo ===');
displayTasks();

console.log('\n--- Dragging item 1 to position 3 ---');
simulateDragAndDrop(0, 2);

console.log('\n--- Dragging item 2 to position 4 ---');
simulateDragAndDrop(1, 3);

console.log('\n--- Dragging item 4 to position 1 ---');
simulateDragAndDrop(3, 0);

// Export for use in HTML/React
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    tasks,
    taskList,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    displayTasks,
    simulateDragAndDrop
  };
}

