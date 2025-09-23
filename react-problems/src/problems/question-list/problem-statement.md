# Question List ⚪⭐

**Category:** React Components

This question has pre-written CSS code, accessible below.

You're given a CSS file for the FrontendExpert question list, and you need to implement the component using React.

When the component initially mounts, it should make two API requests:

• **https://api.frontendexpert.io/api/fe/questions** returns a list of all of the questions as JSON in this format:

```json
[
  {
    "category": "HTML",
    "id": "sign-up-form",
    "name": "Sign-Up Form"
  },
  ...
]
```

• **https://api.frontendexpert.io/api/fe/submissions** returns a list of the user's most recent submissions as JSON in this format:

```json
[
  {
    "questionId": "blog-post",
    "status": "CORRECT"
  },
  ...
]
```

The component should render a fragment containing all of the categories. Each category is a div with a heading and one or more question divs. Each category div should have a **category** CSS class, and each question should have a **question** CSS class.

The category heading is an **h2** with the text of the name of the category and how many correct submissions there are for questions in that category (correct questions have the "CORRECT" status). For example, if 1 out of 5 CSS questions have a "CORRECT" status, the category heading would read **CSS 1 / 5**.

The question divs should first contain another div for the status. This status div should have the CSS class of **status** and a CSS class based on the current status. If the question exists in the submissions API output, that status should be converted to lowercase, any **\_**'s should be replaced with a **-**, and the resulting string should be used as a CSS class. For example, if a submission status is **PARTIALLY_CORRECT**, the complete CSS class of the status div would be **status partially-correct**. If there is no status in the submissions response, the status class should be **status unattempted**.

After the status div, each question should also contain an **h3** with the title of the question.

The complete output of a category might look something like this:

```html
<div class="category">
  <h2>CSS - 1 / 5</h2>
  <div class="question">
    <div class="status incorrect"></div>
    <h3>Rainbow Circles</h3>
  </div>
  <div class="question">
    <div class="status partially-correct"></div>
    <h3>Navbar</h3>
  </div>
</div>
```

Your component has already been rendered to the DOM inside of a **#root** div directly in the body with the CSS imported.

## CSS Code

```css
body {
  background-color: #f6f9fc;
}

h1 {
  text-align: center;
  margin: 0;
}

#root {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

h2 {
  margin: 0;
}

.category {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.question {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: white;
  padding: 10px;
  border-right: 25px solid #119676;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 20%) 0px 1px 2px;
}

h3 {
  margin: 0;
  color: #119676;
  cursor: pointer;
  transition: 0.5s color;
}

h3:hover {
  color: black;
}

.status {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.correct {
  background: linear-gradient(#04ff00, #369536);
}

.partially-correct {
  background: linear-gradient(#fbf82b, #ffc63b);
}

.incorrect {
  background: linear-gradient(#ff0000, #760000);
}

.unattempted {
  background-color: transparent;
  border: 1px solid #6772e54d;
}
```
