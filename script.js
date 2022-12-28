// импортируем слова из файла
import { WORDS } from "./words.js";

// количество попыток
const NUMBER_OF_GUESSES = 6;
// сколько попыток осталось
let guessesRemaining = NUMBER_OF_GUESSES;
// текущая попытка
let currentGuess = [];
// следующая буква
let nextLetter = 0;
// загаданное слово
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]
// на всякий случай выведем в консоль загаданное слово, чтобы проверить, как работает игра
console.log(rightGuessString)

// создаём игровое поле
function initBoard() {
    // получаем доступ к блоку на странице
    let board = document.getElementById("game-board");

    // создаём строки
    // делаем цикл от 1 до 6, потому что попыток у нас как раз 6
    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        // создаём новый блок на странице
        let row = document.createElement("div")
        // добавляем к нему класс, чтобы потом работать со строками напрямую
        row.className = "letter-row"
        
        // создаём отдельные клетки
        // добавляем по 5 клеток в ряд
        for (let j = 0; j < 5; j++) {
            // создаём новый блок на странице
            let box = document.createElement("div")
            // добавляем к нему класс
            box.className = "letter-box"
            // вкладываем новый блок внутрь блока со строкой
            row.appendChild(box)
        }

        // как все 5 клеток готовы, добавляем новую строку на поле
        board.appendChild(row)
    }
}

// удаление символа
function deleteLetter () {
    // получаем доступ к текущей строке
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    // и к последнему введённому символу
    let box = row.children[nextLetter - 1]
    // очищаем содержимое клетки
    box.textContent = ""
    // убираем жирную обводку
    box.classList.remove("filled-box")
    // удаляем последний символ из массива с нашей текущей догадкой
    currentGuess.pop()
    // помечаем, что у нас теперь на одну свободную клетку больше
    nextLetter -= 1
}

// проверка введённого слова
function checkGuess () {
    // получаем доступ к текущей строке
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    // переменная, где будет наша догадка
    let guessString = ''
    // делаем из загаданного слова массив символов
    let rightGuess = Array.from(rightGuessString)

    // собираем все введённые в строке буквы в одно слово
    for (const val of currentGuess) {
        guessString += val
    }

    // если в догадке меньше 5 букв — выводим уведомление, что букв не хватает
    if (guessString.length != 5) {
        // error означает, что уведомление будет в формате ошибки
        toastr.error("Введены не все буквы!");
        // и после вывода выходим из проверки догадки
        return;
    }

    // если введённого слова нет в списке возможных слов — выводим уведомление
    if (!WORDS.includes(guessString)) {
        toastr.error("Такого слова нет в списке!")
        // и после вывода выходим из проверки догадки
        return;
    }

    // перебираем все буквы в строке, чтобы подсветить их нужным цветом
    for (let i = 0; i < 5; i++) {
        // убираем текущий цвет, если он был
        let letterColor = ''
        // получаем доступ к текущей клетке
        let box = row.children[i]
        // и к текущей букве в догадке
        let letter = currentGuess[i]
        
        // смотрим, на каком месте в исходном слове стоит текущая буква
        let letterPosition = rightGuess.indexOf(currentGuess[i])
        // если такой буквы нет в исходном слове
        if (letterPosition === -1) {
            // закрашиваем клетку серым
            letterColor = 'grey'
        // иначе, когда мы точно знаем, что буква в слове есть
        } else {
            // если позиция в слове совпадает с текущей позицией 
            if (currentGuess[i] === rightGuess[i]) {
                // закрашиваем клетку зелёным
                letterColor = 'green'
            } else {
                // в противном случае закрашиваем жёлтым
                letterColor = 'yellow'
            }

            // заменяем обработанный символ на знак решётки, чтобы не использовать его на следующем шаге цикла
            rightGuess[letterPosition] = "#"
        }

        // применяем выбранный цвет к фону клетки
        box.style.backgroundColor = letterColor;
    }

    // если мы угадали
    if (guessString === rightGuessString) {
        // выводим сообщение об успехе
        toastr.success("Вы выиграли!")
        // обнуляем количество попыток
        guessesRemaining = 0;
        // выходим из проверки
        return
    // в противном случае
    } else {
        // уменьшаем счётчик попыток
        guessesRemaining -= 1;
        // обнуляем массив с символами текущей попытки
        currentGuess = [];
        // начинаем отсчёт букв заново
        nextLetter = 0;

        // если попытки закончились
        if (guessesRemaining === 0) {
            // выводим сообщение о проигрыше
            toastr.error("У вас не осталось попыток. Вы проиграли!");
            // и выводим загаданное слово
            toastr.info(`Загаданное слово: "${rightGuessString}"`)
        }
    }
}

// выводим букву в клетку
function insertLetter (pressedKey) {
    // если клетки закончились
    if (nextLetter === 5) {
        // выходим из функции
        return;
    }
    // получаем доступ к текущей строке
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    // и к текущей клетке, где будет появляться буква
    let box = row.children[nextLetter]
    // меняем текст в блоке с клеткой на нажатый символ
    box.textContent = pressedKey
    // добавляем к клетке жирную обводку
    box.classList.add("filled-box")
    // добавляем введённый символ к массиву, в которой хранится наша текущая попытка угадать слово
    currentGuess.push(pressedKey)
    // помечаем, что дальше будем работать со следующей клеткой
    nextLetter += 1
}

// обработчик нажатия на клавиши
document.addEventListener("keydown", (e) => {

    // если попыток не осталось
    if (guessesRemaining === 0) {
        // выходим из функции
        return
    }

    // получаем код нажатой клавиши
    let pressedKey = String(e.key)
    // если нажат Backspace и в строке есть хоть один символ
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        // то удаляем последнюю введённую букву
        deleteLetter();
        // и выходим из обработчика
        return;
    }

    // если нажат Enter
    if (pressedKey === "Enter") {
        // проверяем введённое слово
        checkGuess();
        // и выходим из обработчика
        return;
    }

    // проверяем, есть ли введённый символ в английском алфавите
    let found = pressedKey.match(/[a-z]/gi)
    // если нет
    if (!found || found.length > 1) {
        // то выходим из обработчика
        return
    // иначе добавляем введённую букву в новую клетку
    } else {
        insertLetter(pressedKey)
    }
})


initBoard();