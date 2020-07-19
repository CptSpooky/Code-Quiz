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

startButton.addEventListener('click', startQuiz);

function startQuiz(event){
    console.log('Started');
    startButton.classList.add('hide');
    qBox.classList.remove('hide');
    nextQuestion = 0;
    setNextQuestion();
    timer = 30;
    score = 0;
    timerTick();

}

function setNextQuestion(){
    showQuestion(questions[nextQuestion++]);
}

function showQuestion(question){
    questionElement.innerText = question.question;
    answerButtonsEl.innerHTML = '';
    question.answers.sort((a, b) => {
        return Math.random() - 0.5; 
    });
    question.answers.forEach(element => {
        let btn = document.createElement('div');
        btn.classList.add('btn');
        btn.innerText = element.text;
        btn.dataset.correct = element.correct;
        answerButtonsEl.appendChild(btn);
    });
}

function timerTick(){
    timerEl.innerHTML = timer
    if(timer-- > 0) {
        timerID = setTimeout(timerTick, 1000) 
    } else {
        showFinalScore();
    }
}

answerButtonsEl.addEventListener('click', selectAnswer);

function selectAnswer(e){
    const btn = e.target;
    
    if(btn.classList.contains('btn')){

        if(btn.dataset.correct == 'true' ){
            score++;
            feedback.innerText = "Correct";
        } else {
            feedback.innerText = "Wrong";
            timer -= 10;
        }

        if (nextQuestion >= questions.length){
            showFinalScore();
        } else {
            setNextQuestion();
        }
    }
}


function showFinalScore(){
        qBox.classList.add('hide');
        resetBtn.classList.remove('hide');
        finalScore.classList.remove('hide');
        scoreCountP.innerText = "Final Score: " + score;
        clearTimeout(timerID);
}

submitBtn.addEventListener('click', submitInfo);

function submitInfo(){
    yourNameInput.classList.add('hide');
    submitBtn.classList.add('hide');
    resetBtn.classList.remove('hide');

    let userInitials = yourNameInput.value;

    var scores = JSON.parse(localStorage.getItem("scores"));

    if(scores == null) {
        scores = [];
    }

    var newScore = { score:score, name:userInitials };

    scores = scores.concat(newScore);

    scores.sort((a, b) =>{
        return b.score - a.score;
    });

    localStorage.setItem("scores", JSON.stringify(scores));

    highScores.innerHTML = '';

    scores.forEach(element => {
        var newLi = document.createElement("li");
        newLi.innerHTML = element.name + ':  ' + element.score + "<hr>";
        highScores.appendChild(newLi);
        console.log(element.name + ':' + element.score);
    });
    console.log(score);
    console.log(userInitials);
}

resetBtn.addEventListener('click', resetQuiz);

function resetQuiz(){
    finalScore.classList.add('hide');
    resetBtn.classList.add('hide');
    startQuiz();
}