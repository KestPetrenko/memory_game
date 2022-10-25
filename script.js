/**
 * Описывают отдельную карту, которая может отображаться рубашкой вверх или изображением вверх.
 */
 class Card {
    #image;
    #element;
    #isFlipped = false;

    constructor(image) {
        this.#image = image;

        this.#element = document.createElement("div");
        this.#element.classList.add("card");
        this.#element.style.backgroundImage = `url('${this.coverPath}')`;
        this.#element.connectedCard = this; // в свойстве DOM объекта будет находится ссылка на экземпляр карты
    }

    get imagePath() {
        return `images/${this.#image}`;
    }

    get coverPath() {
        return 'images/logo1.jpg';
    }

    get element() {
        return this.#element;
    }

    flip() {
        if (this.#isFlipped)
            this.#element.style.backgroundImage = `url('${this.coverPath}')`;
        else
            this.#element.style.backgroundImage = `url('${this.imagePath}')`;

        this.#isFlipped = !this.#isFlipped;
    }

    disconectFromDOM() {
        this.#element.connectedCard = null;
    }
}

//   Колода карт. Класс отвечает за создание и тасование карт. Содержит список изображений карт.

class Deck {
    #cardsImages = ["bigl.png", "bulldogEnglish.png", "corgi.png", "dgek.png", "haski.png", "pekines.png",
        "retriever.png", "shepherd.png", "York.png", "boxer.png", "bulldog.png", "rottweiler.jpg"];

    constructor() {
        this.cards = [];
        this.#cardsImages.forEach(image => {
            this.cards.push(new Card(image));
            this.cards.push(new Card(image));
        });
    }

    shuffle() {
        this.cards.sort(() => Math.random() - 0.5);
    }

    removeCard(card) {
        let index = this.cards.findIndex(item => item.imagePath == card.imagePath);
        if (index != -1) {
            this.cards.splice(index, 1);
            card.disconectFromDOM();
        }
    }
}

/**
 * Управляет игрой, запоминает какие карты были открыты, управляет колодой и считает количество попыток.
 * Связывает JavaScript код с пользовательским интерфейсом
 */


 class GameManager {
    #boardElement;
    #scoreElement;
    #deck = new Deck();
    #firstCard = null;
    #secondCard = null;
    #attemptNumber = 0;

    constructor(board, score) {
        if (typeof board === "string") {
            this.#boardElement = document.querySelector(board);
        }
        else {
            this.#boardElement = board;
        }

        if (typeof score === "string") {
            this.#scoreElement = document.querySelector(score);
        }
        else {
            this.#scoreElement = score;
        }
    }

    startGame() {
        this.attemptNumber = 0;
        this.#deck = new Deck();
        this.#boardElement.innerHTML = "";
        this.shuffleAndDeal();
    }

    shuffleAndDeal() {
        this.#deck.shuffle();
        this.#deck.cards.forEach(card => {
            this.#boardElement.append(card.element);
        });
    }

    selectCard(card) {
        if(card == this.#firstCard) return; // если второй раз нажали на одну и туже карту, ничего не делаем (метод дальше не выполняем)
        card.flip(); // переворачиваем карту

        // если есть значения в двух полях, значит предыдущие две карты не совпали
        // переворачиваем их рубашкой вверх
        if (this.#firstCard && this.#secondCard) {
            this.#firstCard.flip();
            this.#secondCard.flip();

            this.#firstCard = this.#secondCard = null;
        }

        // Если выбрана одна карта запоминаем ее и ждем вторую
        if (this.#firstCard == null) {
            this.#firstCard = card;
        }
        else if (this.#secondCard == null) {
            this.attemptNumber++;
            this.#secondCard = card;

            // если найдены карты с одинаковым изображением 
            if (this.#firstCard.imagePath === card.imagePath) {
                this.#deck.removeCard(this.#firstCard); // убираем карты из колоды (они остаются в DOM дереве)
                this.#deck.removeCard(this.#secondCard);

                this.#firstCard = this.#secondCard = null; 
            }
        }
    }

    get attemptNumber() {
        return this.#attemptNumber;
    }

    set attemptNumber(value) {
        this.#attemptNumber = value;
        this.#scoreElement.innerHTML = value;
    }

    get tm(){
        console.log(this.#scoreElement.innerHTML)
    }
}

/** Комментарий, который начинается с двух звездочек - JSDoc комментарий, отображается в подсказке Visual Studio */

let board = document.querySelector("#board");
let score = document.querySelector("#atemptNumOutput");


let startGameButton = document.querySelector("#startGame");

let gm = new GameManager(board, score);
gm.startGame();

board.addEventListener("click", function (e) {
    let clickedCard = e.target.connectedCard;
    if (clickedCard) {
        gm.selectCard(clickedCard);
    }
});

startGameButton.addEventListener("click", function () {
    gm.startGame();
});



let cards = document.querySelectorAll('.card');

function flipCard() {
  this.classList.toggle('flip');
}

cards.forEach(card => card.addEventListener('click', flipCard));

