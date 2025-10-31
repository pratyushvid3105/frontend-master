# Crypto Prices Solution - Step-by-Step Explanation

## Overview

This solution implements a React component that fetches and displays paginated cryptocurrency data. The key challenges include **fetching data on mount and page change**, **managing pagination state**, **conditional button disabling**, and **rendering dynamic table rows**. The algorithm uses useEffect for side effects and useState for state management.

## Implementation Strategy

### **Core Approach: useEffect + Pagination State**

The solution uses:

1. **useState hooks** → Track current page, coins data, and hasNext flag
2. **useEffect** → Fetch data when component mounts or page changes
3. **Dependency array** → Re-fetch when currentPage changes
4. **Conditional rendering** → Display coins from API response
5. **Button state management** → Disable buttons based on page position

This approach ensures data is fetched at the right time and UI stays synchronized with state.

---

## Step-by-Step Breakdown

### **1. Imports and Constants**

```javascript
// Import React hooks for state and side effects
// useEffect: Run side effects (like API calls)
// useState: Manage component state
import { useEffect, useState } from "react";

// Define API base URL as constant
// Makes URL easy to update and prevents typos
const CRYPTO_PRICES_API_BASE_URL = "/api/fe/cryptocurrencies";
```

**Purpose:** Import necessary React hooks and define API endpoint.

**Why const for URL:**

- Single source of truth
- Easy to update if API changes
- No risk of typos when used multiple times

---

### **2. Component and State Initialization**

```javascript
/**
 * CryptoPrices Component
 *
 * Displays paginated cryptocurrency prices in a table
 * Features:
 * - Fetches data from API on mount and page change
 * - Displays coins in table format
 * - Back/Next navigation buttons
 * - Disables buttons appropriately (first/last page)
 *
 * @returns {JSX.Element} Table with crypto data and navigation buttons
 */
export default function CryptoPrices() {
  // State: Track current page number (starts at 0)
  // Used in API request and button disable logic
  const [currentPage, setCurrentPage] = useState(0);

  // State: Store array of coin objects from API
  // Each coin has: { name, price, marketCap }
  // Initially empty array (no data yet)
  const [coins, setCoins] = useState([]);

  // State: Track if there's a next page available
  // Comes from API's hasNext value
  // Used to disable Next button on last page
  const [isNextPage, setIsNextPage] = useState(false);
```

**Purpose:** Initialize component state for pagination and data.

**State Variables:**

```javascript
// currentPage: 0, 1, 2, 3, ...
// Determines which page of data to fetch

// coins: [{name, price, marketCap}, ...]
// Stores current page's cryptocurrency data

// isNextPage: true/false
// Indicates if more pages exist after current
```

**Initial State Values:**

```
currentPage = 0    (first page)
coins = []         (no data yet)
isNextPage = false (assume no next page until API responds)
```

---

### **3. useEffect Hook for Data Fetching**

```javascript
  // Effect: Fetch cryptocurrency data
  // Runs on component mount and whenever currentPage changes
  // Dependency array [currentPage] triggers re-run on page change
  useEffect(() => {
```

**Purpose:** Set up side effect to fetch data when needed.

**When useEffect Runs:**

```javascript
// Runs on mount:
useEffect(() => { ... }, [currentPage])
// Component mounts → currentPage = 0 → Effect runs

// Runs on currentPage change:
// User clicks Next → currentPage = 1 → Effect runs
// User clicks Next → currentPage = 2 → Effect runs
// User clicks Back → currentPage = 1 → Effect runs

// Does NOT run when coins or isNextPage change
// (not in dependency array)
```

---

### **4. Fetch Function Definition**

```javascript
// Define async function to fetch coins from API
// Nested inside useEffect so it can be called immediately
const fetchCoins = async () => {
  try {
    // Step 1: Build URL with current page parameter
    // Template literal: /api/fe/cryptocurrencies?page=0
    const response = await fetch(
      `${CRYPTO_PRICES_API_BASE_URL}?page=${currentPage}`
    );

    // Step 2: Parse JSON response
    // await because response.json() returns Promise
    const data = await response.json();
    // data = { hasNext: true, coins: [...] }

    // Step 3: Update state with fetched data
    // Extract coins array from response
    setCoins(data.coins);

    // Extract hasNext boolean from response
    setIsNextPage(data.hasNext);
  } catch (error) {
    // Step 4: Handle errors gracefully
    // Log error but don't crash component
    // Could also set error state here
    console.log(error);
  }
};
```

**Purpose:** Define and execute API fetch logic.

**Async/Await Flow:**

```javascript
// 1. Construct URL
`/api/fe/cryptocurrencies?page=${currentPage}`;
// currentPage = 0 → "/api/fe/cryptocurrencies?page=0"
// currentPage = 3 → "/api/fe/cryptocurrencies?page=3"

// 2. Fetch (async operation)
const response = await fetch(url);
// Waits for HTTP response

// 3. Parse JSON (async operation)
const data = await response.json();
// Waits for JSON parsing
// data = {
//   hasNext: true,
//   coins: [
//     { name: "Bitcoin", price: "$29,970.48", marketCap: "$571,108,740,782" },
//     { name: "Ethereum", price: "$2,064.89", marketCap: "$249,824,561,307" },
//     ...
//   ]
// }

// 4. Update state
setCoins(data.coins); // Triggers re-render with new data
setIsNextPage(data.hasNext); // Updates next button state
```

**Try-Catch Pattern:**

```javascript
try {
  // Attempt API call
  const response = await fetch(url);
  const data = await response.json();
  setCoins(data.coins);
  setIsNextPage(data.hasNext);
} catch (error) {
  // Handle network errors, parsing errors, etc.
  console.log(error);
  // Could also: setError(error), setCoins([]), etc.
}
```

---

### **5. Execute Fetch Function**

```javascript
    // Call the fetch function immediately
    // This executes on component mount and when currentPage changes
    fetchCoins();
  }, [currentPage]);  // Dependency array: re-run when currentPage changes
```

**Purpose:** Execute fetch immediately and on page changes.

**Dependency Array Explained:**

```javascript
useEffect(() => {
  fetchCoins();
}, [currentPage]);

// Effect runs when:
// ✓ Component mounts (initial render)
// ✓ currentPage value changes
// ✗ coins changes (not in array)
// ✗ isNextPage changes (not in array)
// ✗ Any other state/props change

// Example timeline:
// Mount: currentPage=0 → fetchCoins() → fetch page 0
// Click Next: currentPage=1 → fetchCoins() → fetch page 1
// Click Next: currentPage=2 → fetchCoins() → fetch page 2
// Click Back: currentPage=1 → fetchCoins() → fetch page 1
```

**Why Include currentPage in Dependencies:**

```javascript
// Without currentPage in dependencies:
useEffect(() => {
  fetch(`...?page=${currentPage}`);
}, []); // ❌ Only runs on mount, stale currentPage

// With currentPage in dependencies:
useEffect(() => {
  fetch(`...?page=${currentPage}`);
}, [currentPage]); // ✓ Runs whenever page changes
```

---

### **6. JSX Return - Table Structure**

```javascript
  // Render table and navigation buttons
  return (
    <>
      {/* Fragment allows returning multiple elements */}

      <table>
        {/* Table caption (title above table) */}
        <caption>Crypto Prices</caption>

        {/* Table header with column names */}
        <thead>
          <tr>
            {/* scope="col" indicates this is a column header */}
            <th scope="col">Coin</th>
            <th scope="col">Price</th>
            <th scope="col">Market Cap</th>
          </tr>
        </thead>
```

**Purpose:** Define table structure with semantic HTML.

**Semantic Table Elements:**

```html
<table>
  Element for tabular data
  <caption>
    Table title/description
    <thead>
      Table header section
      <tr>
        Table row
        <th>
          Table header cell
          <tbody>
            Table body section
            <tr>
              Table row
              <th>Header cell (row header)</th>
              <td>Data cell</td>
            </tr>
          </tbody>
        </th>
      </tr>
    </thead>
  </caption>
</table>
```

**`scope` Attribute:**

```html
<th scope="col">Coin</th>
<!-- This header applies to entire column -->

<th scope="row">Bitcoin</th>
<!-- This header applies to entire row -->

<!-- Accessibility: Screen readers use scope to understand table structure -->
```

---

### **7. Table Body with Dynamic Rows**

```javascript
        {/* Table body with coin data */}
        <tbody>
          {/* Map over coins array to create rows */}
          {/* Each coin becomes one table row */}
          {coins.map((coin) => {
            return (
              <tr key={coin.name}>
                {/* Row header: coin name */}
                {/* scope="row" indicates this cell is a row header */}
                <th scope="row">{coin.name}</th>

                {/* Data cells: price and market cap */}
                <td>{coin.price}</td>
                <td>{coin.marketCap}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
```

**Purpose:** Dynamically generate table rows from API data.

**Array Map Pattern:**

```javascript
coins.map((coin) => {
  return <tr key={coin.name}>...</tr>
})

// coins array:
[
  { name: "Bitcoin", price: "$29,970.48", marketCap: "$571,108,740,782" },
  { name: "Ethereum", price: "$2,064.89", marketCap: "$249,824,561,307" },
  { name: "Monero", price: "$148.45", marketCap: "$2,690,082,919" }
]

// Generates:
<tr key="Bitcoin">
  <th scope="row">Bitcoin</th>
  <td>$29,970.48</td>
  <td>$571,108,740,782</td>
</tr>
<tr key="Ethereum">
  <th scope="row">Ethereum</th>
  <td>$2,064.89</td>
  <td>$249,824,561,307</td>
</tr>
<tr key="Monero">
  <th scope="row">Monero</th>
  <td>$148.45</td>
  <td>$2,690,082,919</td>
</tr>
```

**Key Prop:**

```javascript
<tr key={coin.name}>

// React uses key to:
// - Identify which items changed
// - Optimize re-renders
// - Maintain component state correctly

// Must be unique among siblings
// coin.name works if names are unique
// Could also use: coin.id, index (less ideal)
```

---

### **8. Back Button**

```javascript
{
  /* Back button: Navigate to previous page */
}
<button
  // Disable on first page (page 0)
  // currentPage === 0 means we're on first page
  disabled={currentPage === 0}
  // Click handler: Decrement page number
  onClick={() => {
    // Guard clause: only decrement if not on first page
    // Redundant with disabled, but defensive programming
    if (currentPage > 0) {
      // setCurrentPage with updater function
      // prev is previous value of currentPage
      // Returns prev - 1 (go back one page)
      setCurrentPage((prev) => prev - 1);
    }
  }}
>
  Back
</button>;
```

**Purpose:** Navigate to previous page with proper validation.

**Disabled Logic:**

```javascript
disabled={currentPage === 0}

// Examples:
currentPage = 0 → disabled=true  (can't go back from first page)
currentPage = 1 → disabled=false (can go back to page 0)
currentPage = 5 → disabled=false (can go back to page 4)
```

**updater Function Pattern:**

```javascript
// Method 1: Direct value
setCurrentPage(currentPage - 1); // Uses currentPage from closure

// Method 2: Updater function (preferred)
setCurrentPage((prev) => prev - 1); // Uses latest value

// Why updater is better:
// - Always uses most recent state value
// - Safer for multiple rapid updates
// - Prevents stale closure issues
```

**onClick Flow:**

```javascript
// User on page 2, clicks Back:
currentPage = 2
onClick fires
  currentPage > 0 → true
  setCurrentPage(prev => prev - 1)
    prev = 2
    returns 2 - 1 = 1
  currentPage becomes 1
useEffect sees currentPage change
  Fetches page 1 data
Component re-renders with new data
```

---

### **9. Next Button**

```javascript
      {/* Next button: Navigate to next page */}
      <button
        // Disable when no next page available
        // !isNextPage means there are no more pages
        disabled={!isNextPage}

        // Click handler: Increment page number
        onClick={() => {
          // Guard clause: only increment if next page exists
          // Redundant with disabled, but defensive
          if (isNextPage) {
            // Increment page number using updater function
            setCurrentPage((prev) => prev + 1);
          }
        }}
      >
        Next
      </button>
    </>
  );
}
```

**Purpose:** Navigate to next page if more data exists.

**Disabled Logic:**

```javascript
disabled={!isNextPage}

// Examples:
isNextPage = true  → disabled=false (next page available)
isNextPage = false → disabled=true  (on last page)

// API Response controls this:
// { hasNext: true, coins: [...] }  → Next button enabled
// { hasNext: false, coins: [...] } → Next button disabled
```

**onClick Flow:**

```javascript
// User on page 1, clicks Next, hasNext=true:
currentPage = 1
isNextPage = true
onClick fires
  isNextPage → true
  setCurrentPage(prev => prev + 1)
    prev = 1
    returns 1 + 1 = 2
  currentPage becomes 2
useEffect sees currentPage change
  Fetches page 2 data
  Gets { hasNext: true, coins: [...] }
  Updates isNextPage = true
Component re-renders with page 2 data
```

---

## Key Concepts Explained

### **1. useEffect Hook**

Understanding side effects in React:

```javascript
useEffect(() => {
  // Side effect code here
  // Runs after render
}, [dependencies]);

// Timing:
// 1. Component renders (JSX returned)
// 2. Browser paints screen
// 3. useEffect callback runs

// Use cases:
// ✓ API calls
// ✓ Subscriptions
// ✓ DOM manipulation
// ✓ Timers
// ✗ State updates during render (use useState directly)
```

**Dependency Array:**

```javascript
// No array: Runs after every render
useEffect(() => {
  console.log("Every render");
});

// Empty array: Runs once on mount
useEffect(() => {
  console.log("Mount only");
}, []);

// With dependencies: Runs when dependencies change
useEffect(() => {
  console.log("Page changed");
}, [currentPage]);
```

---

### **2. Async/Await in useEffect**

Cannot make useEffect callback itself async:

```javascript
// ❌ WRONG: Can't make useEffect callback async
useEffect(async () => {
  const data = await fetch(url);
}, []);

// ✓ CORRECT: Define async function inside
useEffect(() => {
  const fetchData = async () => {
    const data = await fetch(url);
  };
  fetchData();
}, []);

// Or use .then():
useEffect(() => {
  fetch(url)
    .then((r) => r.json())
    .then((data) => setData(data));
}, []);
```

---

### **3. State Updater Functions**

Two ways to update state:

```javascript
// Method 1: Direct value
setCurrentPage(currentPage + 1)
// Uses currentPage from current closure
// Problem: May be stale in rapid updates

// Method 2: Updater function (preferred)
setCurrentPage(prev => prev + 1)
// prev is guaranteed to be latest value
// Safer for multiple updates

// Example issue with direct value:
onClick={() => {
  setCount(count + 1);  // count = 0, sets to 1
  setCount(count + 1);  // count still 0 (stale), sets to 1
}}
// Final count: 1 (not 2!)

// With updater:
onClick(() => {
  setCount(prev => prev + 1);  // prev = 0, returns 1
  setCount(prev => prev + 1);  // prev = 1, returns 2
}}
// Final count: 2 ✓
```

---

### **4. Conditional Rendering**

Empty array creates no rows:

```javascript
// coins = []
coins.map(coin => <tr>...</tr>)
// Returns: [] (no rows rendered)

// Result in HTML:
<tbody>
  {/* No rows */}
</tbody>

// coins = [{ name: "Bitcoin", ...}, ...]
coins.map(coin => <tr>...</tr>)
// Returns: [<tr>...</tr>, <tr>...</tr>, ...]

// Result in HTML:
<tbody>
  <tr>...</tr>
  <tr>...</tr>
</tbody>
```

---

### **5. Button Disabled States**

Conditional disabling based on state:

```javascript
// Back button:
disabled={currentPage === 0}
// Disabled on page 0 (first page)
// Enabled on pages 1, 2, 3, ...

// Next button:
disabled={!isNextPage}
// Disabled when isNextPage is false
// Enabled when isNextPage is true

// Visual effect (from CSS):
button:disabled {
  background-color: grey;  // Grey when disabled
  cursor: default;          // Normal cursor
}
```

---

## Complete Application Flow

### **Initial Mount Sequence**

```
1. Component renders with initial state
   currentPage = 0
   coins = []
   isNextPage = false

2. JSX returned:
   <table> with no rows (coins is empty)
   Back button: disabled (currentPage === 0)
   Next button: disabled (isNextPage === false)

3. Browser paints screen
   User sees empty table with disabled buttons

4. useEffect runs (after paint)
   fetchCoins() called

5. API request sent
   GET /api/fe/cryptocurrencies?page=0

6. API responds
   {
     hasNext: true,
     coins: [
       { name: "Bitcoin", price: "$29,970.48", marketCap: "$571,108,740,782" },
       { name: "Ethereum", price: "$2,064.89", marketCap: "$249,824,561,307" },
       ...
     ]
   }

7. State updated
   setCoins([...])  → triggers re-render
   setIsNextPage(true) → triggers re-render

8. Component re-renders
   coins.map() now creates table rows
   Back button: still disabled (currentPage === 0)
   Next button: now enabled (isNextPage === true)

9. User sees populated table with Next button enabled
```

---

### **User Clicks Next Button**

```
Current State:
currentPage = 0
coins = [Bitcoin, Ethereum, ...]
isNextPage = true

──────────────────────────────────

User clicks Next button:

1. onClick handler executes
   isNextPage === true → condition passes
   setCurrentPage(prev => prev + 1)
     prev = 0
     returns 1
   currentPage becomes 1

2. State change triggers re-render
   Component re-renders with currentPage = 1
   Back button: now enabled (1 !== 0)
   Next button: still enabled (isNextPage still true from before)

3. useEffect sees currentPage changed
   Dependency [currentPage] changed from 0 to 1
   Effect callback runs again

4. fetchCoins() executes
   GET /api/fe/cryptocurrencies?page=1

5. API responds
   {
     hasNext: true,
     coins: [
       { name: "Monero", ... },
       { name: "Tether", ... },
       ...
     ]
   }

6. State updated
   setCoins([Monero, Tether, ...])
   setIsNextPage(true)

7. Component re-renders again
   Table shows page 1 coins
   Both buttons enabled
```

---

### **User Clicks Next Multiple Times (Reaches Last Page)**

```
Current State:
currentPage = 18
isNextPage = true

──────────────────────────────────

User clicks Next:

1. setCurrentPage(prev => prev + 1)
   currentPage becomes 19

2. useEffect runs
   fetchCoins()
   GET /api/fe/cryptocurrencies?page=19

3. API responds (LAST PAGE)
   {
     hasNext: false,  ← No more pages!
     coins: [
       { name: "LastCoin", ... }
     ]
   }

4. State updated
   setCoins([LastCoin, ...])
   setIsNextPage(false)  ← Updates to false

5. Component re-renders
   Table shows last page coins
   Back button: enabled
   Next button: DISABLED (isNextPage === false)

User can no longer go forward
```

---

### **User Clicks Back Button**

```
Current State:
currentPage = 19
isNextPage = false

──────────────────────────────────

User clicks Back:

1. onClick handler executes
   currentPage > 0 → true (19 > 0)
   setCurrentPage(prev => prev - 1)
     prev = 19
     returns 18
   currentPage becomes 18

2. useEffect runs
   fetchCoins()
   GET /api/fe/cryptocurrencies?page=18

3. API responds
   {
     hasNext: true,  ← Back to page with next page!
     coins: [...]
   }

4. State updated
   setCoins([...])
   setIsNextPage(true)

5. Component re-renders
   Table shows page 18 coins
   Back button: enabled
   Next button: now enabled again! (isNextPage === true)
```

---

## Error Handling

### **Scenario: Network Error**

```javascript
// Network fails or API down
try {
  const response = await fetch(url);
  // Throws error if network fails
  const data = await response.json();
  setCoins(data.coins);
  setIsNextPage(data.hasNext);
} catch (error) {
  console.log(error);
  // Error logged, but:
  // - coins remains unchanged
  // - isNextPage remains unchanged
  // - Component still functional with old data
}

// Production improvements:
catch (error) {
  console.error(error);
  setCoins([]);  // Clear table
  setError(error.message);  // Store error
  // Render error message in UI
}
```

---

## Performance Considerations

### **Re-render Optimization**

```javascript
// Current: Re-renders on state changes
// - currentPage changes → re-render
// - coins changes → re-render
// - isNextPage changes → re-render

// All necessary for UI updates
// No optimization needed (component is small)

// If component was expensive:
const MemoizedTable = React.memo(({ coins }) => {
  return <table>...</table>;
});
```

---

### **API Call Optimization**

```javascript
// Current: Fetches on every page change
// No caching of previous pages

// Could add caching:
const [cache, setCache] = useState({});

useEffect(() => {
  if (cache[currentPage]) {
    setCoins(cache[currentPage].coins);
    setIsNextPage(cache[currentPage].hasNext);
    return;
  }

  // Fetch if not cached
  fetchCoins().then((data) => {
    setCache((prev) => ({
      ...prev,
      [currentPage]: data,
    }));
  });
}, [currentPage]);

// Trade-off: Memory for speed
```

---

## Testing Scenarios

### **Test Cases**

```javascript
// Test 1: Initial mount
// - Table empty initially
// - Fetches page 0
// - Shows data after fetch
// - Back disabled, Next enabled (if hasNext)

// Test 2: Navigate forward
// - Click Next
// - Fetches page 1
// - Shows new data
// - Both buttons enabled

// Test 3: Navigate backward
// - Click Back
// - Fetches previous page
// - Shows previous data

// Test 4: First page
// - On page 0
// - Back button disabled

// Test 5: Last page
// - Navigate to last page
// - Next button disabled
// - Back button enabled

// Test 6: API error
// - Network fails
// - No crash
// - Error logged

// Test 7: Empty response
// - API returns { hasNext: false, coins: [] }
// - No table rows
// - Next button disabled
```

---

## Accessibility Improvements

### **Current Implementation**

```javascript
<table>
  <caption>Crypto Prices</caption> // ✓ Table title
  <thead>
    <th scope="col">Coin</th> // ✓ Column headers
  </thead>
  <tbody>
    <th scope="row">{coin.name}</th> // ✓ Row headers
  </tbody>
</table>
```

### **Additional Improvements**

```javascript
// Loading state
{loading && <div aria-live="polite">Loading...</div>}

// Error messages
{error && <div role="alert">{error}</div>}

// Button labels
<button
  aria-label={`Go to page ${currentPage - 1}`}
  disabled={currentPage === 0}
>
  Back
</button>

// Table summary
<caption>
  Crypto Prices - Page {currentPage + 1}
  <span className="sr-only">
    {coins.length} cryptocurrencies listed
  </span>
</caption>

// Loading spinner
{loading && (
  <div role="status" aria-live="polite">
    <span className="sr-only">Loading page {currentPage + 1}</span>
    <LoadingSpinner />
  </div>
)}
```

---

## Common Mistakes to Avoid

### **Mistake 1: Missing Dependency in useEffect**

```javascript
// ❌ WRONG: Stale closure
useEffect(() => {
  fetch(`...?page=${currentPage}`);
}, []); // Missing currentPage in dependencies

// currentPage will always be 0 (initial value)
// Clicking Next/Back won't fetch new pages

// ✓ CORRECT: Include all dependencies
useEffect(() => {
  fetch(`...?page=${currentPage}`);
}, [currentPage]);
```

---

### **Mistake 2: Not Handling Loading State**

```javascript
// ❌ WRONG: Coins might be from wrong page during fetch
// Shows old data while new data loads

// ✓ BETTER: Add loading state
const [loading, setLoading] = useState(false);

useEffect(() => {
  setLoading(true);
  fetchCoins().then(() => {
    setLoading(false);
  });
}, [currentPage]);

// Show loading indicator
{
  loading ? <LoadingSpinner /> : <table>...</table>;
}
```

---

### **Mistake 3: Incorrect Button Logic**

```javascript
// ❌ WRONG: Only checking currentPage for Next button
disabled={currentPage === maxPage}
// Problem: Don't know maxPage without fetching all pages

// ✓ CORRECT: Use hasNext from API
disabled={!isNextPage}
// API tells us if more pages exist
```

---

### **Mistake 4: Not Using Key Prop**

```javascript
// ❌ WRONG: No key
coins.map((coin) => <tr>...</tr>);

// ✓ CORRECT: Unique key
coins.map((coin) => <tr key={coin.name}>...</tr>);

// React needs keys to:
// - Track which items changed
// - Optimize re-renders
// - Prevent bugs with component state
```

---

## Alternative Implementations

### **Alternative 1: useReducer for State**

```javascript
const initialState = {
  currentPage: 0,
  coins: [],
  isNextPage: false,
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        coins: action.payload.coins,
        isNextPage: action.payload.hasNext,
        loading: false,
      };
    case "NEXT_PAGE":
      return { ...state, currentPage: state.currentPage + 1 };
    case "PREV_PAGE":
      return { ...state, currentPage: state.currentPage - 1 };
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(reducer, initialState);
```

---

### **Alternative 2: Custom Hook**

```javascript
function usePaginatedCrypto() {
  const [currentPage, setCurrentPage] = useState(0);
  const [coins, setCoins] = useState([]);
  const [isNextPage, setIsNextPage] = useState(false);

  useEffect(() => {
    fetch(`...?page=${currentPage}`)
      .then((r) => r.json())
      .then((data) => {
        setCoins(data.coins);
        setIsNextPage(data.hasNext);
      });
  }, [currentPage]);

  const nextPage = () => setCurrentPage((prev) => prev + 1);
  const prevPage = () => setCurrentPage((prev) => prev - 1);

  return {
    coins,
    currentPage,
    isNextPage,
    nextPage,
    prevPage,
  };
}

// Usage:
const { coins, currentPage, isNextPage, nextPage, prevPage } =
  usePaginatedCrypto();
```

---

## Summary

The Crypto Prices solution demonstrates:

1. **useEffect Hook:** Fetching data on mount and state changes
2. **useState Management:** Multiple related state variables
3. **Async/Await:** Modern asynchronous JavaScript
4. **Dependency Arrays:** Controlling when effects run
5. **Conditional Rendering:** Dynamic table rows from API data
6. **Button State:** Disabled logic based on pagination state
7. **Updater Functions:** Safe state updates with prev value
8. **Error Handling:** Try-catch for network errors
9. **Semantic HTML:** Accessible table structure
10. **Component Lifecycle:** Understanding React's render cycle

This creates a functional paginated data table that fetches cryptocurrency prices from an API, displays them in an accessible format, and provides intuitive navigation controls.
