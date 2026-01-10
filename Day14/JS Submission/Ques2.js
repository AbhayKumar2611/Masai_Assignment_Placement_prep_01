// Q2: Form Validator with Real-time Feedback

// State
let formData = {
  email: '',
  password: '',
  confirmPassword: '',
  age: ''
};

let errors = {
  email: '',
  password: '',
  confirmPassword: '',
  age: ''
};

let touched = {
  email: false,
  password: false,
  confirmPassword: false,
  age: false
};

// Validation rules
const validationRules = {
  email: (value) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Invalid email format';
    return '';
  },
  
  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Password must contain at least 1 uppercase letter';
    if (!/[0-9]/.test(value)) return 'Password must contain at least 1 number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'Password must contain at least 1 special character';
    return '';
  },
  
  confirmPassword: (value, password) => {
    if (!value) return 'Please confirm your password';
    if (value !== password) return 'Passwords do not match';
    return '';
  },
  
  age: (value) => {
    if (!value) return 'Age is required';
    const ageNum = parseInt(value, 10);
    if (isNaN(ageNum)) return 'Age must be a number';
    if (ageNum < 18) return 'Age must be at least 18';
    if (ageNum > 100) return 'Age must be at most 100';
    return '';
  }
};

// Validate field
function validateField(fieldName, value) {
  let error = '';
  
  switch (fieldName) {
    case 'email':
      error = validationRules.email(value);
      break;
    case 'password':
      error = validationRules.password(value);
      break;
    case 'confirmPassword':
      error = validationRules.confirmPassword(value, formData.password);
      break;
    case 'age':
      error = validationRules.age(value);
      break;
  }
  
  errors[fieldName] = error;
  return error;
}

// Handle input change
function handleInputChange(fieldName, value) {
  formData[fieldName] = value;
  touched[fieldName] = true;
  
  // Real-time validation
  if (fieldName === 'password') {
    // If password changes, re-validate confirm password
    validateField('confirmPassword', formData.confirmPassword);
  }
  
  validateField(fieldName, value);
  displayForm();
}

// Check if form is valid
function isFormValid() {
  return Object.values(errors).every(error => error === '') &&
         Object.values(formData).every(value => value !== '');
}

// Display form
function displayForm() {
  console.log('\n=== Form Validator ===\n');
  
  // Email field
  const emailBorder = errors.email && touched.email ? '❌ RED' : (!errors.email && touched.email && formData.email ? '✅ GREEN' : '⚪ DEFAULT');
  console.log(`Email: "${formData.email}" ${emailBorder}`);
  if (errors.email && touched.email) {
    console.log(`  Error: ${errors.email}`);
  } else if (!errors.email && touched.email && formData.email) {
    console.log(`  ✓ Valid`);
  }
  
  // Password field
  const passwordBorder = errors.password && touched.password ? '❌ RED' : (!errors.password && touched.password && formData.password ? '✅ GREEN' : '⚪ DEFAULT');
  console.log(`\nPassword: "${'*'.repeat(formData.password.length)}" ${passwordBorder}`);
  if (errors.password && touched.password) {
    console.log(`  Error: ${errors.password}`);
  } else if (!errors.password && touched.password && formData.password) {
    console.log(`  ✓ Valid`);
  }
  
  // Confirm Password field
  const confirmPasswordBorder = errors.confirmPassword && touched.confirmPassword ? '❌ RED' : (!errors.confirmPassword && touched.confirmPassword && formData.confirmPassword ? '✅ GREEN' : '⚪ DEFAULT');
  console.log(`\nConfirm Password: "${'*'.repeat(formData.confirmPassword.length)}" ${confirmPasswordBorder}`);
  if (errors.confirmPassword && touched.confirmPassword) {
    console.log(`  Error: ${errors.confirmPassword}`);
  } else if (!errors.confirmPassword && touched.confirmPassword && formData.confirmPassword) {
    console.log(`  ✓ Valid`);
  }
  
  // Age field
  const ageBorder = errors.age && touched.age ? '❌ RED' : (!errors.age && touched.age && formData.age ? '✅ GREEN' : '⚪ DEFAULT');
  console.log(`\nAge: "${formData.age}" ${ageBorder}`);
  if (errors.age && touched.age) {
    console.log(`  Error: ${errors.age}`);
  } else if (!errors.age && touched.age && formData.age) {
    console.log(`  ✓ Valid`);
  }
  
  // Submit button state
  const submitEnabled = isFormValid();
  console.log(`\n[Submit Button] ${submitEnabled ? '✅ ENABLED' : '❌ DISABLED'}`);
  
  if (!submitEnabled) {
    console.log('  (All fields must be valid to enable submit)');
  }
}

// Handle form submit
function handleSubmit() {
  if (!isFormValid()) {
    console.log('\n❌ Form is invalid. Please fix errors before submitting.');
    return;
  }
  
  console.log('\n✅ Form submitted successfully!');
  console.log('Form Data:', formData);
}

// Demo usage
console.log('=== Form Validator Demo ===');
displayForm();

console.log('\n--- Entering invalid email ---');
handleInputChange('email', 'invalid-email');

console.log('\n--- Entering valid email ---');
handleInputChange('email', 'user@example.com');

console.log('\n--- Entering weak password ---');
handleInputChange('password', 'weak');

console.log('\n--- Entering strong password ---');
handleInputChange('password', 'StrongPass123!');

console.log('\n--- Entering non-matching confirm password ---');
handleInputChange('confirmPassword', 'DifferentPass123!');

console.log('\n--- Entering matching confirm password ---');
handleInputChange('confirmPassword', 'StrongPass123!');

console.log('\n--- Entering invalid age (too young) ---');
handleInputChange('age', '15');

console.log('\n--- Entering invalid age (too old) ---');
handleInputChange('age', '101');

console.log('\n--- Entering valid age ---');
handleInputChange('age', '25');

console.log('\n--- Attempting to submit ---');
handleSubmit();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formData,
    errors,
    touched,
    handleInputChange,
    validateField,
    isFormValid,
    handleSubmit,
    displayForm,
    validationRules
  };
}

