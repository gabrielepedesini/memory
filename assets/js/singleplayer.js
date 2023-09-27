// CHRONOMETER

let getHours = document.querySelector('.hours');
let getMinutes = document.querySelector('.minutes');
let getSeconds = document.querySelector('.seconds');
let getCentiseconds = document.querySelector('.miliseconds');

let startBtn = document.querySelector('.start-lap');
let stopBtn = document.querySelector('.stop-lap');
let resetBtn = document.querySelector('.reset-lap');
let freezBtn = document.querySelector('.freez-lap');

let autoGen = document.querySelector('.lap-overview');
let clearLap = document.querySelector('.clear-lap-buttons');

let timerContainer = document.querySelector('.time-container');
let timeOverview = document.querySelector('.lap-overview');

let hours_time = 0;
let minutes_time = 0;
let seconds_time = 0;
let centiseconds_time = 0;

let timer = '';

let coutnLap = 0;

let cronos = {

	count() {

//---------------------Seconds---------------------//
		
        if(centiseconds_time < 99){
			//autoincement value if this is less that 99
			centiseconds_time ++;
			//update first digit if the time is less  that 10
			centiseconds_time = ((centiseconds_time < 10) ? '0' : '') + centiseconds_time;
			//display that result to the UI
			getCentiseconds.innerHTML  = centiseconds_time;
		}

		if(centiseconds_time == 99){
			centiseconds_time = -1;
		}
     
		if(centiseconds_time == 0){
			//same as above
			seconds_time++;
			seconds_time = ((seconds_time < 10) ? '0' :'') + seconds_time;

			getSeconds.innerHTML = seconds_time; 

		}

//------------------Minutes----------------------//

		if(seconds_time == 59){
			seconds_time = -1;
		}

		if((seconds_time == 0) && (centiseconds_time == 0)){
			minutes_time++;

			minutes_time = ((minutes_time < 10 ? '0' : '')) + minutes_time;

			getMinutes.innerHTML = minutes_time;
		}

//-------------------Hours-----------------------//
		
        if(minutes_time == 59){
			minutes_time = -1;
		}

		if ((centiseconds_time == 0) && (seconds_time == 0) && (minutes_time == 0)) {
			hours_time ++;
			hours_time = ((hours_time < 10) ? '0' : '') + hours_time;
			getHours.innerHTML = hours_time;
		}

	},
    
	initialization(){
		timer = setInterval(this.count, 10);
	},

	stop(){
		let stop  = clearInterval(timer);
	},

	resetLap(){
        let stop  = clearInterval(timer);
		
		getMinutes.innerHTML = '00';
		minutes_time = 0;

		getSeconds.innerHTML = '00';
		seconds_time= 0;

		getCentiseconds.innerHTML = '00'; 
 		centiseconds_time = 0;
	},
	
}

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

// CHECK EQUALITY

function checkEquality(array) {

    if(array[0] === array[1]) {
        return 1;
    } else {
        return 0;
    }
}

// WIN CHECKER

function winChecker() {
    
    if(turn === 12) {

        cronos.stop();

        let minutesElement = document.querySelector('.minutes.timer');
        let secondsElement = document.querySelector('.seconds.timer');
        let millisecondsElement = document.querySelector('.miliseconds.timer');

        let minutes = parseInt(minutesElement.innerText, 10);
        let seconds = parseInt(secondsElement.innerText, 10);
        let milliseconds = parseInt(millisecondsElement.innerText, 10);

        const popupContainer = document.querySelector('.popup-container');
        const popupMessage = document.getElementById('popup-message');
        popupMessage.innerText = minutes + ' : ' + seconds + ' . ' + milliseconds;
        popupContainer.style.display = 'flex';
    }
}

// GAME

let counterCheck = 0;
let turn = 0;
let cells = document.querySelectorAll('.cell');
let arr = [];
let firstMove = 1;

function game() {

    function clickHandler(event) {

        if(firstMove === 1) {
            cronos.initialization();

            firstMove = 0;
        }

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
                
                winChecker();
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

// RESET 

function resetGame() {
    // Reset game variables to their initial values
    counterCheck = 0;
    turn = 0;
    arr = [];
    firstMove = 1;

    // Remove 'temp', 'flip', 'hide', and 'correct' classes from all cells
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('temp', 'flip', 'correct', 'block');
        cell.querySelector('.back').classList.remove('hide');
    });

    // Random Cards
    randomCards();

    // Reset Chrono
    cronos.resetLap();

    // Remove Popup
    document.querySelector('.popup-container').style.display = 'none';

    // Clear any win message
    console.log('Game reset');
}

const btnRestart = document.querySelector('.reset-btn');
const btnEnd = document.querySelector('.btn-end');

btnRestart.addEventListener('click', resetGame);
btnEnd.addEventListener('click', resetGame);