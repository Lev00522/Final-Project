
const difficultyForm = document.getElementById('difficulty-form'); // Get the form where user selects difficulty
const answerFormElement = document.getElementById('answer-form'); // Get the element where checkboxes for answers will be displayed
const quizContainer = document.getElementById('quiz-container'); // Get the container that holds the quiz questions and answers
const questionElement = document.getElementById('question'); // Get the element that displays the question
const submitAnswerButton = document.getElementById('submit-answer'); // Get the button to submit the answer
const resultPromot = document.getElementById('result'); // Get the element that shows whether the answer was correct or incorrect
const correctCountElement = document.getElementById('correct-count'); // Get the element to display the number of correct answers
const incorrectCountElement = document.getElementById('incorrect-count'); // Get the element to display the number of incorrect answers
const resetScoreButton = document.getElementById('reset-score'); // Get the button to reset the score
const restartQuizButton = document.getElementById('restart-quiz'); // Get the button to restart the quiz

let questions = []; // Array to store the fetched quiz questions
let correctCount = parseInt(localStorage.getItem('correctCount')) || 0; // Retrieve correct answer count from localStorage, or set to 0
let incorrectCount = parseInt(localStorage.getItem('incorrectCount')) || 0; // Retrieve incorrect answer count from localStorage, or set to 0

// Function to update the score display
function updateScoreDisplay() {
    correctCountElement.textContent = correctCount; // Update the text for correct answers
    incorrectCountElement.textContent = incorrectCount; // Update the text for incorrect answers
}

updateScoreDisplay(); // Call the function to display the current score

// Handle the form submission for selecting the difficulty level
difficultyForm.addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent the form from submitting and reloading the page
    const difficulty = document.getElementById('difficulty').value; // Get the selected difficulty level from the dropdown

    try {
        // Fetch questions from the quiz API based on the selected difficulty
        const response = await fetch(`https://quizapi.io/api/v1/questions?apiKey=W5KmQE4tGNZnBiXPoyWMsg0e0nLkt265vjH7ISed&limit=1&difficulty=${difficulty}`);
        questions = await response.json(); // Parse the response into a JSON object
        if (questions.length > 0) { // If there are questions, start the quiz
            startQuiz();
        }
    } catch (error) {
        console.error('Error fetching quiz data:', error); // If an error occurs during fetching, log it
    }
});

// Function to start the quiz
function startQuiz() {
    displayQuestion(); // Display the question after starting the quiz
    quizContainer.classList.remove('hidden'); // Show the quiz container
    difficultyForm.classList.add('hidden'); // Hide the difficulty selection form
}

// Function to display the current question and options
function displayQuestion() {
    const questionData = questions[0]; // Get the first question from the fetched questions
    questionElement.textContent = questionData.question; // Display the question text

    // Clear any previous answers (in case the question changes)
    answerFormElement.innerHTML = '';

    // Populate the checkboxes with answers for the current question
    Object.entries(questionData.answers).forEach(function ([key, answer]) {
        if (answer) { // If an answer exists
            const label = document.createElement('label'); // Create a label element
            const checkbox = document.createElement('input'); // Create a checkbox input element
            checkbox.type = 'checkbox'; // Set the type to checkbox
            checkbox.name = key; // Set the checkbox's name attribute
            checkbox.value = answer; // Set the value of the checkbox to the answer text
            checkbox.dataset.correct = questionData.correct_answers[`${key}_correct`] === 'true'; // Store if this answer is correct using a data attribute

            label.appendChild(checkbox); // Append the checkbox inside the label
            label.appendChild(document.createTextNode(answer)); // Append the answer text inside the label

            answerFormElement.appendChild(label); // Add the label (with checkbox and text) to the answer form
            answerFormElement.appendChild(document.createElement('br')); // Add a line break between each answer
        }
    });

    submitAnswerButton.classList.remove('hidden'); // Show the submit answer button
    resultPromot.textContent = ''; // Clear the previous result message (if any)
}

// Function to get the correct answers for the current question
function getCorrectAnswers(questionData) {
    const correctAnswers = []; // Initialize an array to store correct answers

    // Loop through all possible answers and check if they are marked as correct
    for (const [key, answer] of Object.entries(questionData.answers)) {
        if (questionData.correct_answers[`${key}_correct`] === 'true') { // If the answer is correct
            correctAnswers.push(answer); // Add it to the correct answers array
        }
    }

    return correctAnswers; // Return the array of correct answers
}

// Function to handle the answer selection and evaluation
function selectAnswer() {
    // Get all selected checkboxes (those that are checked)
    const selectedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const selectedAnswers = Array.from(selectedCheckboxes).map(function (checkbox) {
        return checkbox.value; // Extract the values of the checked checkboxes into an array
    });

    // If no answers are selected, show an alert
    if (selectedAnswers.length === 0) {
        alert('Please select at least one answer.');
        return; // Stop the function if no answer is selected
    }

    const questionData = questions[0]; // Get the first question (since we only have one question at a time)
    const correctAnswers = getCorrectAnswers(questionData); // Get the correct answers using the function

    // Check if all selected answers are correct and if the number of selected answers matches the correct answers
    const isCorrect = selectedAnswers.every(function (answer) {
        return correctAnswers.includes(answer);
    }) && selectedAnswers.length === correctAnswers.length;

    // Display the result based on whether the selected answers are correct
    if (isCorrect) {
        resultPromot.textContent = 'Correct!'; // Display "Correct!" if all answers are right
        correctCount++; // Increment the correct answer count
    } else {
        resultPromot.textContent = 'Incorrect!'; // Display "Incorrect!" if any answer is wrong
        incorrectCount++; // Increment the incorrect answer count
    }

    // Save the updated scores to localStorage
    localStorage.setItem('correctCount', correctCount);
    localStorage.setItem('incorrectCount', incorrectCount);
    updateScoreDisplay(); // Update the score display
    submitAnswerButton.classList.add('hidden'); // Hide the submit button after an answer is selected

    // Reload the page after a short delay (1500ms)
    setTimeout(reloadPage, 1500);
}

submitAnswerButton.addEventListener('click', selectAnswer); // Listen for the button click to submit the answer

// Function to reload the page
function reloadPage() {
    window.location.reload(); // Reload the current page
}

// Handle the reset score button click
resetScoreButton.addEventListener('click', function () {
    correctCount = 0; // Reset the correct count to 0
    incorrectCount = 0; // Reset the incorrect count to 0
    localStorage.setItem('correctCount', correctCount); // Save the reset correct count
    localStorage.setItem('incorrectCount', incorrectCount); // Save the reset incorrect count
    updateScoreDisplay(); // Update the score display
});

// Handle the restart quiz button click
restartQuizButton.addEventListener('click', function () {
    correctCount = 0; // Reset the correct count to 0
    incorrectCount = 0; // Reset the incorrect count to 0
    localStorage.setItem('correctCount', correctCount); // Save the reset correct count
    localStorage.setItem('incorrectCount', incorrectCount); // Save the reset incorrect count
    updateScoreDisplay(); // Update the score display
    difficultyForm.classList.remove('hidden'); // Show the difficulty selection form again
});
