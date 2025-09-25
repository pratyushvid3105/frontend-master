import { useEffect, useState } from "react";

const QUIZ_API_BASE_URL = "/api/fe/quiz";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      const response = await fetch(QUIZ_API_BASE_URL);
      const data = await response.json();
      setQuestions(data);
    };
    fetchQuiz();
  }, []);

  if (questions === null) return null;

  const updateSelectedAnswer = (questionIndex, answerIndex) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <>
      <h1>{currentQuestion?.question}</h1>
      {currentQuestion?.answers.map((answer, answerIndex) => {
        const chosenAnswer = selectedAnswers[currentQuestionIndex];
        let className = "answer";
        if (chosenAnswer === answerIndex) {
          className +=
            chosenAnswer === currentQuestion.correctAnswer
              ? " correct"
              : " incorrect";
        }

        return (
          <h2
            key={answer}
            className={className}
            onClick={() => {
              if (selectedAnswers[currentQuestionIndex] === undefined) {
                updateSelectedAnswer(currentQuestionIndex, answerIndex);
              }
            }}
          >
            {answer}
          </h2>
        );
      })}
      <button
        disabled={isFirstQuestion}
        onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
      >
        Back
      </button>
      <button
        disabled={
          isLastQuestion || selectedAnswers[currentQuestionIndex] === undefined
        }
        onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
      >
        Next
      </button>
    </>
  );
}
