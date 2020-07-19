// Variables List
const startButton = document.getElementById('startBtn');
const qBox = document.getElementById('questionBox');
const questionElement = document.getElementById('question');
const answerButtonsEl = document.getElementById('answerBtns');
const submitBtn = document.querySelector('.submit-btn');
const resetBtn = document.getElementById('resetBtn');
const feedback = document.querySelector('.feedback');
const timerEl = document.querySelector('.timer');
const scoreCountP = document.getElementById('scoreCount');
let finalScore = document.getElementById('finalScore');
let yourNameInput = document.getElementById('yourName');
let highScores = document.querySelector('.high-scores');
let nextQuestion;
let score = 0;
let timer = 0;
let timerID = 0;

// Quiz Questions
const questions = [
    {
        question: "What is Super Mario's brother's name?",
        answers: [
            {text: 'Luigi', correct: true },
            {text: 'Loogie', correct: false },
            {text: 'Weegee', correct: false },
            {text: 'Wario', correct: false }
        ]
    },
    {
        question: "What is the hero's name in Legend of Zelda?",
        answers: [
            {text: 'Link', correct: true },
            {text: 'Ganon', correct: false },
            {text: 'Garfield', correct: false },
            {text: 'Zorldo', correct: false }
        ]
    },
    {
        question: "Has anyone really been far as decided to use even go want to do look more like?",
        answers: [
            {text: 'All', correct: true },
            {text: 'No', correct: false },
            {text: 'Underneath', correct: false },
            {text: 'Good', correct: false }
        ]
    },
    {
        question: "You are alone in the woods, then suddenly hear a clown honk. How do you survive?",
        answers: [
            {text: 'Run', correct: true },
            {text: 'Fight', correct: false },
            {text: "Don't move it can't see you", correct: false },
            {text: 'Wake up', correct: false }
        ]
    },
    {
        question: "During the Area 51 raid, how did people get to see them aliens?",
        answers: [
            {text: 'Naruto ran through security to dodge bullets', correct: true },
            {text: 'Air drop in', correct: false },
            {text: 'Alien costumes', correct: false },
            {text: 'Phased in', correct: false }
        ]
    }
];

// Start Quiz
startButton.addEventListener('click', e => startQuiz()); //made this a normal function instead of an event specific function because it gets called in the reset btn as a non-event

function startQuiz(){
    startButton.classList.add('hide');
    qBox.classList.remove('hide');
    nextQuestion = 0; //Resets question index for beginning of gameplay
    timer = 30; //Setting timer to start at 30 seconds
    score = 0; //Clearing score for either initial gameplay or reset
    setNextQuestion(); //Serve user first question
    timerTick(); //Start timer
}

// Question Iteration 
function setNextQuestion(){
    showQuestion(questions[nextQuestion++]);
}

// Question setter and sorter
function showQuestion(question){
    questionElement.innerText = question.question; // question. is the value we passed into the parameter
    answerButtonsEl.innerHTML = ''; //wiping it clear to put new question in 
    question.answers.sort((a, b) => { // fuctionally the same as writing function (a, b) compares a to b, expects negative or positive number to sort
        return Math.random() - 0.5; // 50% of time will either be negative or positive, therefore list will be sorted randomly
    });
    //Generate answer buttons
    question.answers.forEach(element => { //forEach expects element parameter and will run for each element in array, element is the list within the answers array
        let btn = document.createElement('div');
        btn.classList.add('btn');
        btn.innerText = element.text;
        btn.dataset.correct = element.correct; // dataset.x is converted to an html element property of data-x, data- stores whatever property in the DOM so you can reference it
        answerButtonsEl.appendChild(btn);
    });
}

// Timer
function timerTick(){
    timerEl.innerHTML = timer;
    if(timer > 0) { 
        timerID = setTimeout(timerTick, 1000); // Sets up a repeating function call to run the timerTick function every second
        // Store the timeout in timerID so JS can reference it when we cancel it later
    } else {
        showFinalScore(); // When timer reaches 0 run this function
    }
    timer--; // Decrement timer by 1 second
}

// Answer Selection
answerButtonsEl.addEventListener('click', selectAnswer);

function selectAnswer(e){
    const btn = e.target;

    if(btn.classList.contains('btn')){ // Checks if clicked target is a button
        //Checks if answers are right or wrong
        if(btn.dataset.correct == 'true' ){
            score++; //Give user a point
            feedback.innerText = "Correct";
        } else {
            feedback.innerText = "Wrong";
            timer -= 10; //Takes 10 seconds off the timer as a penalty
        }

        // When questions run out show final score, otherwise go to next question
        if (nextQuestion >= questions.length){
            showFinalScore();
        } else {
            setNextQuestion();
        }
    }
}

// Final score
function showFinalScore(){
        qBox.classList.add('hide');
        resetBtn.classList.remove('hide');
        finalScore.classList.remove('hide');
        submitBtn.classList.remove('hide');
        yourNameInput.classList.remove('hide');

        scoreCountP.innerText = "Final Score: " + score; // Display final score
        clearTimeout(timerID); //Stop timer
}

// Submit score
submitBtn.addEventListener('click', submitInfo);

function submitInfo(){
    yourNameInput.classList.add('hide');
    submitBtn.classList.add('hide');
    resetBtn.classList.remove('hide');

    let userInitials = yourNameInput.value; //Storing user submitted initials into variable for convenience
    var scores = JSON.parse(localStorage.getItem("scores")); //Pull the scores object from local storage

    // On initial playthrough scores list will be null
    if(scores == null) {
        scores = []; //If object doesn't exist in local storage (null), create from scratch as empty array
    }

    var newScore = { score:score, name:userInitials }; //Creating new score object with appropriate properties
    scores = scores.concat(newScore); // Adding new score to the existing list
    
    //Sorting scores from highest to lowest
    scores.sort((a, b) => {
        return b.score - a.score;
    });

    localStorage.setItem("scores", JSON.stringify(scores)); //Storing scores in local storage
    highScores.innerHTML = ''; // Clear out existing elements from the high scores table
    
    //Generate high scores list items
    scores.forEach(element => {
        var newLi = document.createElement("li");
        newLi.innerHTML = element.name + ':  ' + element.score + "<hr>";
        highScores.appendChild(newLi);
    });
}

// Reset button
resetBtn.addEventListener('click', resetQuiz);

function resetQuiz(){
    finalScore.classList.add('hide');
    resetBtn.classList.add('hide');
    startQuiz();
}