/*----- constants -----*/
"use strict;"

const EMOJI = [ 
  { "img" : "img/emoji/ambulance.png",            },  // 0
  { "img" : "img/emoji/art.png",                  },  // 1
  { "img" : "img/emoji/bell.png",                 },  // 2
  { "img" : "img/emoji/bellhop_bell.png",         },  // 3
  { "img" : "img/emoji/boom.png",                 },  // 4
  { "img" : "img/emoji/cake.png",                 },  // 5
  { "img" : "img/emoji/camel.png",                },  // 6
  { "img" : "img/emoji/christmas_tree.png",       },  // 7
  { "img" : "img/emoji/church.png",               },  // 8
  { "img" : "img/emoji/closed_book.png",          },  // 9
  { "img" : "img/emoji/corn.png",                 },  // 10 
  { "img" : "img/emoji/crown.png",                },  // 11 
  { "img" : "img/emoji/cupid.png",                },  // 12 
  { "img" : "img/emoji/dog2.png",                 },  // 13 
  { "img" : "img/emoji/duck.png",                 },  // 14 
  { "img" : "img/emoji/eagle.png",                },  // 15
  { "img" : "img/emoji/earth_americas.png",       },  // 16
  { "img" : "img/emoji/elephant.png",             },  // 17
  { "img" : "img/emoji/eyes.png",                 },  // 18
  { "img" : "img/emoji/fire_engine.png",          },  // 19
  { "img" : "img/emoji/floppy_disk.png",          },  // 20
  { "img" : "img/emoji/football.png",             },  // 21
  { "img" : "img/emoji/four_leaf_clover.png",     },  // 22
  { "img" : "img/emoji/giraffe_face.png",         },  // 23
  { "img" : "img/emoji/grapes.png",               },  // 24
  { "img" : "img/emoji/green_apple.png",          },  // 25
  { "img" : "img/emoji/green_book.png",           },  // 26
  { "img" : "img/emoji/headphones.png",           },  // 27
  { "img" : "img/emoji/house_with_garden.png",    },  // 28
  { "img" : "img/emoji/icecream.png",             },  // 29
  { "img" : "img/emoji/idea.png",                 },  // 30
  { "img" : "img/emoji/iphone.png",               },  // 31
  { "img" : "img/emoji/it.png",                   },  // 32
  { "img" : "img/emoji/jack_o_lantern.png",       },  // 33
  { "img" : "img/emoji/maple_leaf.png",           },  // 34
  { "img" : "img/emoji/moneybag.png",             },  // 35
  { "img" : "img/emoji/mostly_sunny.png",         },  // 36
  { "img" : "img/emoji/mushroom.png",             },  // 37
  { "img" : "img/emoji/musical_score.png",        },  // 38
  { "img" : "img/emoji/nerd_face.png",            },  // 39
  { "img" : "img/emoji/old_key.png",              },  // 40
  { "img" : "img/emoji/peach.png",                },  // 41
  { "img" : "img/emoji/pizza.png",                },  // 42
  { "img" : "img/emoji/pretzel.png",              },  // 43
  { "img" : "img/emoji/printer.png",              },  // 44
  { "img" : "img/emoji/pushpin.png",              },  // 45
  { "img" : "img/emoji/recycle.png",              },  // 46
  { "img" : "img/emoji/saxophone.png",            },  // 47
  { "img" : "img/emoji/scales.png",               },  // 48
  { "img" : "img/emoji/snow_capped_mountain.png", },  // 49
  { "img" : "img/emoji/strawberry.png",           },  // 50
  { "img" : "img/emoji/sunflower.png",            },  // 51
  { "img" : "img/emoji/sunrise.png",              },  // 52
  { "img" : "img/emoji/taxi.png",                 },  // 53
  { "img" : "img/emoji/tractor.png",              },  // 54
  { "img" : "img/emoji/trident.png",              },  // 55
  { "img" : "img/emoji/volcano.png",              },  // 56
  { "img" : "img/emoji/watermelon.png",           },  // 57
  { "img" : "img/emoji/whale.png",                },  // 58
];

const MAX_GUESSES = 40;
const NUM_EMOJI_PAIRS = 15;
const NUM_SQUARES = (NUM_EMOJI_PAIRS * 2);
const NUM_GUESSES_PER_TURN = 2;

const BOARD_SHOW_NUMBER = 0;
const BOARD_SHOW_EMOJI  = 1;

const EMOJI_INIT = -1; // Emoji value not assinged yet

/*----- state variables -----*/
let numGuesses;
let squareSelected;
let numEmojiPairsFound;
let board;
let emojiBoard;

/*----- cached elements  -----*/
const sqrEls            = [...document.querySelectorAll('#board > div')]
const boardEl           = document.getElementById('board');
const statusBoxEl       = document.getElementById('status');
const playGameBtnEl     = document.getElementById('playGameBtn');
const numGuessesEl      = document.getElementById('numGuessesTxt');

/* event listeners */
boardEl.addEventListener('click',function(evt) {
  let id = evt.target.id; 
  if ( numGuesses === -1                       ||   // Game hasn't started yet.
       numEmojiPairsFound ===  NUM_EMOJI_PAIRS ||   // Game is over
       board[id-1] !== BOARD_SHOW_NUMBER) return;   // Already processed

  if ( squareSelected[0].sqrId === 0 ) {
      /* First square being chosen */
      squareSelected[0].sqrId = id;
      board[id-1] = BOARD_SHOW_EMOJI;
      setStatusBoxMsg('Select 2nd square');
  } else if (squareSelected[1].sqrId === 0 ) {
      /* Second square being chosen */
      squareSelected[1].sqrId = id;
      board[id-1] = BOARD_SHOW_EMOJI;
      setTimeout(analyzeSelectedSquares, 600)
  } 
  render();
} );

playGameBtnEl.addEventListener('click',function(evt) {
  let id = evt.target.id;
  setStatusBoxMsg('Select 1st square');
  init(0); /* init() calls render() */
});

/*----- functions -----*/
function initBoard() {
  board = Array(NUM_SQUARES).fill(BOARD_SHOW_NUMBER);
}

function initEmojiBoard() {

  /* To keep the game interesting, the number of images
     far outweigh the number of squares. So, let's randomly
     pick images from the pool of images we have. */

  let tmp = Array(EMOJI.length).fill(0);
  for (id = 0 ;id < EMOJI.length; id++) {
    tmp[id] = id;
  }

  /* shake the hat to mix up the emoji's. */
  let tmp2 = shuffle(tmp);

  /* Copy the first NUM_EMOJI_PAIRS emojis into an array (twice) */
  /* This is enough to fill all the squares */
  let tmp3 = Array(NUM_SQUARES).fill(0);
  for (id = 0 ;id < NUM_EMOJI_PAIRS; id++) {
    tmp3[id]                   = tmp2[id]; // put two copies in the emojiBoard array
    tmp3[id + NUM_EMOJI_PAIRS] = tmp2[id];
  }

  /* Put all the emoji's in a hat again and shake well */
  emojiBoard = shuffle(tmp3);
}

/* This shuffle code was found on stack overflow:
* https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array */
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  
  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
  
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function analyzeSelectedSquares() {
  if ( squareSelected[0].sqrId !==0 && squareSelected[1].sqrId !== 0 ) {
    sqrId0 = squareSelected[0].sqrId;
    sqrId1 = squareSelected[1].sqrId;
    emojiId0 = emojiBoard[sqrId0-1];
    emojiId1 = emojiBoard[sqrId1-1];
    if (emojiId0 === emojiId1) {
      setStatusBoxMsg('Match!');
      numEmojiPairsFound++;
      setTimeout(processTurnOver, 600)
    } else {
      setBoardValue (BOARD_SHOW_NUMBER);
      setStatusBoxMsg('No Match!');
      setTimeout(processTurnOver, 600)
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
  numGuesses += 1;
  if ( numEmojiPairsFound ===  NUM_EMOJI_PAIRS ) {
    setStatusBoxMsg('You Win!!!!');
    appendStatusBoxMsg("To play again, click on 'Play Game'");
  } else if ( numGuesses >=  MAX_GUESSES ) {
    setStatusBoxMsg('You Lose!!!!');
    appendStatusBoxMsg("To play again, click on 'Play Game'");
  } else {
    initSquareSelected();
    setStatusBoxMsg('Select first square');
  }
  render();
}

function init(numGuess) {
  numGuesses = numGuess;
  numEmojiPairsFound = 0;
  initBoard();
  initEmojiBoard();
  initSquareSelected();
  render();
}

function setStatusBoxMsg(msg) {
  statusBoxEl.innerText = msg;
  statusBoxEl.classList.add('ctr');
}

function appendStatusBoxMsg(msg) {
  innerHTML = statusBoxEl.innerHTML;
  innerHTML = innerHTML + "<br>" + msg;
  statusBoxEl.innerHTML = innerHTML;
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
         sqrEl.innerText = `${id}`;
         break;
       case BOARD_SHOW_EMOJI:
         sqrEl = sqrEls[x];
         sqrEl.innerText="";
         const img = document.createElement('img');
         img.src=EMOJI[emojiBoard[x]].img;
         img.height="90";
         img.width="90";
         img.id=`img-${x+1}`
         sqrEl.appendChild(img);
         break;
      default:
        alert("Invalid board value");
    }
  }
}

function renderPlayGameBtn() {
  if ( numGuesses === -1 ||                         // Game not started
       numGuesses === MAX_GUESSES ||                // Game lost
       numEmojiPairsFound ===  NUM_EMOJI_PAIRS ) {  // Game won
    playGameBtnEl.style.visibility = 'visible';
  } else {
    playGameBtnEl.style.visibility = 'hidden';
  }
}

function renderNumGuesses() {
  if ( numGuesses === -1 ) {
    numGuessesEl.style.visibility = 'hidden';
  } else {
    numGuessesEl.style.visibility = 'visible';
  }
  numGuessesEl.innerText = `Number of Guesses: ${numGuesses} out of ${MAX_GUESSES}`
}

function cheat2win() {
  if ( numGuesses === -1 ) { 
    console.log("No cheating!")
    return 0;
  }
  /* Prints out matching squares */
  let found = [ -1];
  for ( x=0; x < emojiBoard.length; x++ ) {
    for ( y=0; y < emojiBoard.length; y++ ) {
      if ( y != x ) {
        if ( emojiBoard[y] == emojiBoard[x]) {
          if ( !found.includes(emojiBoard[x])) {
            found.push(emojiBoard[x]);
            sqrx = x + 1;
            sqry = y + 1;
            emojiId = emojiBoard[x];
            filename = `${EMOJI[emojiId].img}`.replace("img/emoji/","");
            console.log(`${sqrx} and ${sqry} = ${filename}`)
            break;
          } 
        }
      }
    }
  }
  return 0;
}

function render() {
  renderBoard();
  renderPlayGameBtn();
  renderNumGuesses();
}

/* ------------ MAIN ------------  */
init(-1);