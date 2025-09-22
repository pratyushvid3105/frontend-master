# Tip Calculator 🟢⭐

**Category:** React Components

This question has pre-written CSS code, accessible below.

You're given a CSS file for a tip calculator, and you need to implement the component using React.

The tip calculator should have 3 number inputs in this order, each with an associated label:

• **Bill**: The total price of a bill, defaulting to 50.
• **Tip Percentage**: The percentage that the user is tipping, defaulting to 18.
• **Number of People**: The number of people splitting the bill, defaulting to 1.

Below the inputs are two paragraphs. The first paragraph displays the total tip, rounded to two decimal places. The total tip is calculated by multiplying the bill value by the percentage value (which must be converted to a percentage). For example, if the bill was $50 and the tip percentage was 18%, the first paragraph would read: "Total Tip: $9.00".

The second paragraph displays the tip per person, rounded to two decimal places. The tip per person is calculated by dividing the total tip by the number of people splitting the bill. For example, if the total tip was $9.00 and two people are splitting the bill, the second paragraph would read: "Tip Per Person: $4.50".

If any of the values needed to calculate the total tip or the tip per person are empty strings, then the resulting numbers should be replaced by the "-" character without a "$". For example, the second paragraph might read "Tip Per Person: -" in this case. For simplicity, you do not need to handle the case where a user types in 0 or a negative number for any of the inputs.

Your component has already been rendered to the DOM inside of a **#root** div directly in the body with the CSS imported.

## CSS Code

```css
#root {
  background-color: lightgrey;
  width: fit-content;
  padding: 10px;
  border-radius: 10px;
}

label {
  display: block;
  font-weight: bold;
}

input {
  display: block;
  width: 100%;
  margin-bottom: 10px;
}

p {
  text-align: right;
}
```
