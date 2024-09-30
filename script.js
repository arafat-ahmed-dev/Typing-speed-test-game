// Constants
const MILLIS_IN_MINUTE = 60000;
const MILLIS_IN_SECOND = 1000;

// Selectors
const typingArea = document.querySelector(".typing-area p");
const startButton = document.querySelector(".start");
const timeElement = document.getElementById("time");
const restart = document.querySelector(".restart");
const option = document.querySelectorAll(".option");
const wrm = document.querySelector(".wrm");
const accurecy = document.querySelector(".accurecy");
const wrong = document.querySelector(".wrong");
const blurPage = document.querySelector(".blur p");

// State
let startTime;
let currentIndex = 0;
let isGameOver = false;
let isStart = true;
let word;


// Function to generate a random paragraph
function randomParagraph() {
    const randomParagraph = paragraph[Math.floor(Math.random() * paragraph.length)];
    const letter = randomParagraph.split("");
    word = randomParagraph.split(" ");
    letter.map((word) => {
        typingArea.innerHTML += `<span data-value="${word}" class="typing">${word}</span>`;
    });
}

// Function to play sound
function playSound() {
    const audio = new Audio("./keyboard sound.mp3");
    audio.play();
}

// Function to check if a key press is correct
function isKeyPressCorrect(keyPressed, currentSpan) {
    const firstCharacter = currentSpan.textContent[0];
    return keyPressed === firstCharacter;
}

// Function to handle key press
function handleKeyPress(event) {
    if (isGameOver) return;

    const keyPressed = event.key;
    const currentSpan = typingArea.children[currentIndex];

    if (event.key === "backspace") {

        // Handle backspace
        if (currentIndex > 0) {
            currentIndex--;
            currentSpan.classList.remove("correct", "incorrect");
        }
    } else if (isKeyPressCorrect(keyPressed, currentSpan)) {
        // Correct key press
        currentSpan.classList.add("correct");
        currentIndex++;
        playSound();
    } else {
        // Incorrect key press
        currentSpan.classList.add("incorrect");
        currentIndex++;
        playSound();
    }

    // Check for game over
    if (currentIndex >= typingArea.children.length) {
        calculateAccuracy();
        calculateWRM();
        calculateWrong();
        isGameOver = true;
        window.removeEventListener("keypress", handleKeyPress);
    }

    // Start timer if not already started
    if (!startTime) {
        startTime = new Date().getTime();
        setInterval(displayElapsedTime, MILLIS_IN_SECOND);
    }
}

// Function to display elapsed time
function displayElapsedTime() {
    if (isGameOver) return;

    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;
    const minutes = Math.floor(elapsedTime / MILLIS_IN_MINUTE);
    const seconds = Math.floor((elapsedTime % MILLIS_IN_MINUTE) / MILLIS_IN_SECOND);
    timeElement.innerHTML = `${minutes} : ${seconds}`;
}

// Initialize game
randomParagraph();

//Add start functionality
startButton.addEventListener("click", () => {
    startTime = null;
    currentIndex = 0;
    isGameOver = false;
    window.addEventListener("keypress", handleKeyPress);
    if (isStart) {
        startButton.classList.add("hide");
        restart.classList.remove("hide");
    }
    document.querySelectorAll(".blinking").forEach((e)=>{
        e.style.animationName = "blink"
    })
});
// Add restart functionality
restart.addEventListener("click", () => {
    if (isStart) {
        startButton.classList.remove("hide");
        restart.classList.add("hide");
    }
    // Clear the typing area
    typingArea.innerHTML = "";

    // Reset the game state
    startTime = null;
    currentIndex = 0;
    isGameOver = false;

    // Remove the key press event listener
    window.removeEventListener("keypress", handleKeyPress);

    // Reset the time display
    timeElement.innerHTML = "00 : 00";

    // Start the game again
    randomParagraph();
    window.addEventListener("keypress", handleKeyPress);
});

// Function to calculate WRM
function calculateWRM() {
    const totalWords = word.length;
    const elapsedMinutes = (new Date().getTime() - startTime) / MILLIS_IN_MINUTE;
    const wpm = Math.floor(totalWords / elapsedMinutes);
    wrm.innerHTML = `WPM : <span>${wpm}</span>`;
}

  // Function to calculate Accuracy
function calculateAccuracy() {
    const correctWords = document.querySelectorAll(".correct").length;
    const totalWords = word.length;
    const accuracy = Math.floor((correctWords / totalWords) * 100);
    accurecy.innerHTML = `Accuracy : <span>${accuracy} %</span>`;
}

  // Function to calculate Wrong
function calculateWrong() {
    const incorrectWords = document.querySelectorAll(".incorrect").length;
    wrong.innerHTML = `Wrong : <span>${incorrectWords}</span>`;
}

blurPage.addEventListener("click",()=>{
    if(isStart){
        startButton.classList.remove("hide");
        restart.classList.add("hide");
        blurPage.parentElement.style.display ="none";
    }
})
// option.forEach((e)=>{
//     e.addEventListener("click", () => {
//         if(e.textContent === "Uppercase"){
//             typingArea.textContent = typingArea.textContent.toUpperCase();
//         } else if(e.textContent === "Lowercase"){
//             typingArea.textContent = typingArea.textContent.toLowerCase();
//         }else if(e.textContent === "Number"){
//             randomParagraph("Number");
//         }else{
//             randomParagraph("Puncuation");
//         }
//     })
// })