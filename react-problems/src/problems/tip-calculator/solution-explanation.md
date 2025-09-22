# Tip Calculator Solution - Step-by-Step Explanation

## Overview

This React component implements a tip calculator that allows users to input bill amount, tip percentage, and number of people, then automatically calculates and displays the total tip and tip per person.

## Step-by-Step Breakdown

### 1. **Import and Component Setup**

```javascript
import { useState } from "react";

export default function TipCalculator() {
```

- Imports the `useState` hook from React for state management
- Defines the main functional component `TipCalculator`

### 2. **State Management**

```javascript
const [bill, setBill] = useState(50);
const [tipPercentage, setTipPercentage] = useState(18);
const [numberOfPeople, setNumberOfPeople] = useState(1);
```

**State Variables:**

- `bill`: Stores the total bill amount (default: 50)
- `tipPercentage`: Stores the tip percentage (default: 18)
- `numberOfPeople`: Stores how many people are splitting (default: 1)

**Key Points:**

- All state values start with the default values specified in the requirements
- Each state variable has its corresponding setter function
- Values are stored as the actual input values (can be strings or numbers)

### 3. **Input Fields Structure**

```javascript
<label htmlFor="bill">Bill</label>
<input
  type="number"
  id="bill"
  name="bill"
  value={bill}
  onChange={(event) => setBill(event.target.value)}
/>
```

**Pattern Used for All Inputs:**

- **Accessibility**: Uses `htmlFor` and `id` to associate labels with inputs
- **Input Type**: `type="number"` for numeric inputs
- **Controlled Components**: `value` prop connects to state
- **Event Handling**: `onChange` updates state on user input
- **Data Flow**: `event.target.value` captures the new input value

### 4. **Calculation Logic - Total Tip**

```javascript
<p>
  Total Tip:{" "}
  {bill && tipPercentage ? `$${(bill * tipPercentage * 0.01).toFixed(2)}` : "-"}
</p>
```

**Calculation Breakdown:**

1. **Validation**: `bill && tipPercentage` checks if both values exist
2. **Formula**: `bill * tipPercentage * 0.01`
   - Converts percentage to decimal (18% → 0.18)
   - Multiplies bill by decimal percentage
3. **Formatting**: `.toFixed(2)` rounds to 2 decimal places
4. **Display**: Adds "$" prefix for currency formatting
5. **Fallback**: Shows "-" if any required value is missing

**Example:**

- Bill: $50, Tip: 18% → $50 × 18 × 0.01 = $9.00

### 5. **Calculation Logic - Tip Per Person**

```javascript
<p>
  Tip Per Person:{" "}
  {bill && tipPercentage && numberOfPeople
    ? `$${((bill * tipPercentage * 0.01) / numberOfPeople).toFixed(2)}`
    : "-"}
</p>
```

**Calculation Breakdown:**

1. **Validation**: Checks all three values exist (`bill && tipPercentage && numberOfPeople`)
2. **Formula**: `(bill * tipPercentage * 0.01) / numberOfPeople`
   - First calculates total tip (same as above)
   - Divides by number of people
3. **Formatting**: Same currency formatting as total tip
4. **Fallback**: Shows "-" if any value is missing

**Example:**

- Total Tip: $9.00, People: 2 → $9.00 ÷ 2 = $4.50

## Key Features Implemented

### ✅ **Requirement Compliance**

- **Three inputs** with correct labels and default values
- **Real-time calculations** that update as user types
- **Proper formatting** with 2 decimal places and currency symbols
- **Error handling** with "-" display for missing values

### ✅ **User Experience**

- **Controlled inputs** for predictable behavior
- **Immediate feedback** - calculations update instantly
- **Clean interface** following the provided CSS structure
- **Accessible** with proper label associations

### ✅ **Mathematical Accuracy**

- **Percentage conversion** using `* 0.01` factor
- **Precision handling** with `toFixed(2)` for currency
- **Order of operations** with proper parentheses in complex calculation

### ✅ **Edge Case Handling**

- **Empty inputs** display "-" instead of errors
- **Truthy validation** prevents calculations with invalid data
- **No crash scenarios** - component handles all input states gracefully

## Technical Implementation Details

### **State Management Strategy**

- Uses React's `useState` for simple, local state
- Each input has dedicated state variable for clear separation
- State updates trigger automatic re-renders and recalculations

### **Calculation Approach**

- **Inline calculations** in JSX for immediate updates
- **Conditional rendering** using ternary operators
- **Validation-first** approach prevents errors

### **Data Flow**

1. User types in input → `onChange` event fires
2. State updates via setter function → Component re-renders
3. New calculations execute → Display updates immediately

This solution efficiently implements all requirements while maintaining clean, readable code and providing excellent user experience.
