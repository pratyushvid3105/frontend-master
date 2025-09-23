# Question List Solution - Step-by-Step Explanation

## Overview

This React component implements a question list interface that fetches questions and user submissions from APIs, then displays them organized by category with visual status indicators.

## Architecture Pattern

The solution uses a **component composition** pattern with clear separation of concerns:

- Main component handles data flow
- Utility functions handle data transformation
- Custom hook manages API calls
- Sub-components handle rendering

## Step-by-Step Breakdown

### 1. **Main Component Structure**

```javascript
export default function QuestionList() {
  const [questions, submissions] = useQuestionsAndSubmissions();
  const questionsByCategory = getQuestionsByCategory(questions);
  const submissionsByQuestion = getSubmissionsByQuestion(submissions);
  const categories = Object.keys(questionsByCategory);

  return (
    <>
      {categories.map((category) => (
        <Category key={category} ... />
      ))}
    </>
  );
}
```

**Data Flow:**

1. **Fetch Data**: Uses custom hook to get questions and submissions
2. **Transform Data**: Converts arrays to organized objects
3. **Extract Categories**: Gets unique category names
4. **Render**: Maps over categories to create Category components

### 2. **Custom Hook for API Management**

```javascript
function useQuestionsAndSubmissions() {
  const [questions, setQuestions] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [questionsResponse, submissionsResponse] = await Promise.all([
        fetch(QUESTIONS_API_BASE_URL),
        fetch(SUBMISSIONS_API_BASE_URL),
      ]);
      // Process responses...
    };
    fetchData();
  }, []);

  return [questions, submissions];
}
```

**Key Features:**

- **Parallel Requests**: Uses `Promise.all()` for simultaneous API calls
- **State Management**: Separate state for each data type
- **Single Effect**: One useEffect manages both API calls
- **Return Pattern**: Returns array for destructuring assignment

### 3. **Data Transformation Functions**

#### **Group Questions by Category**

```javascript
function getQuestionsByCategory(questions) {
  const questionsByCategory = {};
  questions.forEach(({ category, ...question }) => {
    if (!questionsByCategory[category]) {
      questionsByCategory[category] = [];
    }
    questionsByCategory[category].push(question);
  });
  return questionsByCategory;
}
```

**Transform:** Array → Object with category keys
**Input:** `[{category: "HTML", id: "form", name: "Form"}]`
**Output:** `{"HTML": [{id: "form", name: "Form"}]}`

#### **Index Submissions by Question ID**

```javascript
function getSubmissionsByQuestion(submissions) {
  const submissionsByQuestion = {};
  submissions.forEach(({ questionId, status }) => {
    submissionsByQuestion[questionId] = status;
  });
  return submissionsByQuestion;
}
```

**Transform:** Array → Object for O(1) lookups
**Input:** `[{questionId: "form", status: "CORRECT"}]`
**Output:** `{"form": "CORRECT"}`

### 4. **Category Component**

```javascript
function Category({ category, questions, submissionsByQuestion }) {
  const totalQuestions = questions.length;
  const correctSubmissions = questions.reduce((sum, question) => {
    return submissionsByQuestion[question.id] === "CORRECT" ? sum + 1 : sum;
  }, 0);

  return (
    <div className="category">
      <h2>{category} - {correctSubmissions} / {totalQuestions}</h2>
      {questions.map((question) => (
        <Question key={question.id} ... />
      ))}
    </div>
  );
}
```

**Calculations:**

- **Total Count**: Simple array length
- **Correct Count**: Reduce function with conditional increment
- **Display Format**: "Category X / Y" as specified

### 5. **Question Component**

```javascript
function Question({ question, submissionsByQuestion }) {
  return (
    <div className="question">
      <div
        className={`status ${
          submissionsByQuestion[question.id]
            ? submissionsByQuestion[question.id].toLowerCase().replace("_", "-")
            : "unattempted"
        }`}
      ></div>
      <h3>{question.name}</h3>
    </div>
  );
}
```

**Status Logic:**

1. **Lookup**: Check if submission exists for question ID
2. **Transform**: Convert "PARTIALLY_CORRECT" → "partially-correct"
3. **Fallback**: Use "unattempted" if no submission found
4. **CSS Classes**: Combines "status" + transformed status

## Key Implementation Patterns

### **Performance Optimizations**

- **Single API Call**: Fetches both datasets once on mount
- **Parallel Requests**: Uses Promise.all() to avoid sequential delays
- **Data Indexing**: Converts arrays to objects for O(1) lookups
- **Component Keys**: Proper key props prevent unnecessary re-renders

### **Data Processing Strategy**

- **Separation of Concerns**: Pure functions handle data transformation
- **Immutable Operations**: Functions don't modify original data
- **Error Resilience**: Safe property access with fallbacks

### **Component Design**

- **Props Down**: Data flows down through component tree
- **Single Responsibility**: Each component has one clear purpose
- **Composition**: Small, focused components that compose together

### **Status Handling Requirements**

- **Status Mapping**: Handles all specified status types (CORRECT, PARTIALLY_CORRECT, etc.)
- **String Transformation**: Converts underscores to hyphens for CSS classes
- **Default State**: Shows "unattempted" for questions without submissions

## Data Flow Summary

1. **Mount** → Custom hook triggers API calls
2. **APIs Complete** → Raw data stored in state
3. **Transform** → Utility functions organize data
4. **Render** → Components map over organized data
5. **Display** → Categories with questions and status indicators

This architecture provides clean separation between data fetching, processing, and presentation while maintaining good performance through efficient data structures and minimal re-renders.
