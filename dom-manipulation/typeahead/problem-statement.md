# Typeahead 🟢⭐

**Category:** DOM Manipulation

You're given an API endpoint that returns a list of FrontendExpert glossary terms that start with a given string, and you have to use this API to implement a search typeahead.

## Problem Description

For this question, the search typeahead is a special input field (with `typeahead` as its id) that issues API requests with the text that a user types into it. More specifically, it issues an API request after the user has stopped typing for some time—not while the user is typing—and it displays the results of those API requests as suggestions for the user.

## API Details

The provided API expects GET requests at this URL:

```
https://api.frontendexpert.io/api/fe/glossary-suggestions
```

## Query Parameters

Each API request should include a `text` query parameter. For example, this would be a valid URL to request:

```
https://api.frontendexpert.io/api/fe/glossary-suggestions?text=acc
```

## API Response Format

The API responds with a JSON array of strings, each of which is a glossary-term name that starts with the passed `text`.

### Example Response

For example, the URL above might respond with:

```json
[
  "Accessibility",
  "Accessibility Tree"
]
```

## Display Requirements

When the user stops typing into the typeahead for 500ms, a request should be made to the API to get suggestions for the text that's currently typed into the typeahead input field.

Once an API request resolves, the suggestions returned by the API should be displayed on the page, replacing any previously displayed suggestions. Each suggestion should be an HTML list item appended to the provided `#suggestions-list` `ul`, and each suggestion should have the relevant API-responded glossary-term name as its text content.

### HTML Structure

For example, if the API request above were to resolve, the suggestions HTML would look like this:

```html
<ul id="suggestions-list">
  <li>Accessibility</li>
  <li>Accessibility Tree</li>
</ul>
```

## Interaction Requirements

### Clicking Suggestions

If the user clicks on one of the suggestions, its value should be filled into the typeahead, and the displayed suggestions should be cleared.

### Clearing Input

If the user clears the typeahead (e.g., backspaces all of the typed text), the displayed suggestions should be cleared, and no API request should be made.

## Technical Requirements

1. **Debouncing:** Only make API calls after the user stops typing for 500ms
2. **Replace Suggestions:** New suggestions should replace old ones, not append to them
3. **Single Request:** Handle rapid typing properly to avoid multiple simultaneous requests
4. **Use Global fetch():** You should use the global `fetch()` method to make requests to the API (call `fetch()` directly; don't call `window.fetch()`)

Your JavaScript code has already been linked to the pre-written HTML code via a deferred script tag.

## Pre-written HTML

```html
<div id="wrapper">
  <input
    id="typeahead"
    type="text"
    placeholder="Search for a glossary term..."
    autocomplete="off" />
  <ul id="suggestions-list"></ul>
</div>
```

## CSS Styling

```css
* {
  box-sizing: border-box;
}

#wrapper {
  width: 400px;
  margin: 24px auto;
}

#typeahead {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 2px solid #820080;
  font-size: 18px;
  outline: none;
}

#suggestions-list {
  width: 100%;
  padding: 0;
  border-radius: 8px;
  margin-top: 8px;
  box-shadow: 0 5px 10px #4a494933;
  list-style-type: none;
  max-height: 200px;
  overflow: auto;
}

li {
  padding: 12px;
  font-size: 18px;
  cursor: pointer;
}

li:first-child {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

li:last-child {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

li:not(.selected, :hover):nth-child(even) {
  background-color: #e7e7e7;
}

li:not(.selected, :hover):nth-child(odd) {
  background-color: white;
}

li:hover, .selected {
  background-color: #7ba5f6;
}
```