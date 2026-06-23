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

const gameCard = document.querySelector(".game-card");

const resultPopup = document.getElementById("resultPopup");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");
const popupPlayAgainButton = document.getElementById("popupPlayAgainButton");

const game = new HangmanGame(6);

let popupMode = "play-again";

startButton.addEventListener("click", function() {
    startScreen.style.display = "none";
});

playAgainButton.addEventListener("click", function() {
    startGame(true);
});

popupPlayAgainButton.addEventListener("click", function() {
    hideResultPopup(resultPopup);

    if (popupMode === "continue") {
        startGame(false);
    } else if (popupMode === "play-again") {
        startGame(true);
    }
});
document.addEventListener("keydown", function(event) {
    const key = event.key.toLowerCase();

    if (event.repeat) {
        return;
    }

    if (game.isOver) {
        return;
    }

    if (!key.match(/^[a-z]$/)) {
        return;
    }

    const button = document.querySelector(".letter-button[value='" + key + "']");

    if (button !== null && !button.disabled) {
        button.click();
    }
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
        startGame(true);
    })
    .catch(function(error) {
        hintText.textContent = "Words could not load.";
        messageText.textContent = "Server error occurred.";
        console.log(error);
    });

function startGame(resetWrongGuesses) {
    game.startNewGame(resetWrongGuesses);

    gameCard.classList.remove("happy-crowd");
    gameCard.classList.remove("sad-crowd");
    gameCard.classList.remove("correct-flash");
    gameCard.classList.remove("wrong-flash");

    hintText.textContent = game.hint;
    wrongCount.textContent = game.wrongGuesses;
    usedLetters.textContent = "None";
    messageText.textContent = "";

    updateHangmanImage(game, hangmanImage);

    playAgainButton.style.display = "none";
    popupPlayAgainButton.textContent = "Play Again";
    hideResultPopup(resultPopup);

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
        showFeedback(gameCard, "correct-flash");
        playSound(correctSound);
    } else if (result === "wrong") {
        button.className = "letter-button wrong";
        updateHangmanImage(game, hangmanImage);
        showMessage(messageText, "Wrong guess.");
        showFeedback(gameCard, "wrong-flash");
        playSound(wrongSound);
    }

    showWord(game, wordDisplay);
    checkResult();
}

function checkResult() {
    if (game.hasPlayerLost()) {
        game.endGame();

        gameCard.classList.add("sad-crowd");
        gameCard.classList.remove("happy-crowd");

        updateHangmanImage(game, hangmanImage);

        showMessage(messageText, "Game over. The word was " + game.word + ".");
        popupMode = "play-again";
        popupPlayAgainButton.textContent = "Play Again";

        showResultPopup(
            resultPopup,
            resultTitle,
            resultMessage,
            "Game Over",
            "You reached 6 wrong guesses. The word was " + game.word + "."
        );

        playSound(loseSound);
        playAgainButton.style.display = "none";
        disableKeyboard();

        return;
    }

    if (game.hasPlayerWon()) {
        game.endGame();

        gameCard.classList.add("happy-crowd");
        gameCard.classList.remove("sad-crowd");

        showHappyHangman(hangmanImage);

        showMessage(messageText, "You won this word. Continue to the next word.");
        popupMode = "continue";
        popupPlayAgainButton.textContent = "Continue";

        showResultPopup(
            resultPopup,
            resultTitle,
            resultMessage,
            "You Won",
            "You saved the hanged man for this word. Wrong guesses stay at " + game.wrongGuesses + "/6."
        );

        playSound(winSound);
        playAgainButton.style.display = "none";
        disableKeyboard();
    }
}