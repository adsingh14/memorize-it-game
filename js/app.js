"use strict";

/*===================
\ Add cards to board \
 ===================*/
let gameStart = () => {

  // Create a list that holds all of your cards
  const cards = ["diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb"];
  const cardList = cards.concat(cards);

  // shuffle list of cards
  shuffle(cardList);

  // Place cardList in deck
  const deck = document.querySelector('.deck');
  const temp_deck = document.createDocumentFragment();

  for (let card = 0; card < cardList.length; card++) {

    let li = document.createElement('li');
    li.className = 'card';
    li.setAttribute('data-card', cardList[card]);

    let i = document.createElement('i');
    i.classList = `fa fa-${cardList[card]}`;

    li.appendChild(i);
    temp_deck.appendChild(li);
  }
  deck.appendChild(temp_deck);
}
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided 'shuffle' method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from Fisher-Yates (aka Knuth-shuffle).
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// Game loads on refresh
gameStart();

/*=================
\ Card flip method \
 =================*/
const allCards = document.querySelectorAll('.card');

// Temporary card' list for matching
let openCards = [];

// To avoid the opening of third card
let cardLock = false;

allCards.forEach(card => {
  card.addEventListener('click', event => {

    if (cardLock) { return true; }
    // Add cards into temporary stack
    openCards.push(card);
    // Disable event trigger on cards having 'open','show' and 'match' classes
    if (!card.classList.contains('show') && !card.classList.contains('open') && !card.classList.contains('match')) {
      card.classList.add('open', 'show');
      if (openCards.length == 2) {

        // to check the card similarity
        check();
        // Add a move count on opening card pair
        movesCounter();
      }
    }
  });
});

const check = () => {
  const checking = openCards[0].dataset.card === openCards[1].dataset.card;
  checking ? matchCards() : unMatchCards();
};

// when cards will match
let matchCards = () => {
  for (let card of openCards) {
    card.classList.add('open', 'show', 'match');
  }
  openCards = [];
}

// when cards will not match
let unMatchCards = () => {
  // lock wrong cards except first two until flipped back
  cardLock = true;
  setTimeout(() => {
    for (let card of openCards) {
      card.classList.remove('open', 'show');
    }
    openCards = [];
    // unlock card clicking method
    cardLock = false;
  }, 1500);
}

/*==============
\ Moves Counter \
 ==============*/
const moves = document.querySelector('.moves');

// initialize moves counter from zero
let allMoves = 0;

const movesCounter = () => {
  allMoves++;
  allMoves == 1 ? moves.innerText = `${allMoves} Move` : moves.innerText = `${allMoves} Moves`;

  // Stars rating
  const stars = document.querySelectorAll('.fa-star');

  switch (allMoves) {
    case 10:
      stars[2].classList.remove('fa-star');
      stars[2].classList.add('fa-star-o');
      break;
    case 15:
      stars[1].classList.remove('fa-star');
      stars[1].classList.add('fa-star-o');
      break;
    case 20:
      stars[0].classList.remove('fa-star');
      stars[0].classList.add('fa-star-o');
  }
}