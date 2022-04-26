let word;
let gameEnded = false;

const arrayInstances = (array, item) => array.flat(Infinity).filter(currentItem => currentItem == item).length;
const stringInstances = (string, word) => string.split(word).length - 1;

const addLetter = (letter) => {
    let currentGuess = localStorage.getItem('currentGuess') || '';
    if (currentGuess.length != 5 && !gameEnded) {
        localStorage.setItem('currentGuess', currentGuess + letter);
        document.querySelector('.guess.empty').querySelectorAll('.letter')[currentGuess.length].textContent = letter;
    }
}

const deleteLetter = () => {
    if (!gameEnded) {
        let currentGuess = localStorage.getItem('currentGuess') || '';
        localStorage.setItem('currentGuess', currentGuess.slice(0, -1));
    
        let currentLetters = document.querySelector('.guess.empty').querySelectorAll('.letter');
        for (let i = currentLetters.length - 1; i >= 0; i--) {
            if (currentLetters[i].textContent) {
                currentLetters[i].textContent = '';
                break;
            }
        }
    }
}

const colorGuess = (guessNode) => {
    let lettersNodes = guessNode.querySelectorAll('.letter');

    let correct = [];
    let wrongPosition = [];

    for (let i = 0; i < lettersNodes.length; i++) {
        let letter = lettersNodes[i].textContent;
        if (letter === word[i]) {
            lettersNodes[i].classList.add('correct');
            document.querySelector(`.letter[data-letter="${letter}"]`).classList.add('correct');
            correct.push(letter)
        }
    }
    for (let i = 0; i < lettersNodes.length; i++) {
        let letter = lettersNodes[i].textContent;
        if (letter != word[i] && word.includes(letter) && stringInstances(word, letter) > arrayInstances(correct, letter) + arrayInstances(wrongPosition, letter)) {
            lettersNodes[i].classList.add('wrong-position');
            document.querySelector(`.letter[data-letter="${letter}"]`).classList.add('wrong-position');
            wrongPosition.push(letter)
        } else if (!word.includes(letter) || letter != word[i] && stringInstances(word, letter) <= arrayInstances(correct, letter) + arrayInstances(wrongPosition, letter)) {
            lettersNodes[i].classList.add('wrong');
            document.querySelector(`.letter[data-letter="${letter}"]`).classList.add('wrong');
        }
    }
}

const confirmGuess = () => {
    let currentGuess = localStorage.getItem('currentGuess') || '';

    if (gameEnded) return;

    if (currentGuess.length === 5) {
        if (frequentWordlist.includes(currentGuess) || wordlist.includes(currentGuess)) {
            let guesses = JSON.parse(localStorage.getItem('guesses')) || [];
            if (guesses.includes(currentGuess)) {
                return displayAlert('تم إدخال الكلمة من قبل')
            }

            let guessNode = document.querySelector('.guess.empty');
            colorGuess(guessNode);

            guesses.push(currentGuess);
            localStorage.setItem('guesses', JSON.stringify(guesses));
            guessNode.classList.remove('empty');
            localStorage.setItem('currentGuess', '');

            displayAlert('');

            if (currentGuess === word || guesses.length >= 6) {
                let data = JSON.parse(localStorage.getItem('data')) || {};
                data.gameEnded = true;
                localStorage.setItem('data', JSON.stringify(data));
                gameEnded = true;
                displayAlert(`الإجابة الصحيحة: ${word} <a href="https://www.almaany.com/ar/dict/ar-ar/${word}/" target="_blank">تعرف على معناها</a>`);
            }
        } else {
            displayAlert('الكلمة غير مسجلة في قاعدة البيانات');
        }
    } else {
        displayAlert('عدد الحروف غير مكتمل');
    }
}

const newGame = () => {
    localStorage.clear();
    window.location.reload();
}

const displayAlert = (msg) => {
    document.getElementById('alert').innerHTML = msg;
}

window.onload = () => {
    localStorage.getItem('currentWord') || localStorage.setItem('currentWord', frequentWordlist[Math.floor(Math.random() * frequentWordlist.length)]);
    word = localStorage.getItem('currentWord');

    let data = JSON.parse(localStorage.getItem('data')) || {gameEnded: false};
    gameEnded = data.gameEnded;

    gameEnded && displayAlert(`الإجابة الصحيحة: ${word} <a href="https://www.almaany.com/ar/dict/ar-ar/${word}/" target="_blank">تعرف على معناها</a>`);

    const guessNodes = document.querySelectorAll('.guess');

    if (localStorage.getItem('guesses')) {
        let guesses = JSON.parse(localStorage.getItem('guesses'));

        for (let i = 0; i < guesses.length; i++) {
            for (let j = 0; j < 5; j++) {
                guessNodes[i].querySelectorAll('.letter')[j].textContent = guesses[i][j];
            }
            colorGuess(guessNodes[i]);
            guessNodes[i].classList.remove('empty');
        }
    }

    let currentGuess = localStorage.getItem('currentGuess') || '';
    if (currentGuess) {
        const letters = document.querySelector('.guess.empty').querySelectorAll('.letter');
        for (let i = 0; i < currentGuess.length; i++) {
            letters[i].textContent = currentGuess[i];
        }
    }
}

window.addEventListener('keydown', (e) => {
    const key = e.key;

    const arabic = /[\u0600-\u06FF]/;

    if(arabic.test(key)) {
        addLetter(key);
    } else if (key == 'Backspace') {
        deleteLetter();
    } else if (key == 'Enter') {
        confirmGuess();
    }

})