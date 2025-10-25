import { useState } from "react";

export default function PhoneInput() {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(format(event.target.value));
  };

  return (
    <>
      <input
        type="tel"
        placeholder="(555) 555-5555"
        value={inputValue}
        onChange={handleInputChange}
      />
      <button
        disabled={inputValue.length !== 14}
        onClick={() => setInputValue("")}
      >
        Submit
      </button>
    </>
  );
}

function format(str) {
  const value = str.replace(/\D/g, "");
  let result = "";
  if (value.length > 0) {
    result += "(";
    result += value.substring(0, 3);
  }
  if (value.length > 3) {
    result += ") ";
    result += value.substring(3, 6);
  }
  if (value.length > 6) {
    result += "-";
    result += value.substring(6, 10);
  }
  return result;
}
