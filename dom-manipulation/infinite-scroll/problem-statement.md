# Infinite Scroll 🟢⭐

**Category:** DOM Manipulation

You're given an API endpoint that returns a list of AlgoExpert testimonials (yes, our real testimonials!), and you have to fetch and display these testimonials on the page.

## API Details

The API expects GET requests at this URL:

```
https://api.frontendexpert.io/api/fe/testimonials
```

Since there might be a lot of testimonials, you'll have to use the API endpoint's pagination functionality to repeatedly fetch a limited number of testimonials at a time.

## Query Parameters

The API accepts the following two query parameters:

### 1. `limit` (required)

The maximum number of testimonials to request.

### 2. `after` (optional)

A string ID used as a cursor for pagination. For instance, if the last testimonial you fetched had an ID of `"55"`, adding `after=55` to the URL would fetch testimonials starting after the testimonial with ID `"55"`.

## Example Request

For example, this would be a valid URL to request:

```
https://api.frontendexpert.io/api/fe/testimonials?limit=2&after=55
```

## API Response Format

The API responds with a JSON object containing two keys:

### 1. `hasNext`

A boolean which will be `false` if the response includes the last testimonial in the database, and `true` otherwise.

### 2. `testimonials`

An array which contains testimonial objects, each with a string `"message"` and a unique string `"id"`, to be used as the `after` query parameter.

## Example Response

```json
{
  "hasNext": true,
  "testimonials": [
    {
      "message": "Excellent product!",
      "id": "42"
    },
    {
      "message": "Love it, 5/5 stars!",
      "id": "55"
    }
  ]
}
```

This response would indicate that there are more testimonials to be fetched after the testimonial with ID `"55"`, since `"hasNext"` is `true`.

## Display Requirements

You've been given HTML and CSS files to help you display these testimonials on the page. Specifically, the HTML file contains an empty `#testimonial-container` div, to which you should append the testimonials.

Each testimonial should be placed inside a paragraph element with the `testimonial` class, which is defined in the CSS file.

### HTML Structure

Once testimonials have been displayed on the page, the HTML should look like this:

```html
<div id="testimonial-container">
  <p class="testimonial">{message1}</p>
  <p class="testimonial">{message2}</p>
  <p class="testimonial">{message3}</p>
</div>
```

## Functionality Requirements

Regarding exact functionality, you should:

1. **Initial Load:** Fetch 5 testimonials and append them to the testimonial container as soon as the page loads.

2. **Infinite Scroll:** Whenever the user scrolls to the bottom of the testimonial container, you should fetch another 5 testimonials and append them.

3. **Single Request Rule:** Only one API call should be issued at a time; when one call is pending, no other calls should be issued, even if the user is scrolling down.

4. **Stop When Complete:** Once all testimonials have been fetched, you should no longer make calls to the API.

5. **Use Global fetch():** You should use the global `fetch()` method to make requests to the API (call `fetch()` directly; don't call `window.fetch()`).

6. **Use Scroll Events:** You should listen to `"scroll"` events (don't use `IntersectionObserver`, because it isn't supported in our testing environment).

Your JavaScript code has already been linked to the pre-written HTML code via a deferred script tag.

## CSS Styling

```css
body {
  background-color: grey;
  color: white;
}

h1 {
  text-align: center;
}

#testimonial-container {
  width: 75ch;
  height: 75vh;
  overflow-y: scroll;
  margin: auto;
  padding: 10px;
  border-radius: 12px;
  background-color: #001119;
}

.testimonial {
  font-size: 18px;
  margin: 16px;
  padding: 10px;
  border-top: 4px solid #11967e;
  border-radius: 8px;
  background-color: #00557f;
}
```
