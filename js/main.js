/*----- constants -----*/
const EMOJI = { 
  "img" : "",                                    // 0
  "img" : "img/emoji/ambulance.png",             // 1
  "img" : "img/emoji/art.png",                   // 2
  "img" : "img/emoji/bell.png",                  // 3
  "img" : "img/emoji/boom.png",                  // 4
  "img" : "img/emoji/cake.png",                  // 5
  "img" : "img/emoji/camel.png",                 // 6
  "img" : "img/emoji/church.png",                // 7
  "img" : "img/emoji/dog2.png",                  // 8 
  "img" : "img/emoji/duck.png",                  // 9 
  "img" : "img/emoji/eagle.png",                 // 10
  "img" : "img/emoji/earth_americas.png",        // 11
  "img" : "img/emoji/elephant.png",              // 12
  "img" : "img/emoji/eyes.png",                  // 13
  "img" : "img/emoji/fire_engine.png",           // 14
  "img" : "img/emoji/floppy_disk.png",           // 15
};

const REBUS_PUZZLE = { // partial list
  "img" : "",                  "solution" : "",  "phoneticSolution" : "",  // 0
  "img" : "img/puzzle3.png",   
    "solution" : "Climb Every Mountain",  
    "phonetic" : "K + lime (climb) f + free (every) m + hound + ten (mountain)",
};

const MAX_GUESSES = 30;
const NUM_SQUARES = 30;
const NUM_GUESSES_PER_TURN = 2;

/*----- state variables -----*/
let board
let emojiBoard
let numGuesses
let squareSelected;
let rebusNum

/*----- cached elements  -----*/
const boardEl           = document.getElementById('board');
const statusBoxEl       = document.getElementById('status');
const rebusAnswerTxtEl  = document.getElementById('rebusAnswerTxt');
const rebusAnswerBtnEl  = document.getElementById('rebusAnswerBtn');
const playGameBtnEl     = document.getElementById('playGameBtn');
const numGuessesEl      = document.getElementById('numGuessesTxt');

/* event listeners */
boardEl.addEventListener('click',function(evt) {
  let id = evt.target.id;
  console.log(`id=${id}`)
});
statusBoxEl.addEventListener('click',function(evt) {
  let id = evt.target.id;
  console.log(`id=${id}`)
});
rebusAnswerTxtEl.addEventListener('click',function(evt) {
  let id = evt.target.id;
  console.log(`id=${id}`)
});
rebusAnswerBtnEl.addEventListener('click',function(evt) {
  let id = evt.target.id;
  console.log(`id=${id}`)
});
playGameBtnEl.addEventListener('click',function(evt) {
  let id = evt.target.id;
  console.log(`id=${id}`)
});

/*----- functions -----*/
function init() {
   board = Array(MAX_SQUARES).fill(0);
   emojiBoard = Array(MAX_SQUARES).fill(0);
   numGuesses = 0;
   squareSelected = Array(NUM_GUESSES_PER_TURN).fill(0);
   rebusNum = 1;
}