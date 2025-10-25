# Phone Input 🔵⭐

**Category:** React Components

You're given a CSS file for a phone input, and you need to implement the component using React.

## Component Requirements

The component should return two elements, the input and a submit button.

## Input Functionality

The input has the following functionality:

- **Non-numeric characters:** Typing any character except a number has no effect.

- **After first number:** After typing the first number, a "(" is added before that first number. For example, "(1".

- **After fourth number:** After typing the fourth number, a ") " is added before that new number. For example, "(123) 4". Note there is a space after the closing parenthesis.

- **After seventh number:** After typing the seventh number, a "-" is added before that new number. For example, "(123) 456-7".

- **Maximum length:** No more than 10 numbers can be typed, meaning a completed phone number looks like "(123) 456-7890".

- **Multiple numbers:** If multiple numbers are typed at once, the same formatting rules apply as if they were typed one at a time.

- **Backspace:** Pressing backspace removes one number at a time, including any corresponding formatting characters.

- **Empty placeholder:** If the input is empty, it has a placeholder of "(555) 555-5555".

## Submit Button

To the left of the input is a button with the text of "Submit" and the following characteristics:

- **Disabled state:** If the input does not have a complete phone number, the button is disabled.

- **Click behavior:** Clicking the button when it is enabled clears the input, including any formatting characters.

Your component has already been rendered to the DOM inside of a `#root` div directly in the body with the CSS imported.

## CSS Styling

```css
input:not([type="button"]),
[type="submit"] {
  width: 300px;
  padding: 10px;
  border-radius: 8px;
  border: 2px solid #028080;
  font-size: 18px;
  outline: none;
}

button,
input[type="button"],
input[type="submit"] {
  margin-left: 10px;
  cursor: pointer;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  background-color: #02203c;
  color: white;
  transition: 0.5s;
}

button:disabled,
input[type="button"]:disabled,
input[type="submit"]:disabled {
  background-color: grey;
  color: black;
}
```
