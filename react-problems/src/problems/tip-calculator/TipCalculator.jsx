import { useState } from "react";

export default function TipCalculator() {
  const [bill, setBill] = useState(50);
  const [tipPercentage, setTipPercentage] = useState(18);
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  return (
    <>
      <label htmlFor="bill">Bill</label>
      <input
        type="number"
        id="bill"
        name="bill"
        value={bill}
        onChange={(event) => setBill(event.target.value)}
      />
      <label htmlFor="tipPercentage">Tip Percentage</label>
      <input
        type="number"
        id="tipPercentage"
        name="tipPercentage"
        value={tipPercentage}
        onChange={(event) => setTipPercentage(event.target.value)}
      />
      <label htmlFor="numberOfPeople">Number of People</label>
      <input
        type="number"
        id="numberOfPeople"
        name="numberOfPeople"
        value={numberOfPeople}
        onChange={(event) => setNumberOfPeople(event.target.value)}
      />
      <p>
        Total Tip:{" "}
        {bill && tipPercentage
          ? `$${(bill * tipPercentage * 0.01).toFixed(2)}`
          : "-"}
      </p>
      <p>
        Tip Per Person:{" "}
        {bill && tipPercentage && numberOfPeople
          ? `$${((bill * tipPercentage * 0.01) / numberOfPeople).toFixed(2)}`
          : "-"}
      </p>
    </>
  );
}
