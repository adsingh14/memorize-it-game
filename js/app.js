function gameStart() {

  // @description Create a list that holds all of your cards

  const cards = ["diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb"];
  const cardList = cards.concat(cards);

  /*===================
  \ Add cards to board \
  ===================*/

  // @description shuffle list of cards
  shuffle(cardList);

  // @description Place cardList in deck
  const deck = document.querySelector('.deck');
  const temp_deck = document.createDocumentFragment();

  deck.innerHTML = "";
  for (let j = 0; j < cardList.length; j++) {
    let li = document.createElement('li');
    li.classList = 'card';
    li.setAttribute('data-card', cardList[j]);

    let i = document.createElement('i');
    i.classList = `fa fa-${cardList[j]}`;

    li.appendChild(i);
    temp_deck.appendChild(li);
  }
  deck.appendChild(temp_deck);
}

// @description Shuffle function from Fisher-Yates (aka Knuth-shuffle).
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// @description Game loads on window loads
window.onload = gameStart();

// @description Load logic after creating cards
cardLogic();

/*=================
\ Card flip method \
=================*/

// @description Temporary card' list for matching
let openCards = [];
// @description To avoid the opening of third card
let cardLock = false;

function cardLogic() {
  var allCards = document.querySelectorAll('.card');

  allCards.forEach(card => card.addEventListener('click', event => {
    event.preventDefault();
    // @description initialize the timer on first click
    if (!timerState) {
      timeCounter();
      timerState = true;
    }
    // @description Add cards into temporary stack
    openCards.push(card);
    if (cardLock) {
      return true;
    }
    // @description Disable event trigger on cards having 'open','show' and 'match' classes
    card.classList.add('open', 'show', 'disabled');
    if (openCards.length == 2) {

      // @description to check the card similarity
      check();
      // @description Add a move count on opening card pair
      movesCounter();
    }
  }));

  function check() {
    const checking = openCards[0].dataset.card === openCards[1].dataset.card;
    checking ? matchCards() : unMatchCards();
  };

  // @description when cards will match
  function matchCards() {
    openCards.forEach(openCard => {
      openCard.classList.add('open', 'show', 'match', 'disabled');
    });

    openCards = [];
  }

  // @description when cards will not match
  function unMatchCards() {
    openCards.forEach(openCard => {
      openCard.classList.add('wrong');
    });

    // @description lock wrong cards except first two until flipped back
    cardLock = true;
    setTimeout(() => {
      openCards.forEach(openCard => {
        openCard.classList.remove('open', 'show', 'wrong', 'disabled');
      });

      // @description unlock card clicking method
      cardLock = false;
      openCards = [];
    }, 1000);
  }

  /*==============
  \ Moves Counter \
  =============*/
  const moves = document.querySelector('.moves');

  // @description initialize moves counter
  let allMoves = 0;

  function movesCounter() {
    allMoves++;
    allMoves == 1 ? moves.innerText = `${allMoves} Move` : moves.innerText = `${allMoves} Moves`;
    starsCounter(allMoves);

    // @description Check win status
    checkWin();
  }

  /*=============
  \ Stars rating \
  =============*/
  const stars = document.querySelector('.stars');
  // @description popup winner message
  const popupMsg = document.querySelector(".popupMsg");
  // @description popup stars
  const popupStars = document.querySelector(".final_stars");
  // @description winner prize
  const prize = document.querySelector(".prize");

  let starsCounter = allMoves => {
    switch (allMoves) {
      case 15:
        stars.children[2].children[0].classList.remove('fa-star');
        stars.children[2].children[0].classList.add('fa-star-o');

        popupMsg.innerText = "Well played !";
        popupStars.children[2].remove();
        break;
      case 20:
        stars.children[1].children[0].classList.remove('fa-star');
        stars.children[1].children[0].classList.add('fa-star-o');

        popupMsg.innerText = "Not Bad !";
        popupStars.children[1].remove();
        break;
      case 25:
        stars.children[0].children[0].classList.remove('fa-star');
        stars.children[0].children[0].classList.add('fa-star-o');

        popupMsg.innerText = "Keep it up !";
        popupStars.children[0].remove();
        prize.innerHTML = `<i class="fa fa-3x fa-gift"></i>`;
        break;
      default: prize.innerHTML = `<i class="fa fa-3x fa-trophy"></i>`;
    }
  }

  /*============
  \ -- Timer -- \
  ===========*/

  const timer = document.querySelector('.timer');

  let minutes = 0;
  let seconds = 0;
  let timerState = false;

  // @description Timer function
  let timerSettings;

  function timeCounter() {
    timerSettings = setInterval(() => {
      seconds++;
      if (seconds == 60) {
        seconds = 0;
        minutes++;
      }
      timer.innerText = timeFormat(seconds, minutes);
    }, 1000);
  }

  // @description Showing the time in correct format
  let timeFormat = (ss, mm) => {
    ss = seconds < 10 ? `0${seconds}` : seconds;
    mm = minutes < 10 ? `0${minutes}` : minutes;
    return `${mm}:${ss}`;
  };

  // @description Stop the timer
  function stopTimer() {
    clearInterval(timerSettings);
    timerState = false;
  }

  /*=====================
  \ Check winning status \
  =====================*/

  function checkWin() {
    let pairedCards = document.querySelectorAll('.match');
    if (pairedCards.length === 16) {

      // @description to show the winner popup
      winPopup();
    }
  }

  /*=============
  \ Restart game \
  =============*/
  const restart = document.querySelector('.restart');

  restart.addEventListener('click', () => {
    const restartBox = confirm("Are you sure to restart the game ?");
    if (restartBox) {
      document.location.reload();
    }
  });

  /*=============
  \ Winner Popup \
  =============*/

  function winPopup() {
    stopTimer();

    // @description to print the timer
    document.querySelector('.final_timer').innerText = timer.innerText;

    // @description to print the moves
    document.querySelector(".final_moves").innerText = allMoves;

    // @description popup
    const popupBox = document.querySelector(".overlay");
    popupBox.classList.add("show");

    // @description to print the moves
    document.querySelector(".replay").addEventListener("click", () => {
      this.location.reload();
    });
  }
}