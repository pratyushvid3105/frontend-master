# Quiz Solution - Step-by-Step Explanation

## Overview

This React component implements a multiple-choice quiz interface that fetches questions from an API and provides navigation between questions while tracking user selections.

## Step-by-Step Breakdown

### 1. **State Management Structure**

```javascript
const [questions, setQuestions] = useState([]);
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [selectedAnswers, setSelectedAnswers] = useState([]);
```

**State Variables:**

- `questions`: Array of question objects from the API
- `currentQuestionIndex`: Index of currently displayed question (0-based)
- `selectedAnswers`: Array tracking selected answer index for each question

**Design Decision:** Uses array indexing to match question positions with selected answers, allowing easy navigation between questions while preserving selections.

### 2. **API Data Fetching**

```javascript
useEffect(() => {
  const fetchQuiz = async () => {
    const response = await fetch(QUIZ_API_BASE_URL);
    const data = await response.json();
    setQuestions(data);
  };
  fetchQuiz();
}, []);
```

**Implementation:**

- Single useEffect with empty dependency array runs once on mount
- Async function handles the API call and JSON parsing
- Updates questions state when data arrives

### 3. **Answer Selection Logic**

```javascript
const updateSelectedAnswer = (questionIndex, answerIndex) => {
  const newSelectedAnswers = [...selectedAnswers];
  newSelectedAnswers[questionIndex] = answerIndex;
  setSelectedAnswers(newSelectedAnswers);
};
```

**Key Features:**

- Creates new array copy (immutability)
- Stores answer by question index, not current question
- Allows answers to persist when navigating between questions

### 4. **Dynamic CSS Class Assignment**

```javascript
let className = "answer";
if (chosenAnswer === answerIndex) {
  className +=
    chosenAnswer === currentQuestion.correctAnswer ? " correct" : " incorrect";
}
```

**Logic Flow:**

1. Start with base "answer" class
2. Check if this answer is the selected one for current question
3. If selected, compare with correctAnswer to add "correct" or "incorrect"
4. Unselected answers remain with just "answer" class

### 5. **Click Protection Mechanism**

```javascript
onClick={() => {
  if (selectedAnswers[currentQuestionIndex] === undefined) {
    updateSelectedAnswer(currentQuestionIndex, answerIndex);
  }
}}
```

**Protection Strategy:**

- Only allows selection if no answer chosen yet for current question
- Uses `undefined` check rather than truthy check
- Prevents changing answers once selected (requirement compliance)

### 6. **Navigation Button Logic**

#### **Back Button:**

```javascript
<button
  disabled={isFirstQuestion}
  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
>
  Back
</button>
```

#### **Next Button:**

```javascript
<button
  disabled={
    isLastQuestion || selectedAnswers[currentQuestionIndex] === undefined
  }
  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
>
  Next
</button>
```

**Button Rules:**

- **Back**: Disabled only on first question
- **Next**: Disabled on last question OR when no answer selected
- Both use functional state updates for safety

### 7. **Conditional Rendering Pattern**

```javascript
if (questions === null) return null;

const currentQuestion = questions[currentQuestionIndex];

return (
  <>
    <h1>{currentQuestion?.question}</h1>
    {currentQuestion?.answers.map((answer, answerIndex) => {
      // Render logic
    })}
  </>
);
```

**Safety Measures:**

- Early return prevents rendering before data loads
- Optional chaining (`?.`) prevents errors during loading
- Defensive programming approach

## Key Implementation Patterns

### **State Synchronization**

- `selectedAnswers` array length can differ from `questions` length initially
- Uses array indexing to maintain question-answer relationships
- Handles sparse arrays where some questions may not have selections

### **Immutable Updates**

- Spreads existing array before modification
- Follows React best practices for state updates
- Ensures proper re-renders when selections change

### **Performance Considerations**

- Single API call on mount
- Minimal re-renders through targeted state updates
- Efficient array operations for answer tracking

### **User Experience Features**

- Preserves selections when navigating back/forward
- Visual feedback through CSS classes
- Clear button state management prevents invalid actions
- Graceful loading state handling

## Data Flow Summary

1. **Mount** → API call fetches questions
2. **Questions Load** → First question displays
3. **Answer Click** → Updates selectedAnswers array at current index
4. **Navigation** → Changes currentQuestionIndex, preserves selections
5. **Render** → Shows current question with appropriate CSS classes

## Requirements Compliance

✅ **API Integration**: Fetches from correct endpoint on mount
✅ **Question Display**: H1 for question, H2 for answers
✅ **Answer Selection**: One-time selection per question
✅ **CSS Classes**: Dynamic "correct"/"incorrect" assignment
✅ **Navigation**: Back/Next buttons with proper disable logic
✅ **State Persistence**: Selections preserved during navigation

This architecture provides robust quiz functionality while maintaining clean separation between data management, user interaction, and presentation concerns.
