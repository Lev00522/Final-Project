document.addEventListener('DOMContentLoaded', () => {
    const difficultyForm = document.getElementById('difficulty-form');
    const answerFormElement = document.getElementById('answer');
    const quizContainer = document.getElementById('quiz-container');
    const questionElement = document.getElementById('question');
    const submitAnswerButton = document.getElementById('submit-answer');
    const resultPromot = document.getElementById('result');
    const correctCountElement = document.getElementById('correct-count');
    const incorrectCountElement = document.getElementById('incorrect-count');
    const resetScoreButton = document.getElementById('reset-score');
    const restartQuizButton = document.getElementById('restart-quiz');



    let questions = [];
    let currentQuestionIndex = 0;
    let correctCount = parseInt(localStorage.getItem('correctCount')) || 0;
    let incorrectCount = parseInt(localStorage.getItem('incorrectCount')) || 0;

    // Update score display
    const updateScoreDisplay = () => {
        correctCountElement.textContent = correctCount;
        incorrectCountElement.textContent = incorrectCount;
    };

    updateScoreDisplay();

    // Handle difficulty form submission
    difficultyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const difficulty = document.getElementById('difficulty').value;

        try {
            const response = await fetch(`https://quizapi.io/api/v1/questions?apiKey=W5KmQE4tGNZnBiXPoyWMsg0e0nLkt265vjH7ISed&limit=1&difficulty=${difficulty}`);
            questions = await response.json();
            if (questions.length > 0) {
                startQuiz();
            }
        } catch (error) {
            console.error('Error fetching quiz data:', error);
        }
    });

    const startQuiz = () => {
        currentQuestionIndex = 0;

        displayQuestion();
        quizContainer.classList.remove('hidden');
        difficultyForm.classList.add('hidden');
    };

    const displayQuestion = () => {
        const questionData = questions[currentQuestionIndex];
        questionElement.textContent = questionData.question;

        // Clear previous answers
        answerFormElement.innerHTML = '';

        // Populate the dropdown with answers
        Object.entries(questionData.answers).forEach(([key, answer]) => {
            if (answer) {
                const option = document.createElement('option');
                option.textContent = answer;
                option.value = answer;
                // Store the correct answer info in a data attribute
                option.dataset.correct = questionData.correct_answers[`${key}_correct`] === 'true';
                answerFormElement.appendChild(option);
            }
        });


        submitAnswerButton.classList.remove('hidden');
        resultPromot.textContent = '';
    };

    const selectAnswer = () => {
        const selectedOption = answerFormElement.value;
        if (!selectedOption) {
            alert('Please select an answer.');
            return;
        }

        const questionData = questions[currentQuestionIndex];
        const correctAnswer = Object.entries(questionData.answers).find(([key, answer]) => {
            return answer === selectedOption && questionData.correct_answers[`${key}_correct`] === 'true';
        });

        if (correctAnswer) {
            resultPromot.textContent = 'Correct!';
            correctCount++;
        } else {
            resultPromot.textContent = 'Incorrect!';
            incorrectCount++;
        }

        localStorage.setItem('correctCount', correctCount);
        localStorage.setItem('incorrectCount', incorrectCount);
        updateScoreDisplay();
        submitAnswerButton.classList.add('hidden');

        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            setTimeout(displayQuestion, 1000);
        } else {
            setTimeout(reloadPage, 1500);
        }
    };

    submitAnswerButton.addEventListener('click', selectAnswer);

    const reloadPage = () => {
        window.location.reload();
    };

    resetScoreButton.addEventListener('click', () => {
        correctCount = 0;
        incorrectCount = 0;
        localStorage.setItem('correctCount', correctCount);
        localStorage.setItem('incorrectCount', incorrectCount);
        updateScoreDisplay();
    });

    restartQuizButton.addEventListener('click', () => {
        correctCount = 0;
        incorrectCount = 0;
        localStorage.setItem('correctCount', correctCount);
        localStorage.setItem('incorrectCount', incorrectCount);
        updateScoreDisplay();
        difficultyForm.classList.remove('hidden');
    });
});
