/* Author: Marouane Chtitou */

function showWord(game, wordDisplay) {
    let display = "";

    for (let i = 0; i < game.word.length; i++) {
        const letter = game.word[i];

        if (game.correctLetters.includes(letter)) {
            display += letter + " ";
        } else {
            display += "_ ";
        }
    }

    wordDisplay.textContent = display;
}

function makeKeyboard(keyboard, handleLetterClick) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";

    keyboard.innerHTML = "";

    for (let i = 0; i < alphabet.length; i++) {
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = alphabet[i].toUpperCase();
        button.value = alphabet[i];
        button.className = "letter-button";

        button.addEventListener("click", function() {
            handleLetterClick(button);
        });

        keyboard.appendChild(button);
    }
}

function disableKeyboard() {
    const buttons = document.querySelectorAll(".letter-button");

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
}

function updateHangmanImage(game, hangmanImage) {
    hangmanImage.src = "./images/hangman-" + game.wrongGuesses + ".png";
    hangmanImage.alt = "Hangman stage " + game.wrongGuesses;
}

function showHappyHangman(hangmanImage) {
    hangmanImage.src = "./images/hangman-happy.png";
    hangmanImage.alt = "Happy saved hangman";
}

function showMessage(messageText, message) {
    messageText.className = "message";
    void messageText.offsetWidth;
    messageText.textContent = message;
    messageText.className = "message fade-message";
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play().catch(function() {
        console.log("Audio file could not play.");
    });
}

function showFeedback(gameCard, feedbackClass) {
    gameCard.classList.remove("correct-flash");
    gameCard.classList.remove("wrong-flash");

    void gameCard.offsetWidth;

    gameCard.classList.add(feedbackClass);

    setTimeout(function() {
        gameCard.classList.remove(feedbackClass);
    }, 700);
}

function showResultPopup(resultPopup, resultTitle, resultMessage, title, message) {
    resultTitle.textContent = title;
    resultMessage.textContent = message;
    resultPopup.style.display = "flex";
}

function hideResultPopup(resultPopup) {
    resultPopup.style.display = "none";
}