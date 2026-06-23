/* Author: Marouane Chtitou */

class HangmanGame {
    constructor(maxWrongGuesses) {
        this.words = [];
        this.word = "";
        this.hint = "";
        this.correctLetters = [];
        this.guessedLetters = [];
        this.wrongGuesses = 0;
        this.maxWrongGuesses = maxWrongGuesses;
        this.isOver = false;
    }

    setWords(words) {
        this.words = words;
    }

    startNewGame(resetWrongGuesses) {
        const randomNumber = Math.floor(Math.random() * this.words.length);
        const randomWord = this.words[randomNumber];

        this.word = randomWord.word.toLowerCase();
        this.hint = randomWord.hint;
        this.correctLetters = [];
        this.guessedLetters = [];
        this.isOver = false;

        if (resetWrongGuesses) {
            this.wrongGuesses = 0;
        }
    }

    guessLetter(letter) {
        if (this.isOver) {
            return "game-over";
        }

        this.guessedLetters.push(letter);

        if (this.word.includes(letter)) {
            this.correctLetters.push(letter);
            return "correct";
        } else {
            this.wrongGuesses++;
            return "wrong";
        }
    }

    hasPlayerWon() {
        for (let i = 0; i < this.word.length; i++) {
            const letter = this.word[i];

            if (!this.correctLetters.includes(letter)) {
                return false;
            }
        }

        return true;
    }

    hasPlayerLost() {
        return this.wrongGuesses >= this.maxWrongGuesses;
    }

    endGame() {
        this.isOver = true;
    }
}