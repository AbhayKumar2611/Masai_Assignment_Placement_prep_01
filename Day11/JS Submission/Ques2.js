// Q2: Accordion Component

const sections = [
  { title: 'Section 1', content: 'Content for section 1. This is some detailed information.' },
  { title: 'Section 2', content: 'Content for section 2. This is some detailed information.' },
  { title: 'Section 3', content: 'Content for section 3. This is some detailed information.' }
];

// State
let openSectionIndex = null; // Only one section can be open at a time

// Toggle section (expand/collapse)
function toggleSection(index) {
  if (openSectionIndex === index) {
    // If clicking the same section, close it
    openSectionIndex = null;
  } else {
    // Open the clicked section (automatically closes previous one)
    openSectionIndex = index;
  }
  
  displayAccordion();
}

// Display accordion
function displayAccordion() {
  console.log('\n=== Accordion Component ===');
  
  sections.forEach((section, index) => {
    const isOpen = openSectionIndex === index;
    const indicator = isOpen ? '▼' : '▶';
    
    console.log(`\n${indicator} ${section.title}`);
    
    if (isOpen) {
      console.log(`   ${section.content}`);
      console.log('   [Expanded]');
    } else {
      console.log('   [Collapsed]');
    }
  });
  
  if (openSectionIndex === null) {
    console.log('\nNo sections are currently open');
  } else {
    console.log(`\nOpen section: Section ${openSectionIndex + 1}`);
  }
}

// Smooth transition simulation (in real DOM, this would use CSS transitions)
function expandWithTransition(index) {
  console.log(`\n[Transition] Expanding Section ${index + 1}...`);
  toggleSection(index);
}

// Demo usage
console.log('=== Accordion Component Demo ===');
displayAccordion();

console.log('\n--- Clicking Section 1 ---');
toggleSection(0);

console.log('\n--- Clicking Section 2 (closes Section 1) ---');
toggleSection(1);

console.log('\n--- Clicking Section 3 (closes Section 2) ---');
toggleSection(2);

console.log('\n--- Clicking Section 3 again (closes it) ---');
toggleSection(2);

console.log('\n--- Opening Section 1 ---');
toggleSection(0);

// Export for use in HTML/React
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    sections,
    openSectionIndex,
    toggleSection,
    displayAccordion,
    expandWithTransition
  };
}

