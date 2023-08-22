/*----- constants -----*/
"use strict;"
const EMOJI = [ 
  { "img" : ""                                 },  // 0
  { "img" : "img/emoji/ambulance.png",         },  // 1
  { "img" : "img/emoji/art.png",               },  // 2
  { "img" : "img/emoji/bell.png",              },  // 3
  { "img" : "img/emoji/boom.png",              },  // 4
  { "img" : "img/emoji/cake.png",              },  // 5
  { "img" : "img/emoji/camel.png",             },  // 6
  { "img" : "img/emoji/church.png",            },  // 7
  { "img" : "img/emoji/dog2.png",              },  // 8 
  { "img" : "img/emoji/duck.png",              },  // 9 
  { "img" : "img/emoji/eagle.png",             },  // 10
  { "img" : "img/emoji/earth_americas.png",    },  // 11
  { "img" : "img/emoji/elephant.png",          },  // 12
  { "img" : "img/emoji/eyes.png",              },  // 13
  { "img" : "img/emoji/fire_engine.png",       },  // 14
  { "img" : "img/emoji/floppy_disk.png",       }   // 15
];

const REBUS_PUZZLE = { // partial list
  "img" : "",                  "solution" : "",  "phoneticSolution" : "",  // 0
  "img" : "img/puzzle3.png",   
    "solution" : "Climb Every Mountain",  
    "phonetic" : "K + lime (climb) f + free (every) m + hound + ten (mountain)",
};

const MAX_GUESSES = 30;
const NUM_EMOJI_PAIRS = 15;
const NUM_SQUARES = (NUM_EMOJI_PAIRS * 2)
const NUM_GUESSES_PER_TURN = 2;

const BOARD_SHOW_NUMBER = 0;
const BOARD_SHOW_EMOJI  = 1;
const BOARD_SHOW_REBUS  = 2;

const EMOJI_INIT = 0; // Emoji value not assinged yet

/*----- state variables -----*/
let board;
let emojiBoard;
let numGuesses;
let squareSelected;
let rebusNum;
let numEmojiPairsFound;

/*----- cached elements  -----*/
const sqrEls            = [...document.querySelectorAll('#board > div')]
const boardEl           = document.getElementById('board');
const statusBoxEl       = document.getElementById('status');
const rebusAnswerTxtEl  = document.getElementById('rebusAnswerTxt');
const rebusAnswerBtnEl  = document.getElementById('rebusAnswerBtn');
const playGameBtnEl     = document.getElementById('playGameBtn');
const numGuessesEl      = document.getElementById('numGuessesTxt');

/* event listeners */
boardEl.addEventListener('click',function(evt) {
  let id = evt.target.id; /* console.log(`id=${id}`) */
  if ( numGuesses === -1 ) return; // Game hasn't started yet.
  if ( numEmojiPairsFound ===  NUM_EMOJI_PAIRS ) return; // Game is over
  if ( board[id-1] !== BOARD_SHOW_NUMBER) return; // Already processed

  if ( squareSelected[0].sqrId === 0 ) {
      /* First square being chosen */
      squareSelected[0].sqrId = id;
      board[id-1] = BOARD_SHOW_EMOJI;
      setStatusBoxMsg('Select 2nd square');
  } else if (squareSelected[1].sqrId === 0 ) {
      /* Second square being chosen */
      squareSelected[1].sqrId = id;
      board[id-1] = BOARD_SHOW_EMOJI;
      numGuesses += 1;
      setTimeout(analyzeSelectedSquares, 2000)
  } else {
    alert('boardEl.addEventLisetr.click: We should not get here!')
  }
  render();
} );

statusBoxEl.addEventListener('click',function(evt) {
  let id = evt.target.id;
  /* console.log(`id=${id}`) */
});
rebusAnswerTxtEl.addEventListener('click',function(evt) {
  let id = evt.target.id;
  /* console.log(`id=${id}`) */
});
rebusAnswerBtnEl.addEventListener('click',function(evt) {
  let id = evt.target.id;
  /* console.log(`id=${id}`) */
});

playGameBtnEl.addEventListener('click',function(evt) {
  let id = evt.target.id;
  /* console.log(`id=${id}`) */
  emojiBoard = [ 
    { "value" : 1, "imgId" : 0 },
    { "value" : 2, "imgId" : 0 },
    { "value" : 3, "imgId" : 0 },
    { "value" : 4, "imgId" : 0 },
    { "value" : 5, "imgId" : 0 },
    { "value" : 6, "imgId" : 0 },
    { "value" : 7, "imgId" : 0 },
    { "value" : 8, "imgId" : 0 },
    { "value" : 9, "imgId" : 0 },
    { "value" : 10, "imgId" : 0 },
    { "value" : 11, "imgId" : 0 },
    { "value" : 12, "imgId" : 0 },
    { "value" : 13, "imgId" : 0 },
    { "value" : 14, "imgId" : 0 },
    { "value" : 15, "imgId" : 0 },
    { "value" : 1, "imgId" : 0 },
    { "value" : 2, "imgId" : 0 },
    { "value" : 3, "imgId" : 0 },
    { "value" : 4, "imgId" : 0 },
    { "value" : 5, "imgId" : 0 },
    { "value" : 6, "imgId" : 0 },
    { "value" : 7, "imgId" : 0 },
    { "value" : 8, "imgId" : 0 },
    { "value" : 9, "imgId" : 0 },
    { "value" : 10, "imgId" : 0 },
    { "value" : 11, "imgId" : 0 },
    { "value" : 12, "imgId" : 0 },
    { "value" : 13, "imgId" : 0 },
    { "value" : 14, "imgId" : 0 },
    { "value" : 15, "imgId" : 0 }
  ];
  numGuesses = 0;
  setStatusBoxMsg('Select 1st square');
  initSquareSelected();
  render();
});

/*----- functions -----*/
function analyzeSelectedSquares() {
  console.log("We are in analyzeSelectedSquares");
  if ( squareSelected[0].sqrId !==0 && squareSelected[1].sqrId !== 0 ) {
    console.log("We are also in analyzeSelectedSquares");
    console.log(squareSelected);
    emojiId0 = emojiBoard[squareSelected[0].sqrId].value;
    emojiId1 = emojiBoard[squareSelected[1].sqrId].value;
    if (emojiId0 === emojiId1) {
      /*  We have a match */
      console.log("Match");
      setBoardValue (BOARD_SHOW_REBUS);
      setStatusBoxMsg('Match!');
      setTimeout(showRebusPuzzle, 2000)
    } else {
      /*  We not have a match */
      console.log("No Match");
      setBoardValue (BOARD_SHOW_NUMBER);
      setStatusBoxMsg('No Match!');
      setTimeout(processTurnOver, 2000)
    }
  }
  render();
}
function setBoardValue (value) {
  for ( x = 0 ; x < NUM_GUESSES_PER_TURN; x++ ) {
    /* sqrId are 1-based and board[] is 0-based */
    index = squareSelected[x].sqrId-1;
    board[index] = value;
  }
}
function processTurnOver (){
  initSquareSelected();
  setStatusBoxMsg('Select first square');
  render();
}

function showRebusPuzzle() {
  setTimeout(processTurnOver, 2000)
  console.log("ShowRebusPuzzle")
}

function init() {
  board = Array(NUM_SQUARES).fill(BOARD_SHOW_NUMBER);
  emojiBoard = Array(NUM_SQUARES).fill(EMOJI_INIT);
  emojiBoard = [
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 },
    { "value" : 0, "imgId" : 0 }
  ];
  numGuesses = -1;
  rebusNum = 1;
  numEmojiPairsFound = 0;
  appendStatusBoxMsg("To begin, click on 'Play Game'");
  render();
}

function setStatusBoxMsg(msg) {
  statusBoxEl.innerText = msg;
}

function appendStatusBoxMsg(msg) {
  statusBoxEl.append(msg);
}

function initSquareSelected() {
  squareSelected = [
    { "sqrId" : 0, "emojiId" : 0 },
    { "sqrId" : 0, "emojiId" : 0 } 
  ];
}

function renderBoard() {
  for (let x = 0; x < board.length; x++) {
    let id = x + 1;
    switch ( board[x] ) {
       case BOARD_SHOW_NUMBER:
         sqrEl = sqrEls[x];
         sqrEl.innerText=`${id}`;
         emojiBoard[x].imgId=0;
         imgId = emojiBoard[x].imgId
         /* console.log(`x=${x}, board[x]=${board[x]} sqrEl=${sqrEl} imgId=${imgId}`) */
         break;
       case BOARD_SHOW_EMOJI:
         sqrEl = sqrEls[x];
         sqrEl.innerText="";
         const img = document.createElement('img');
         img.src=EMOJI[emojiBoard[x].value].img;
         img.height="100";
         img.width="100";
         img.id=`img-${x+1}`
         emojiBoard[x].imgId = img.id;
         sqrEl.appendChild(img);
         /* console.log(sqrEl) */
         break;
       case BOARD_SHOW_REBUS:
         break;
      default:
        alert("Invalid board value");
    }
  }
}

function renderStatusBox() {
  if ( numGuesses === -1 ) return;
}

function renderRebusAnswer() {
  if ( numEmojiPairsFound ===  NUM_EMOJI_PAIRS ) {
    rebusAnswerTxtEl.style.visibility = 'visible';
    rebusAnswerBtnEl.style.visibility = 'visible';
  } else {
    rebusAnswerTxtEl.style.visibility = 'hidden';
    rebusAnswerBtnEl.style.visibility = 'hidden';
  }
}

function renderPlayGameBtn() {
  /* console.log(`numGuesses = ${numGuesses}`) */
  if ( numGuesses ===  -1  ) {
    playGameBtnEl.style.visibility = 'visible';
  } else {
    playGameBtnEl.style.visibility = 'hidden';
  }
}

function renderNumGuesses() {
  if ( numGuesses === -1 || numEmojiPairsFound ===  NUM_EMOJI_PAIRS ) {
    numGuessesEl.style.visibility = 'hidden';
  } else {
    numGuessesEl.style.visibility = 'visible';
  }
  numGuessesEl.innerText = `Number of Guesses = ${numGuesses} out of ${MAX_GUESSES}`
}

function render() {
  renderBoard();
  renderStatusBox();
  renderRebusAnswer();
  renderPlayGameBtn();
  renderNumGuesses();
}

/* ------------ MAIN ------------  */
init();