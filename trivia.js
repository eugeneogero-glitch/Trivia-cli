const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const triviaQuestions = [
  {
    question: "What does HTML stand for?",
    options: [
      "1. Hyper Text Markup Language",
      "2. High Tech Modern Language",
      "3. Hyper Transfer Markup Language",
      "4. Home Tool Markup Language"
    ],
    answer: 1
  },
  {
    question: "Which CSS property is used to change the background color?",
    options: [
      "1. color",
      "2. background-color",
      "3. border-color",
      "4. text-color"
    ],
    answer: 2
  },
  {
    question: "Inside which HTML element do we put the JavaScript file?",
    options: [
      "1. <javascript>",
      "2. <js>",
      "3. <script>",
      "4. <scripting>"
    ],
    answer: 3
  },
  {
    question: "Which array method creates a new array with all elements that pass a test?",
    options: [
      "1. map()",
      "2. filter()",
      "3. reduce()",
      "4. forEach()"
    ],
    answer: 2
  },
  {
    question: "What is the output of typeof null in JavaScript?",
    options: [
      "1. 'null'",
      "2. 'undefined'",
      "3. 'object'",
      "4. 'number'"
    ],
    answer: 3
  }
];

let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let timeLeft = 15;

function startQuiz() {
  console.clear();
  console.log("========================================");
  console.log("      WELCOME TO THE TRIVIA CLI GAME    ");
  console.log("========================================");
  console.log(`You have ${timeLeft} seconds to answer each question.`);
  console.log("Type the option number (1-4) and press Enter.\n");

  rl.question("Press 's' and Enter to start: ", (input) => {
    if (input.trim().toLowerCase() === 's') {
      runQuestion();
    } else {
      console.log("Invalid input. Let's try again.");
      startQuiz();
    }
  });
}

function runQuestion() {
  if (currentQuestionIndex >= triviaQuestions.length) {
    endGame();
    return;
  }

  const q = triviaQuestions[currentQuestionIndex];
  console.log(`\n----------------------------------------`);
  console.log(`Question ${currentQuestionIndex + 1} of ${triviaQuestions.length}:`);
  console.log(q.question);
  
  q.options.forEach(option => console.log(option));
  console.log(`----------------------------------------`);

  timeLeft = 15;
  
  const timerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      console.log("\nTime's up for this question!");
      userAnswers.push({ question: q.question, selected: "Time Out", correct: false });
      currentQuestionIndex++;
      runQuestion();
    }
  }, 1000);

  rl.question("\nYour answer (1-4): ", (answerInput) => {
    clearInterval(timerInterval);
    
    const selectedOption = parseInt(answerInput.trim());

    if (isNaN(selectedOption) || selectedOption < 1 || selectedOption > 4) {
      console.log("Invalid choice. Please enter a number between 1 and 4.");
      currentQuestionIndex--;
    } else {
      const isCorrect = selectedOption === q.answer;
      if (isCorrect) {
        console.log("Correct!");
        score++;
      } else {
        console.log(`Incorrect. The correct answer was option ${q.answer}.`);
      }

      userAnswers.push({
        question: q.question,
        selected: q.options[selectedOption - 1],
        correct: isCorrect
      });
    }

    currentQuestionIndex++;
    
    setTimeout(() => {
      runQuestion();
    }, 1000);
  });
}

function endGame() {
  console.clear();
  console.log("========================================");
  console.log("             GAME OVER                  ");
  console.log("========================================");
  console.log(`Final Score: ${score} out of ${triviaQuestions.length}`);
  
  const percentage = (score / triviaQuestions.length) * 100;
  console.log(`Percentage: ${percentage}%`);

  if (percentage >= 80) {
    console.log("Excellent job! You nailed it.");
  } else if (percentage >= 50) {
    console.log("Good effort! Keep practicing.");
  } else {
    console.log("Needs improvement. Review your JavaScript fundamentals!");
  }

  console.log("\n--- Performance Summary ---");
  
  const correctCount = userAnswers.filter(ans => ans.correct).length;
  console.log(`Total Correct: ${correctCount}`);

  console.log("\nReview of your answers:");
  userAnswers.map((item, index) => {
    const status = item.correct ? "Correct" : "Incorrect";
    console.log(`${index + 1}. [${status}] ${item.question}`);
  });

  console.log("\n========================================");
  console.log("Thank you for playing Trivia CLI!");
  rl.close();
}

startQuiz();