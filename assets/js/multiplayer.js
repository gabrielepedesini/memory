// RANDOM IMAGE FOR CARDS

randomCards();

function randomCards() {

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    
    function selectAndDeleteRandom(arr, number) {
        if (arr.length === 0) {
            return null;
        }
    
        const randomIndex = getRandomInt(arr.length);
        const selectedNumber = arr[randomIndex];
    
        const selector = `.cell[data-number="${selectedNumber}"] .card`;
        const cardElement = document.querySelector(selector);
    
        const newSrc = `assets/img/${number}.png`; // Create the new source
        cardElement.src = newSrc; // Set the new source to the image
    
        // Remove the selected number from the array
        arr.splice(randomIndex, 1);
    
        return selectedNumber;
    }
    
    let highestNumber = 24; // Change this to the highest number in your array
    let numbersArray = Array.from({ length: highestNumber }, (_, i) => i + 1);
    let imgNumber = 1;
    
    while (numbersArray.length > 0) {
        const selectedNumber1 = selectAndDeleteRandom(numbersArray, imgNumber);
        console.log('Selected number:', selectedNumber1);
    
        const selectedNumber2 = selectAndDeleteRandom(numbersArray, imgNumber);
        console.log('Selected number:', selectedNumber2);
    
        imgNumber++;
    }
    
    console.log('Array is now empty:', numbersArray);
}

// PLAYER LABELS

function playerLabels() {
    
    let i = 1;

    while(i <= playersNumber) {
        const selector = `.player-score[data-number="${i}"]`;
        const scoreLabel = document.querySelector(selector);

        scoreLabel.style.display = 'flex';

        i++;
    }

    return;
}

// CHECK EQUALITY

function checkEquality(array) {

    if(array[0] === array[1]) {
        return 1;
    } else {
        return 0;
    }
}

// CHANGE PLAYER 

function changePlayer() {
    // Create a temporary variable to hold the updated player number
    let updatedPlayer;

    const selector = `.player-score[data-number="${player}"] .player-score-tag`;
    const scoreTag = document.querySelector(selector);

    if (player !== 1) {
        scoreTag.classList.add('active-player');

        // Calculate the updated player number and use it in the selector
        updatedPlayer = player - 1;
        const selector2 = `.player-score[data-number="${updatedPlayer}"] .player-score-tag`;
        const scoreTag2 = document.querySelector(selector2);

        scoreTag2.classList.remove('active-player');
    } else {
        scoreTag.classList.add('active-player');

        // Set updatedPlayer to the last player number
        updatedPlayer = playersNumber;
        const selector2 = `.player-score[data-number="${updatedPlayer}"] .player-score-tag`;
        const scoreTag2 = document.querySelector(selector2);

        scoreTag2.classList.remove('active-player');
    }
    
    return;
}


// CHANGE SCORE

function changeScore(array) {

    const selector = `.player-score[data-number="${player}"] .score`;
    const scoreNumber = document.querySelector(selector);

    scoreNumber.textContent = array[player - 1];
    scoreNumber.classList.add('pulse');

    setTimeout(() => {
        scoreNumber.classList.remove('pulse');
    }, 1000);

    return;
}

// WIN CHECKER

function winChecker(array) {
    
    if(array[player - 1] >= (12/playersNumber + 1)) {

        const popupContainer = document.querySelector('.popup-container')
        const popupMessage = document.getElementById('popup-message');
        popupMessage.innerText = 'Player ' + player + ' wins!';
        popupContainer.style.display = 'flex';
    }

    if(turn === 12) {

        const popupContainer = document.querySelector('.popup-container')
        const popupMessage = document.getElementById('popup-message');
        popupMessage.innerText = 'Draw!';
        popupContainer.style.display = 'flex';
    }
}

// GAME

let playersNumber = 3;
let player = 1;
let points = [0, 0, 0, 0];
let counterCheck = 0;
let turn = 0;
let cells = document.querySelectorAll('.cell');
let arr = [];

function game() {
    
    console.log(player);

    function clickHandler(event) {

        counterCheck++;

        // The clicked link
        const link = event.currentTarget; 
        
        // Remove the click event listener for this link
        link.classList.add('temp');
        link.classList.add('flip');

        const backElement = link.querySelector('.back');

        setTimeout(() => {
            backElement.classList.add('hide');
        }, 180);

        const imgElement = link.querySelector('.card');
        
        arr[counterCheck - 1] = imgElement.src;

        // After 2 picks, evaluates
        if(counterCheck === 2) {

            let win = checkEquality(arr);

            if(win === 0) {

                // Block the cards
                const cellElements = document.querySelectorAll('.cell');

                cellElements.forEach(element => {
                    element.classList.add('block');
                });

                const tempElements = document.querySelectorAll('.temp');

                tempElements.forEach(element => {
                    setTimeout(() => {
                        element.classList.remove('temp');
                        element.classList.remove('flip');
                        setTimeout(() => {
                            element.querySelector('.back').classList.remove('hide');
                        }, 180);
                    }, 500);
                });

                setTimeout(() => {
                    cellElements.forEach(element => {
                        element.classList.remove('block');
                    });
                }, 500);

                if(player < playersNumber) {
                    player++;
                } else {
                    player = 1;
                }

                console.log(player);

                setTimeout(() => {
                    changePlayer();
                }, 500);
            }

            if(win === 1) {
                
                const tempElements = document.querySelectorAll('.temp');

                tempElements.forEach(element => {
                    setTimeout(() => {
                        element.classList.remove('temp');
                        element.classList.add('correct');
                    }, 600);
                });

                turn++;

                points[player - 1]++;

                changeScore(points);
                
                winChecker(points);
            }

            counterCheck = 0;

            return;
        }
    }
    
    // Loop to check clicks
    cells.forEach(link => {
        link.addEventListener('click', clickHandler);
    });
}

game();

// REMOVE CHOOSE

let choosePlayer = document.querySelectorAll('.btn-mode');
let modalChoose = document.querySelector('.fullscreen-modal');

function chooseMode(event) {
    
    // The clicked link
    const link = event.currentTarget; 

    const number = parseInt(link.innerText.trim());

    playersNumber = number;
            
    modalChoose.classList.add('slide-up');

    setTimeout(() => {
        modalChoose.style.display = 'none';
    }, 800);

    playerLabels();
}

choosePlayer.forEach(link => {
    link.addEventListener('click', chooseMode);
});

// RESET 

function resetGame() {
    // Reset game variables to their initial values
    player = 1;
    points = [0, 0, 0, 0];
    counterCheck = 0;
    turn = 0;
    arr = [];

    // Remove 'temp', 'flip', 'hide', and 'correct' classes from all cells
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('temp', 'flip', 'correct', 'block');
        cell.querySelector('.back').classList.remove('hide');
    });

    // Reset the score labels to 0
    const scoreLabels = document.querySelectorAll('.player-score .score');
    scoreLabels.forEach(scoreLabel => {
        scoreLabel.textContent = '0';
    });

    // Reset the player labels and active-player class
    const playerTags = document.querySelectorAll('.player-score .player-score-tag');
    playerTags.forEach((playerTag, index) => {
        playerTag.textContent = `Player ${index + 1}`;
        playerTag.classList.remove('active-player');
    });

    // Active Player 1
    const selector = `.player-score[data-number="${player}"] .player-score-tag`;
    const scoreTag = document.querySelector(selector);
    scoreTag.classList.add('active-player');

    // Random Cards
    randomCards();

    // Remove Popup
    document.querySelector('.popup-container').style.display = 'none';

    // Clear any win message
    console.log('Game reset');
}

const btnRestart = document.querySelector('.reset-btn');
const btnEnd = document.querySelector('.btn-end');

btnRestart.addEventListener('click', resetGame);
btnEnd.addEventListener('click', resetGame);