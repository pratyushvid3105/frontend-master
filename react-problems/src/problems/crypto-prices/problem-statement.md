# Crypto Prices 🟢⭐

**Category:** React Components

You're given a CSS file for a component displaying cryptocurrency prices, and you need to implement the component using React.

## Initial Behavior

When the component initially mounts, it should make an API request to the cryptocurrencies API at:

```
https://api.frontendexpert.io/api/fe/cryptocurrencies
```

## API Details

This API expects GET requests with one query parameter, the `page`. The page should be a number representing which page of data is being requested, starting at page 0. The API returns a JSON formatted object with two keys: `coins` and `hasNext`.

### Response Structure

- **`hasNext`**: The `hasNext` value will always be `true` unless the page requested includes the last cryptocurrency, in which case `hasNext` will be `false`.

- **`coins`**: The `coins` value will be an array of coin objects, each with three keys: `name`, `price`, and `marketCap`, all as strings.

### Example Request

For example, a call to:

```
https://api.frontendexpert.io/api/fe/cryptocurrencies?page=3
```

would return page three of data, which might look like this:

```json
{
  "hasNext": true,
  "coins": [
    {
      "name": "Monero",
      "price": "$148.45",
      "marketCap": "$2,690,082,919"
    },
    ...
  ]
}
```

## Table Display

Your component should return a table, with a caption of "Crypto Prices" and three columns with headings of "Coin", "Price", and "Market Cap". Every coin from the most recent call to the API should be given a row in the table. For example, the table might initially look like this:

```
+──────────+──────────────+────────────────────+
|   Coin   |    Price     |    Market Cap      |
+──────────+──────────────+────────────────────+
| Bitcoin  | $29,970.48   | $571,108,740,782   |
| Ethereum | $2,064.89    | $249,824,561,307   |
| ...      | ...          | ...                |
+──────────+──────────────+────────────────────+
```

## Pagination Buttons

Below the table should be two buttons with the text of `Back` and `Next`. The back button should return to the previous page, and the next button should move to the next page. The back button should be disabled on the first page, and the next button should be disabled on the last page.

Your component has already been rendered to the DOM inside of a `#root` div directly in the body with the CSS imported.

## CSS Styling

```css
body {
  background-color: lightgrey;
}

table {
  margin: auto;
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;
}

th,
td {
  padding: 4px 8px;
  border: 1px solid black;
  background-color: white;
}

th[scope="row"] {
  text-align: left;
}

td {
  text-align: right;
}

caption {
  font-weight: bold;
  font-size: 1.5em;
  margin-bottom: 8px;
}

button,
input[type="button"] {
  cursor: pointer;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  background-color: #02203c;
  color: white;
  transition: 0.5s;
  margin-top: 10px;
  position: absolute;
}

button:first-of-type,
input[type="button"]:first-of-type {
  left: 16px;
}

button:last-of-type,
input[type="button"]:last-of-type {
  right: 16px;
}

button:disabled,
input[type="button"]:disabled {
  background-color: grey;
}
```
