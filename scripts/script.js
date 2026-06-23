/* Author: Marouane Chtitou */

const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");

const hangmanImage = document.getElementById("hangmanImage");
const hintText = document.getElementById("hintText");
const wordDisplay = document.getElementById("wordDisplay");
const wrongCount = document.getElementById("wrongCount");
const usedLetters = document.getElementById("usedLetters");
const messageText = document.getElementById("messageText");
const playAgainButton = document.getElementById("playAgainButton");
const keyboard = document.getElementById("keyboard");

const correctSound = new Audio("./audio/correct.mp3");
const wrongSound = new Audio("./audio/wrong.mp3");
const winSound = new Audio("./audio/win.mp3");
const loseSound = new Audio("./audio/lose.mp3");

const game = new HangmanGame(6);

startButton.addEventListener("click", function() {
    startScreen.style.display = "none";
});

playAgainButton.addEventListener("click", function() {
    startGame();
});

fetch("./data/words.json")
    .then(function(response) {
        if (!response.ok) {
            throw new Error("Could not load words.");
        }

        return response.json();
    })
    .then(function(data) {
        game.setWords(data);
        startGame();
    })
    .catch(function(error) {
        hintText.textContent = "Words could not load.";
        messageText.textContent = "Server error occurred.";
        console.log(error);
    });

function startGame() {
    game.startNewGame();

    hintText.textContent = game.hint;
    wrongCount.textContent = "0";
    usedLetters.textContent = "None";
    messageText.textContent = "";

    hangmanImage.src = "./images/hangman-0.jpeg";
    hangmanImage.alt = "Hangman stage 0";

    playAgainButton.style.display = "none";

    showWord(game, wordDisplay);
    makeKeyboard(keyboard, handleLetterClick);
}

function handleLetterClick(button) {
    const letter = button.value;

    button.disabled = true;

    const result = game.guessLetter(letter);

    usedLetters.textContent = game.guessedLetters.join(", ");
    wrongCount.textContent = game.wrongGuesses;

    if (result === "correct") {
        button.className = "letter-button correct";
        updateHangmanImage(game, hangmanImage);
        showMessage(messageText, "Correct guess.");
        playSound(correctSound);
    } else if (result === "wrong") {
        button.className = "letter-button wrong";
        updateHangmanImage(game, hangmanImage);
        showMessage(messageText, "Wrong guess.");
        playSound(wrongSound);
    }

    showWord(game, wordDisplay);
    checkResult();
}

function checkResult() {
    if (game.hasPlayerWon()) {
        game.endGame();
        showHappyHangman(hangmanImage);
        showMessage(messageText, "You won. You saved the hanged man.");
        playSound(winSound);
        playAgainButton.style.display = "inline-block";
        disableKeyboard();
    }

    if (game.hasPlayerLost()) {
        game.endGame();
        updateHangmanImage(game, hangmanImage);
        showMessage(messageText, "You lost. The word was " + game.word + ".");
        playSound(loseSound);
        playAgainButton.style.display = "inline-block";
        disableKeyboard();
    }
}