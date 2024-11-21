document.addEventListener('DOMContentLoaded', () => {
    const difficultyForm = document.getElementById('difficulty-form');
    const answerForm = document.getElementById('difficulty-form');
    const quizContainer = document.getElementById('quiz-container');
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const answerformElement = document.getElementById('answer1');
    const submitAnswerButton = document.getElementById('submit-answer');
    const resultElement = document.getElementById('result');
    const correctCountElement = document.getElementById('correct-count');
    const incorrectCountElement = document.getElementById('incorrect-count');
    const resetScoreButton = document.getElementById('reset-score');
    // const finalScoreContainer = document.getElementById('final-score-container');

    // const finalIncorrectCountElement = document.getElementById('final-incorrect-count');
    const restartQuizButton = document.getElementById('restart-quiz');
    const currentQuestionElement = document.getElementById('current-question');
    const totalQuestionsElement = document.getElementById('total-questions');
    const navLinks = document.querySelectorAll('nav a');


    let questions = [];
    let currentQuestionIndex = 0;
    let correctCount = parseInt(localStorage.getItem('correctCount')) || 0;
    let incorrectCount = parseInt(localStorage.getItem('incorrectCount')) || 0;

    const updateScoreDisplay = () => {
        correctCountElement.textContent = correctCount;
        incorrectCountElement.textContent = incorrectCount;
    };

    updateScoreDisplay();

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    difficultyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const difficulty = document.getElementById('difficulty').value;

        try {
            const response = await fetch(`https://quizapi.io/api/v1/questions?apiKey=W5KmQE4tGNZnBiXPoyWMsg0e0nLkt265vjH7ISed&limit=1&difficulty=`);
            questions = await response.json();
            if (questions.length > 0) {
                startQuiz();
                //remove
                const questionData = questions[currentQuestionIndex];
                questionElement.textContent = questionData.question;
                alert(Object.entries(questionData.correct_answers));
            } else {
                alert('No questions available for the selected difficulty.');
            }
        } catch (error) {
            console.error('Error fetching quiz data:', error);
        }
    });

    const startQuiz = () => {
        currentQuestionIndex = 0;
        totalQuestionsElement.textContent = questions.length;
        displayQuestion();
        quizContainer.classList.remove('hidden');
        difficultyForm.classList.add('hidden');
        // finalScoreContainer.classList.add('hidden');
        resultElement.textContent = '';
    };

    const displayQuestion = () => {
        const questionData = questions[currentQuestionIndex];
        questionElement.textContent = questionData.question;

        // answersElement.innerHTML = '';
        // Object.entries(questionData.answers).forEach(([key, answer]) => {
        //     if (answer) {
        //         const button = document.createElement('button');
        //         button.textContent = answer;
        //         button.dataset.correct = questionData.correct_answers[`${key}_correct`] === 'true';
        //         button.addEventListener('click', () => selectAnswer(button));
        //         answersElement.appendChild(button);
        //     }
        // });


        answerformElement.innerHTML = '';
        Object.entries(questionData.answers).forEach(([key, answer]) => {
            //
            if (answer) {
  
                const option = document.createElement('option');
                // const answerForm=document.createElement('answerForm');
                // form.textContent=answerForm.value;
                // const answerSelected = document.getElementById('answer1').value;
                option.textContent = answer;
                //ASSIGN CORRECT ANSWER FROM API TO LOCAL
                option.dataset.correct = questionData.correct_answers[`${key}_correct`] === 'true';
                option.addEventListener('click', () => selectAnswer(option));
                answerformElement.appendChild(option);

                // ASSIGN CORRECT ANSWER FROM API TO LOCAL 

                const form = document.createElement('form');
                form.textContent = answer;
                form.dataset.correct = questionData.correct_answers[`${key}_correct`] === 'true';
                form.addEventListener('submit', () => selectAnswer(form));
                answerformElement.appendChild(form);
            }

        });



        currentQuestionElement.textContent = currentQuestionIndex + 1;
        submitAnswerButton.classList.remove('hidden');
        resultElement.textContent = '';
    };

    // const selectAnswer = (answerSelected) => {
    //     const buttons = answersElement.querySelectorAll('button');
    //     buttons.forEach(button => {
    //         button.classList.remove('selected');
    //         button.disabled = true;
    //     });
    //     answerSelected.classList.add('selected');
    //     answerSelected.disabled = false;
    // };




    const selectAnswer = (answerSelected) => {
        const answer = answerformElement.querySelectorAll('answer');
        // const answer = document.getElementById('answer1').value;
        console.log(answer);
        answer.forEach(answer => {
            answer.classList.remove('selected');
            answer.disabled = true;
        });
        answerSelected.classList.add('selected');
        answerSelected.disabled = false;
    };

    submitAnswerButton.addEventListener('click', () => {
        // const answerSelected = answersElement.querySelector('.selected');
        const answerSelected = answerformElement.querySelector('.selected');
        // const answerSelected = document.getElementById('answer1').value;
        alert(answerSelected);
        //remove
        const questionData = questions[currentQuestionIndex];
        questionElement.textContent = questionData.question;
        alert(Object.entries(questionData.correct_answers));

        if (answerSelected) {
            if (answerSelected.dataset.correct === 'true') {
                resultElement.textContent = 'Correct!';
                correctCount++;
            } else {
                resultElement.textContent = 'Incorrect!';
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
        } else {
            alert('Please select an answer.');


        }
    });

    const reloadPage = () => {
        // quizContainer.classList.add('hidden');
        // finalScoreContainer.classList.remove('hidden');
        // finalCorrectCountElement.textContent = correctCount;
        // finalIncorrectCountElement.textContent = incorrectCount;
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
        // finalScoreContainer.classList.add('hidden');
    });


});