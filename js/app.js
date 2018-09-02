"use strict";

/*
 * Create a list that holds all of your cards
 */
// Card deck
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

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided 'shuffle' method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
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

const allCards = document.querySelectorAll('.card');
let openCards = [];

allCards.forEach(card => {
  card.addEventListener('click', event => {
    openCards.push(card);

    // Disable event trigger on cards having 'open','show' and 'match' classes
    if (!card.classList.contains('show') && !card.classList.contains('open') && !card.classList.contains('match')) {
      card.classList.add('open', 'show');
      if (openCards.length == 2) {
        check();
      }
    }
  });
});

// For checking the matched pair of cards
const check = () => {
  if (openCards[0].dataset.card == openCards[1].dataset.card) {

    // Match
    for (let card of openCards) {
      card.classList.add('open', 'show', 'match');
    }
    openCards = [];
  } else {

    // Not matched
    setTimeout(() => {
      for (let card of openCards) {
        card.classList.remove('open', 'show');
      }
      openCards = [];
    }, 1500);
  }
};

// TODO: Stop event on third click