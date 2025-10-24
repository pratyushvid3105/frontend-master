# Trending Stocks Solution - Step-by-Step Explanation

## Overview

This solution implements an async function that fetches and combines data from multiple APIs to return information about top stocks by market capitalization. The key challenges include **minimizing API requests**, **parallel fetching where possible**, **data merging from multiple sources**, and **sorting by market cap**. The algorithm uses `Promise.all` for parallel requests and Map data structures for efficient lookups.

## Implementation Strategy

### **Core Approach: Parallel Fetching + Data Merging**

The solution uses:

1. **Parallel initial fetches** → Fetch symbols and market-caps simultaneously
2. **Map-based merging** → Use Maps for O(1) lookups when merging data
3. **Sorting** → Sort by market-cap to get top n stocks
4. **Targeted final fetch** → Only fetch prices for top n stocks
5. **Data transformation** → Combine all data into required format

This approach minimizes requests and optimizes performance through parallel fetching.

---

## Step-by-Step Breakdown

### **1. API URL Constants**

```javascript
// Define API endpoint URLs as constants
// Constants prevent typos and make URLs easy to update
const SYMBOLS_API_BASE_URL =
  "https://api.frontendexpert.io/api/fe/stock-symbols";
const MARKET_CAPS_API_BASE_URL =
  "https://api.frontendexpert.io/api/fe/stock-market-caps";
const PRICES_API_BASE_URL = "https://api.frontendexpert.io/api/fe/stock-prices";
```

**Purpose:** Centralize API URLs for maintainability.

**Why use constants:**

- Easy to update if URLs change
- No risk of typos in multiple places
- Clear documentation of available endpoints

---

### **2. Function Signature and Edge Case**

```javascript
/**
 * Fetches and returns data for top n stocks by market cap
 * Minimizes API calls by fetching in parallel and only requesting needed data
 * @param {number} n - Number of top stocks to return
 * @returns {Promise<Array>} Array of stock objects with 6 properties each
 */
async function trendingStocks(n) {
  // Edge case: if n is 0, return empty array immediately
  // No need to make any API calls
  // This saves unnecessary network requests
  if (n === 0) return [];
```

**Purpose:** Handle edge case to avoid unnecessary API calls.

**Why check n === 0:**

- Requesting 0 stocks means no data needed
- Avoids fetching 500 stocks just to return empty array
- Improves performance for edge case

---

### **3. Parallel Initial Fetches**

```javascript
// Step 1: Fetch symbols and market-caps in parallel
// Promise.all runs both requests simultaneously (not sequentially)
// This is faster than await fetch1; await fetch2;
// Both APIs return all 500 stocks, so neither depends on the other
const [symbols, marketCaps] = await Promise.all([
  // Fetch symbols API
  fetch(SYMBOLS_API_BASE_URL).then((res) => res.json()), // Parse JSON response

  // Fetch market-caps API
  fetch(MARKET_CAPS_API_BASE_URL).then((res) => res.json()), // Parse JSON response
]);
```

**Purpose:** Fetch two independent APIs simultaneously for speed.

**Why `Promise.all`:**

```javascript
// Sequential (SLOW):
const symbols = await fetch(url1).then((r) => r.json()); // 500ms
const marketCaps = await fetch(url2).then((r) => r.json()); // 500ms
// Total time: 1000ms

// Parallel (FAST):
const [symbols, marketCaps] = await Promise.all([
  fetch(url1).then((r) => r.json()), // 500ms
  fetch(url2).then((r) => r.json()), // 500ms (simultaneous!)
]);
// Total time: 500ms (both run at once)
```

**Array Destructuring:**

```javascript
// Promise.all returns array: [result1, result2]
const results = await Promise.all([promise1, promise2]);
const symbols = results[0];
const marketCaps = results[1];

// Destructuring assignment (cleaner):
const [symbols, marketCaps] = await Promise.all([promise1, promise2]);
```

**Example API Responses:**

```javascript
// symbols:
[
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "GOOGL", name: "Alphabet Inc Class A" },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  ...
]

// marketCaps:
[
  { symbol: "AAPL", "market-cap": 809508034020 },
  { symbol: "GOOGL", "market-cap": 733823966137 },
  { symbol: "MSFT", "market-cap": 695000000000 },
  ...
]
```

---

### **4. Create Market-Cap Lookup Map**

```javascript
// Step 2: Create a Map for O(1) market-cap lookups by symbol
// Maps are more efficient than array.find() which is O(n)
// .map() transforms marketCaps array into [key, value] pairs
// new Map() creates a Map from these pairs
const capBySymbol = new Map(
  marketCaps.map((mCap) => [
    mCap.symbol, // Key: stock symbol
    mCap["market-cap"], // Value: market capitalization
  ])
);
```

**Purpose:** Create efficient lookup structure for market-caps.

**Why use Map:**

```javascript
// Without Map (SLOW - O(n) per lookup):
const getMarketCap = (symbol) => {
  return marketCaps.find(m => m.symbol === symbol)["market-cap"];
};
// For 500 stocks: 500 × O(n) = O(n²) = very slow!

// With Map (FAST - O(1) per lookup):
const capBySymbol = new Map(...);
const getMarketCap = (symbol) => capBySymbol.get(symbol);
// For 500 stocks: 500 × O(1) = O(n) = fast!
```

**How it's built:**

```javascript
// Input array:
marketCaps = [
  { symbol: "AAPL", "market-cap": 809508034020 },
  { symbol: "GOOGL", "market-cap": 733823966137 },
];

// Transform with .map():
marketCaps.map((mCap) => [mCap.symbol, mCap["market-cap"]]);
// Result: [
//   ["AAPL", 809508034020],
//   ["GOOGL", 733823966137]
// ]

// Create Map:
new Map([
  ["AAPL", 809508034020],
  ["GOOGL", 733823966137],
]);

// Usage:
capBySymbol.get("AAPL"); // 809508034020
capBySymbol.get("GOOGL"); // 733823966137
```

**Map Structure Visualization:**

```
capBySymbol Map:
┌──────────┬────────────────┐
│   Key    │     Value      │
├──────────┼────────────────┤
│  "AAPL"  │ 809508034020   │
│ "GOOGL"  │ 733823966137   │
│  "MSFT"  │ 695000000000   │
└──────────┴────────────────┘
```

---

### **5. Merge Symbols and Market-Caps**

```javascript
// Step 3: Merge symbols data with market-caps data
// Create new array with combined information from both APIs
// For each symbol, look up its market-cap from the Map
const merged = symbols.map((sym) => ({
  symbol: sym.symbol, // From symbols API
  name: sym.name, // From symbols API
  "market-cap": capBySymbol.get(sym.symbol) ?? 0, // From market-caps API
  // ?? 0 provides default value if symbol not found in map
}));
```

**Purpose:** Combine data from both APIs into unified objects.

**Nullish Coalescing (`??`):**

```javascript
// Returns right side if left is null or undefined
capBySymbol.get("AAPL") ?? 0; // 809508034020 (found)
capBySymbol.get("UNKNOWN") ?? 0; // 0 (not found, use default)

// Different from || (logical OR):
0 || 10; // 10 (0 is falsy)
0 ?? 10; // 0 (0 is not null/undefined)

null ?? 10; // 10 (null is nullish)
```

**Example Transformation:**

```javascript
// Input:
symbols = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "GOOGL", name: "Alphabet Inc Class A" }
]

capBySymbol = Map {
  "AAPL" => 809508034020,
  "GOOGL" => 733823966137
}

// After merge:
merged = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    "market-cap": 809508034020
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc Class A",
    "market-cap": 733823966137
  }
]
```

---

### **6. Sort by Market-Cap**

```javascript
// Step 4: Sort stocks by market-cap in descending order
// This puts highest market-cap stocks first
// .sort() modifies array in-place
// Comparator function: (a, b) => negative means a before b
merged.sort(
  (a, b) => b["market-cap"] - a["market-cap"]
  // If b's cap > a's cap: positive number → b comes first
  // If a's cap > b's cap: negative number → a comes first
);
```

**Purpose:** Order stocks from highest to lowest market-cap.

**How Sort Works:**

```javascript
// Comparator function return values:
// < 0  →  a comes before b
// > 0  →  b comes before a
// = 0  →  keep original order

// Example:
[3, 1, 4, 1, 5]
  .sort((a, b) => a - b) // [1, 1, 3, 4, 5] ascending
  [(3, 1, 4, 1, 5)].sort((a, b) => b - a); // [5, 4, 3, 1, 1] descending
```

**Example Execution:**

```javascript
// Before sort:
merged = [
  { symbol: "MSFT", "market-cap": 695000000000 },
  { symbol: "AAPL", "market-cap": 809508034020 },
  { symbol: "GOOGL", "market-cap": 733823966137 }
]

// Comparisons:
Compare MSFT vs AAPL:
  809508034020 - 695000000000 = 114508034020 (positive)
  → AAPL comes first

Compare AAPL vs GOOGL:
  733823966137 - 809508034020 = -75684067883 (negative)
  → AAPL stays first

// After sort (descending by market-cap):
merged = [
  { symbol: "AAPL", "market-cap": 809508034020 },    // Largest
  { symbol: "GOOGL", "market-cap": 733823966137 },   // Second
  { symbol: "MSFT", "market-cap": 695000000000 }     // Third
]
```

---

### **7. Extract Top N and Prepare Price Request**

```javascript
// Step 5: Take only the top n stocks after sorting
// slice(0, n) returns first n elements
// slice creates new array (doesn't modify original)
const topN = merged.slice(0, n);

// Step 6: Prepare query parameter for prices API
// Extract just the symbols from top n stocks
// JSON.stringify converts array to JSON string format
// Prices API expects: ?symbols=["AAPL","GOOGL",...]
const symbolsParams = JSON.stringify(topN.map((sym) => sym.symbol));
```

**Purpose:** Get top n stocks and prepare for prices API request.

**Array Slice:**

```javascript
const arr = [1, 2, 3, 4, 5];
arr.slice(0, 2); // [1, 2] (first 2 elements)
arr.slice(0, 3); // [1, 2, 3] (first 3 elements)
arr.slice(0, 0); // [] (0 elements)
```

**Building Query Parameter:**

```javascript
// topN:
[
  { symbol: "AAPL", name: "Apple Inc.", "market-cap": 809508034020 },
  { symbol: "GOOGL", name: "Alphabet Inc Class A", "market-cap": 733823966137 },
];

// Extract symbols:
topN.map((sym) => sym.symbol);
// ["AAPL", "GOOGL"]

// JSON.stringify:
JSON.stringify(["AAPL", "GOOGL"]);
// '["AAPL","GOOGL"]'

// Final URL:
// https://api.../stock-prices?symbols=["AAPL","GOOGL"]
```

**Key Optimization:**

- Only fetch prices for top n stocks (not all 500)
- If n=2, only 2 stocks in price request
- Saves bandwidth and reduces response time

---

### **8. Fetch Prices for Top N**

```javascript
// Step 7: Fetch prices only for the top n stocks
// Template literal constructs URL with query parameter
// This is the second round of API calls (prices depend on knowing top n)
const prices = await fetch(
  `${PRICES_API_BASE_URL}?symbols=${symbolsParams}`
).then((res) => res.json());
```

**Purpose:** Fetch detailed price data for only the top n stocks.

**Why This Can't Be Parallel with Initial Fetches:**

```javascript
// Can't do this:
const [symbols, marketCaps, prices] = await Promise.all([
  fetch(symbols),
  fetch(marketCaps),
  fetch(prices), // ❌ Don't know which stocks to request yet!
]);

// Must do this:
// 1. Fetch symbols + marketCaps in parallel
// 2. Merge data
// 3. Sort by market-cap
// 4. Take top n
// 5. THEN fetch prices for top n
```

**Template Literal URL:**

```javascript
const base = "https://api.example.com/prices";
const params = '["AAPL","GOOGL"]';

// Template literal:
`${base}?symbols=${params}`;
// "https://api.example.com/prices?symbols=["AAPL","GOOGL"]"

// Equivalent to:
base + "?symbols=" + params;
```

**Example Prices Response:**

```javascript
prices = [
  {
    symbol: "AAPL",
    price: 155.15,
    "52-week-low": 180.1,
    "52-week-high": 131.12,
  },
  {
    symbol: "GOOGL",
    price: 1007.71,
    "52-week-low": 1198,
    "52-week-high": 824.3,
  },
];
```

---

### **9. Create Price Lookup Map**

```javascript
// Step 8: Create Map for O(1) price lookups by symbol
// Similar strategy to market-caps Map
// Each price object contains all price-related data for a stock
const priceBySymbol = new Map(
  prices.map((p) => [
    p.symbol, // Key: stock symbol
    p, // Value: entire price object (has all 4 price fields)
  ])
);
```

**Purpose:** Enable fast price lookups when building final result.

**Map Structure:**

```javascript
priceBySymbol = Map {
  "AAPL" => {
    symbol: "AAPL",
    price: 155.15,
    "52-week-low": 180.1,
    "52-week-high": 131.12
  },
  "GOOGL" => {
    symbol: "GOOGL",
    price: 1007.71,
    "52-week-low": 1198,
    "52-week-high": 824.3
  }
}

// Usage:
priceBySymbol.get("AAPL").price          // 155.15
priceBySymbol.get("AAPL")["52-week-high"] // 131.12
```

---

### **10. Build Final Result Array**

```javascript
// Step 9: Combine all data into final result format
// For each of the top n stocks, create object with all 6 properties
// Properties must be in specific order as per requirements
const result = topN.map((el, ind) => {
  // Look up price data for this stock
  const price = priceBySymbol.get(el.symbol);

  // Return object with all 6 required properties
  // Order matters for output consistency
  return {
    "52-week-high": price["52-week-high"], // From prices API
    "52-week-low": price["52-week-low"], // From prices API
    "market-cap": el["market-cap"], // From market-caps API
    name: el.name, // From symbols API
    price: price["price"], // From prices API
    symbol: el.symbol, // From symbols API
  };
});
```

**Purpose:** Transform merged data into final format with all 6 properties.

**Data Sources for Each Property:**

```
Final Object Properties:
┌───────────────────┬─────────────────┐
│ Property          │ Source          │
├───────────────────┼─────────────────┤
│ "52-week-high"    │ Prices API      │
│ "52-week-low"     │ Prices API      │
│ "market-cap"      │ Market-Caps API │
│ name              │ Symbols API     │
│ price             │ Prices API      │
│ symbol            │ Symbols API     │
└───────────────────┴─────────────────┘
```

**Example Transformation:**

```javascript
// Input (topN):
[
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    "market-cap": 809508034020,
  },
];

// Lookup price:
price =
  priceBySymbol.get("AAPL")[
    // {
    //   symbol: "AAPL",
    //   price: 155.15,
    //   "52-week-low": 180.1,
    //   "52-week-high": 131.12
    // }

    // Output (result):
    {
      "52-week-high": 131.12,
      "52-week-low": 180.1,
      "market-cap": 809508034020,
      name: "Apple Inc.",
      price: 155.15,
      symbol: "AAPL",
    }
  ];
```

---

### **11. Return Result**

```javascript
  // Step 10: Return the final result array
  // Contains top n stocks with all 6 required properties
  return result;
}
```

**Purpose:** Return the complete result to the caller.

## Key Concepts Explained

### **1. Parallel vs Sequential Fetching**

Understanding when to fetch in parallel vs sequence:

**Parallel Fetching (Independent Requests):**

```javascript
// ✓ GOOD: Fetch independent data simultaneously
const [symbols, marketCaps] = await Promise.all([
  fetch(symbolsAPI),
  fetch(marketCapsAPI),
]);
// Both APIs return all 500 stocks
// Neither depends on the other
// Time: max(T1, T2) instead of T1 + T2

// Example timing:
// Symbols API: 500ms
// Market-Caps API: 500ms
// Total time: 500ms (parallel) vs 1000ms (sequential)
```

**Sequential Fetching (Dependent Requests):**

```javascript
// ✓ CORRECT: Can't parallelize dependent requests
const [symbols, marketCaps] = await Promise.all([...]);
const merged = symbols.map(...);
merged.sort(...);
const topN = merged.slice(0, n);

// THEN fetch prices (depends on knowing top n)
const prices = await fetch(pricesAPI + topN.symbols);

// Can't do Promise.all with prices because:
// - We don't know which stocks until after sorting
// - Prices request depends on topN result
```

**Anti-Pattern (Unnecessary Sequential):**

```javascript
// ❌ BAD: Making independent requests sequential
const symbols = await fetch(symbolsAPI).then((r) => r.json());
const marketCaps = await fetch(marketCapsAPI).then((r) => r.json());
// Wastes time waiting when both could run simultaneously!
```

---

### **2. Map Data Structure for Lookups**

Why Map is superior to array methods for lookups:

**Array.find() Approach (Slow):**

```javascript
// O(n) for each lookup
const getMarketCap = (symbol) => {
  return marketCaps.find((m) => m.symbol === symbol)?.["market-cap"];
};

// For 500 stocks:
symbols.forEach((sym) => {
  const cap = getMarketCap(sym.symbol); // O(n) lookup
});
// Total: O(n²) = 500 × 500 = 250,000 operations worst case
```

**Map Approach (Fast):**

```javascript
// Create Map once: O(n)
const capBySymbol = new Map(marketCaps.map((m) => [m.symbol, m["market-cap"]]));

// O(1) for each lookup
symbols.forEach((sym) => {
  const cap = capBySymbol.get(sym.symbol); // O(1) lookup
});
// Total: O(n) + O(n) = O(n) = 1,000 operations
```

**Performance Comparison:**

```
For 500 stocks:
Array.find(): 250,000 operations (worst case)
Map.get():    1,000 operations
Speedup:      250x faster!
```

---

### **3. Nullish Coalescing Operator (??)**

Understanding `??` vs `||`:

```javascript
// Nullish coalescing (??):
// Returns right side only if left is null or undefined
null ?? "default"; // "default"
undefined ?? "default"; // "default"
0 ?? "default"; // 0 (0 is not null/undefined)
"" ?? "default"; // "" (empty string is not null/undefined)
false ?? "default"; // false (false is not null/undefined)

// Logical OR (||):
// Returns right side if left is any falsy value
null || "default"; // "default"
undefined || "default"; // "default"
0 || "default"; // "default" (0 is falsy)
"" || "default"; // "default" ("" is falsy)
false || "default"; // "default" (false is falsy)

// In our code:
capBySymbol.get(symbol) ?? 0;
// Use 0 only if symbol not found (returns undefined)
// If symbol found with value 0, keep 0 (don't replace)
```

---

### **4. Template Literals for URLs**

Building URLs with dynamic parameters:

```javascript
// Template literal (modern):
const url = `${baseURL}?symbols=${params}`;

// Equivalent string concatenation (old):
const url = baseURL + "?symbols=" + params;

// Example:
const base = "https://api.example.com/prices";
const params = '["AAPL","GOOGL"]';

// Result:
`${base}?symbols=${params}`;
// "https://api.example.com/prices?symbols=["AAPL","GOOGL"]"

// Multi-line template literals:
const url = `
  ${base}
  ?symbols=${params}
  &format=json
`.trim();
```

---

### **5. Array Destructuring**

Extracting values from arrays:

```javascript
// Promise.all returns array:
const results = await Promise.all([promise1, promise2]);

// Without destructuring:
const symbols = results[0];
const marketCaps = results[1];

// With destructuring (cleaner):
const [symbols, marketCaps] = await Promise.all([promise1, promise2]);

// Skip elements:
const [first, , third] = [1, 2, 3]; // first=1, third=3

// Rest operator:
const [first, ...rest] = [1, 2, 3, 4]; // first=1, rest=[2,3,4]
```

---

## Complete Execution Example

### **Input:** `trendingStocks(2)`

```javascript
// ========== PHASE 1: PARALLEL FETCHES ==========
fetch(symbols API) ─┐
                    ├─ await Promise.all([...])
fetch(marketCaps API) ─┘

symbols = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "GOOGL", name: "Alphabet Inc Class A" },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  ...500 stocks
]

marketCaps = [
  { symbol: "AAPL", "market-cap": 809508034020 },
  { symbol: "GOOGL", "market-cap": 733823966137 },
  { symbol: "MSFT", "market-cap": 695000000000 },
  ...500 stocks
]

// ========== PHASE 2: CREATE LOOKUP MAP ==========
capBySymbol = Map {
  "AAPL" => 809508034020,
  "GOOGL" => 733823966137,
  "MSFT" => 695000000000,
  ...
}

// ========== PHASE 3: MERGE DATA ==========
merged = [
  { symbol: "AAPL", name: "Apple Inc.", "market-cap": 809508034020 },
  { symbol: "GOOGL", name: "Alphabet Inc Class A", "market-cap": 733823966137 },
  { symbol: "MSFT", name: "Microsoft Corporation", "market-cap": 695000000000 },
  ...500 stocks
]

// ========== PHASE 4: SORT ==========
// Before: [AAPL, GOOGL, MSFT, ...]
// After:  [AAPL, GOOGL, MSFT, ...] (sorted by market-cap descending)

merged.sort((a, b) => b["market-cap"] - a["market-cap"])

merged = [
  { symbol: "AAPL", name: "Apple Inc.", "market-cap": 809508034020 },      // 1st
  { symbol: "GOOGL", name: "Alphabet Inc Class A", "market-cap": 733823966137 },  // 2nd
  { symbol: "MSFT", name: "Microsoft Corporation", "market-cap": 695000000000 },  // 3rd
  ...
]

// ========== PHASE 5: TAKE TOP N ==========
topN = merged.slice(0, 2) = [
  { symbol: "AAPL", name: "Apple Inc.", "market-cap": 809508034020 },
  { symbol: "GOOGL", name: "Alphabet Inc Class A", "market-cap": 733823966137 }
]

// ========== PHASE 6: PREPARE PRICE REQUEST ==========
symbolsArray = topN.map(sym => sym.symbol) = ["AAPL", "GOOGL"]
symbolsParams = JSON.stringify(["AAPL", "GOOGL"]) = '["AAPL","GOOGL"]'

// ========== PHASE 7: FETCH PRICES ==========
fetch(`${PRICES_API_BASE_URL}?symbols=["AAPL","GOOGL"]`)

prices = [
  { symbol: "AAPL", price: 155.15, "52-week-low": 180.1, "52-week-high": 131.12 },
  { symbol: "GOOGL", price: 1007.71, "52-week-low": 1198, "52-week-high": 824.3 }
]

// ========== PHASE 8: CREATE PRICE MAP ==========
priceBySymbol = Map {
  "AAPL" => { symbol: "AAPL", price: 155.15, "52-week-low": 180.1, "52-week-high": 131.12 },
  "GOOGL" => { symbol: "GOOGL", price: 1007.71, "52-week-low": 1198, "52-week-high": 824.3 }
}

// ========== PHASE 9: BUILD RESULT ==========
result = topN.map(el => {
  const price = priceBySymbol.get(el.symbol);
  return {
    "52-week-high": price["52-week-high"],
    "52-week-low": price["52-week-low"],
    "market-cap": el["market-cap"],
    name: el.name,
    price: price.price,
    symbol: el.symbol
  };
})

// ========== FINAL RESULT ==========
[
  {
    "52-week-high": 131.12,
    "52-week-low": 180.1,
    "market-cap": 809508034020,
    name: "Apple Inc.",
    price: 155.15,
    symbol: "AAPL"
  },
  {
    "52-week-high": 824.3,
    "52-week-low": 1198,
    "market-cap": 733823966137,
    name: "Alphabet Inc Class A",
    price: 1007.71,
    symbol: "GOOGL"
  }
]
```

---

## Performance Analysis

### **Time Complexity**

**Overall:** `O(m log m)` where m = 500 (total stocks)

**Breakdown:**

- Fetch symbols + market-caps in parallel: `O(1)` (network time)
- Create capBySymbol Map: `O(m)` = 500 operations
- Merge symbols with market-caps: `O(m)` = 500 operations
- Sort merged array: `O(m log m)` = 500 × log(500) ≈ 4,500 operations
- Slice top n: `O(n)` ≤ 500 operations
- Fetch prices: `O(1)` (network time)
- Create priceBySymbol Map: `O(n)` ≤ 500 operations
- Build result: `O(n)` ≤ 500 operations

**Dominant term:** Sorting at `O(m log m)`

---

### **Space Complexity**

**Overall:** `O(m)` where m = 500

**Breakdown:**

- symbols array: `O(m)` = 500 objects
- marketCaps array: `O(m)` = 500 objects
- capBySymbol Map: `O(m)` = 500 entries
- merged array: `O(m)` = 500 objects
- topN array: `O(n)` ≤ 500 objects
- prices array: `O(n)` ≤ 500 objects
- priceBySymbol Map: `O(n)` ≤ 500 entries
- result array: `O(n)` ≤ 500 objects

**Total:** Multiple `O(m)` arrays/maps = `O(m)`

---

### **Network Optimization**

**API Calls Made:**

```
Call 1: Symbols API (500 stocks)
Call 2: Market-Caps API (500 stocks)  } Parallel
Call 3: Prices API (n stocks only)

Total: 3 API calls
Time: max(T1, T2) + T3
```

**Why This is Optimal:**

```
✓ Calls 1 & 2 parallel (independent data)
✓ Call 3 sequential (depends on top n from calls 1 & 2)
✓ Call 3 only requests n stocks (not all 500)

Alternative (worse):
× Fetch all 500 prices: Wastes bandwidth
× Sequential calls 1, 2, 3: Wastes time

For n=2:
Optimized: 2 stocks in price request
Unoptimized: 500 stocks in price request
Bandwidth saved: 99.6%
```

---

## Alternative Approaches

### **Alternative 1: Fetch All Prices Upfront**

```javascript
async function trendingStocks(n) {
  if (n === 0) return [];

  // Fetch ALL data in parallel (including all 500 prices)
  const [symbols, marketCaps, allPrices] = await Promise.all([
    fetch(SYMBOLS_API_BASE_URL).then((r) => r.json()),
    fetch(MARKET_CAPS_API_BASE_URL).then((r) => r.json()),
    fetch(`${PRICES_API_BASE_URL}?symbols=${JSON.stringify(allSymbols)}`).then(
      (r) => r.json()
    ),
  ]);

  // ...merge, sort, take top n

  // Pros: Only 1 round of API calls
  // Cons: Fetches prices for 500 stocks when might only need 2
}
```

**Trade-offs:**

- ✓ Faster (one round of API calls)
- ✗ More bandwidth (fetches unnecessary price data)
- ✗ Larger payload (all 500 prices)

---

### **Alternative 2: Using Reduce for Merging**

```javascript
// Instead of Map + map:
const merged = symbols.reduce((acc, sym) => {
  const marketCap = marketCaps.find((m) => m.symbol === sym.symbol);
  acc.push({
    symbol: sym.symbol,
    name: sym.name,
    "market-cap": marketCap?.["market-cap"] ?? 0,
  });
  return acc;
}, []);

// Slower: O(n²) due to find()
```

---

## Common Pitfalls

### **Pitfall 1: Sequential Fetching**

```javascript
// ❌ SLOW: Sequential fetches
const symbols = await fetch(url1).then(r => r.json());
const marketCaps = await fetch(url2).then(r => r.json());
// Total time: T1 + T2

// ✓ FAST: Parallel fetches
const [symbols, marketCaps] = await Promise.all([...]);
// Total time: max(T1, T2)
```

---

### **Pitfall 2: Using Array.find() Instead of Map**

```javascript
// ❌ SLOW: O(n²)
symbols.map((sym) => ({
  ...sym,
  "market-cap": marketCaps.find((m) => m.symbol === sym.symbol)?.["market-cap"],
}));

// ✓ FAST: O(n)
const capMap = new Map(marketCaps.map((m) => [m.symbol, m["market-cap"]]));
symbols.map((sym) => ({
  ...sym,
  "market-cap": capMap.get(sym.symbol) ?? 0,
}));
```

---

### **Pitfall 3: Fetching All Prices**

```javascript
// ❌ WASTEFUL: Fetch prices for all 500 stocks
const allPrices = await fetch(`${url}?symbols=${JSON.stringify(allSymbols)}`);
// Then filter to top n

// ✓ EFFICIENT: Fetch prices only for top n
const topNSymbols = topN.map((s) => s.symbol);
const prices = await fetch(`${url}?symbols=${JSON.stringify(topNSymbols)}`);
```

---

## Summary

The Trending Stocks solution demonstrates:

1. **Parallel Fetching:** Use `Promise.all` for independent requests
2. **Map Data Structure:** O(1) lookups for merging data
3. **Targeted Requests:** Only fetch needed data (top n prices)
4. **Array Methods:** map, sort, slice, filter for data transformation
5. **Nullish Coalescing:** Safe default values with `??`
6. **Template Literals:** Dynamic URL construction
7. **Async/Await:** Clean asynchronous code flow

This creates an efficient stock data aggregator that minimizes API calls while providing comprehensive information about top stocks by market capitalization.
