// satrt time out function
let interval;
function startTimeout() {
  clearInterval(interval); // clear any previous interval
  let timer = document.querySelector(`.timer span`);
  let seconds = 30;
  let minutes = 1;
  interval = setInterval(() => {
    if (seconds > 0) {
      seconds--;
    } else if (minutes > 0 && seconds === 0) {
      seconds = 59;
      minutes--;
    } else if (minutes === 0 && seconds === 0) {
      clearInterval(interval);
      checkLose(); // check if the user lost the game
    }
    timer.innerHTML = `${minutes < 10 ? `0` + minutes : minutes}:${
      seconds < 10 ? `0` + seconds : seconds
    }`;
  }, 1000);
}

// popup for name
let isEffectRunning = false; // for ok button message effect , stop settime out if the effect is running
let yourName;
document.querySelector(`.control-buttons .sp-ok`).onclick = function () {
  yourName = document.querySelector(`.input-name input`).value;
  if (isEffectRunning) return; // if the effect is running, do not run it again
  if (yourName.trim() === "") {
    // check if name is empty or have just spaces
    isEffectRunning = true; // set the flag to true to prevent the effect from running again
    document.querySelector(`.control-buttons p`).classList.remove(`hidden`);
    document.querySelector(`.control-buttons p`).style.display = `block`;
    setTimeout(() => {
      document.querySelector(`.control-buttons p`).classList.add(`hidden`);
      setTimeout(() => {
        document.querySelector(`.control-buttons p`).style.display = `none`;
        isEffectRunning = false; // allow the effect to run again
      }, 1000); // duration of the effect
    }, 3000); // duration befor start the effect
  } else {
    document.querySelector(`.name span`).innerHTML = yourName;
    document.querySelector(`.control-buttons`).remove();
    startTimeout();
  }
};

// close popup span
document.querySelector(`.control-buttons .sp-x`).onclick = function () {
  document.querySelector(`.name span`).innerHTML = `Unknown`;
  document.querySelector(`.control-buttons`).remove();
  startTimeout();
};

let duration = 1000; // The duration of the flip animation
let blocksContainer = document.querySelector(`.memory-game-blocks`);
let blocks = Array.from(blocksContainer.children);
let orderRange = [...Array(blocks.length).keys()]; // create an array of numbers from 0 to blocks.length - 1
Shuffle(orderRange);

// Add order css property to the blocks
blocks.forEach((block, index) => {
  block.style.order = orderRange[index];
  block.addEventListener(`click`, function () {
    flibblock(block);
  });
});

// flip block function
function flibblock(selectedBlock) {
  selectedBlock.classList.add(`is-flipped`);
  // get all flipped card
  let allFlippedBlocks = blocks.filter((f) =>
    f.classList.contains(`is-flipped`)
  );
  if (allFlippedBlocks.length === 2) {
    // stop clicking function
    stopClicking();
    // check match function
    checkMatch(allFlippedBlocks[0], allFlippedBlocks[1]);
  }
}

// check match function
let triesElement = document.querySelector(`.tries span`);
function checkMatch(firstBlock, secondBlock) {
  if (firstBlock.dataset.technology === secondBlock.dataset.technology) {
    firstBlock.classList.remove(`is-flipped`);
    secondBlock.classList.remove(`is-flipped`);
    firstBlock.classList.add(`has-match`);
    secondBlock.classList.add(`has-match`);
    // play sucess audio
    document.getElementById(`success`).play();
    // check if win
    checkWin();
  } else {
    triesElement.innerHTML = parseInt(triesElement.innerHTML) + 1;
    setTimeout(() => {
      firstBlock.classList.remove(`is-flipped`);
      secondBlock.classList.remove(`is-flipped`);
      document.getElementById(`fail`).play();
    }, duration);
  }
}
// stop clicking function
function stopClicking() {
  blocksContainer.classList.add(`stop-clicking`);
  setTimeout(() => {
    blocksContainer.classList.remove(`stop-clicking`);
  }, duration);
}

// shuffle function
function Shuffle(array) {
  let current = array.length,
    temp,
    random;
  while (current > 0) {
    random = Math.floor(Math.random() * current);
    // just simple swap
    temp = array[current];
    array[current] = array[random];
    array[random] = temp;
    current--;
  }
  return array;
}

// win function
function checkWin() {
  if (document.querySelectorAll(`.has-match`).length === blocks.length) {
    // stop the timer
    clearInterval(interval);
    let message = document.querySelector(`.game-over-popup`);
    let title = document.querySelector(`.game-over-popup h2`);
    let pharaph = document.querySelector(`.game-over-popup p`);
    let playAgineButton = document.querySelector(`.game-over-popup button`);
    title.innerHTML = `Congratulations ${
      document.querySelector(`.name span`).innerHTML
    }`;
    pharaph.innerHTML = `You have completed the game in ${triesElement.innerHTML} tries`;
    message.style.display = `flex`;
    // Add player to leaderboard
    addPlayer();
    playAgineButton.onclick = function () {
      message.style.display = `none`;
      blocks.forEach((block) => {
        block.classList.remove(`has-match`, `is-flipped`);
      });
      // reset the timer
      startTimeout();
      // reset the tries count
      triesElement.innerHTML = 0;
    };
  }
}

// lose function
function checkLose() {
  let timer = document.querySelector(`.timer span`).innerHTML;
  if (timer === `00:00`) {
    // stop the timer
    clearInterval(interval);
    let message = document.querySelector(`.game-over-popup`);
    let title = document.querySelector(`.game-over-popup h2`);
    let pharaph = document.querySelector(`.game-over-popup p`);
    let playAgineButton = document.querySelector(`.game-over-popup button`);
    title.innerHTML = `Game Over`;
    pharaph.innerHTML = `You have lost the game in ${triesElement.innerHTML} tries`;
    message.style.display = `flex`;
    playAgineButton.onclick = function () {
      message.style.display = `none`;
      blocks.forEach((block) => {
        block.classList.remove(`has-match`, `is-flipped`);
      });
      // reset the timer
      startTimeout();
      // reset the tries count
      triesElement.innerHTML = 0;
    };
  }
}

console.log(localStorage.getItem("players"));

// player leader-board
// Retrieve the data from localStorage or initialize as an empty array if no data exists
let players = JSON.parse(localStorage.getItem("players")) || [];
// Function to render the leaderboard
function renderLeaderboard() {
  const leaderboardContent = document.getElementById("leader-board-content");
  leaderboardContent.innerHTML = ""; // Clear previous content

  // Sort players by the number of tries (ascending order)
  players.sort((a, b) => a.tries - b.tries);

  // Create elements to display players
  players.forEach((player, index) => {
    const playerDiv = document.createElement("div");
    playerDiv.classList.add("player");
     // Apply special style for the first player
     if (index === 0) {
      playerDiv.classList.add("first-place"); // Add a special class for the first player
    }
    const number = document.createElement(`span`);
    number.classList.add(`number`);
    number.innerHTML = `${index + 1}`;
    const spanicon = document.createElement(`span`);
    spanicon.classList.add(`icon`);
    const icon = document.createElement(`i`);
    icon.classList.add(`fa-regular`, `fa-circle-user`);
    spanicon.appendChild(icon);
     // Add a "king" icon for the first player
     if (index === 0) {
      const kingIcon = document.createElement(`i`);
      kingIcon.classList.add(`fa-solid`, `fa-crown`); // Font Awesome crown icon
       kingIcon.style.color = "gold"; // Gold color for the crown
       spanicon.innerHTML = ``;
      spanicon.appendChild(kingIcon);
    }
    const usernameandtries = document.createElement(`span`);
    usernameandtries.innerHTML = `${player.username}`;
    usernameandtries.classList.add(`username`);
    const trSpan = document.createElement(`span`);
    trSpan.innerHTML = `${player.tries}`;
    usernameandtries.appendChild(trSpan);
    playerDiv.append(number, spanicon, usernameandtries);
    leaderboardContent.appendChild(playerDiv);
  });
}

renderLeaderboard();

function addPlayer() {
  const username = document.querySelector(`.name span`).innerHTML; // Get the player's name
  const tries = parseInt(triesElement.innerHTML); // Get the number of tries
  // Check if fields are not empty
  if (username && tries >= 0) {
    // Add player to the players array
    players.push({ username, tries });
    // Store the updated list in localStorage
    localStorage.setItem("players", JSON.stringify(players));
    // Re-render the leaderboard
    renderLeaderboard();
  }
}

// clear local storage data
document.querySelector(`.clearbtn`).onclick = () => {
  localStorage.removeItem("players");

  players = [];
  const leaderboardContent = document.getElementById("leader-board-content");
  leaderboardContent.innerHTML = "";

  renderLeaderboard();
};

// enchanced
// music when user add name
// timer , if finshed apper popup say the game is over and show the number of tries, then rest game
// create leader board to show the best score , use local storage
// can increase number of blocks , can generate blocks with javascript , object have 100 blocks or images js take from it randomly

// notes
// can use new or not use new keyword to create an array ,both will create an array of 10 undefined elements,but using new keyword is more explicit and clear
console.log(Array(10)); // create array of 10 undefined elements
console.log(Array(10)[0]); // undefined
console.log(new Array(10)); // create array of 10 undefined elements
console.log(new Array(10)[2]); // undefined
console.log(new Array(10).length); // 10

// The sort() method in JavaScript is used to arrange the elements of an array in place and returns the sorted array. By default, it converts elements to strings and sorts them alphabetically.
//If you want to sort numbers correctly, you need to provide a compare function.

/* 
-- compare function in sort() method:
  1. a - b (Ascending Order - number)
      -- If the result is negative, a comes before b.
      -- If the result is positive, b comes before a.
      -- If the result is zero, their order doesn't change.
      
  2. b - a (Descending Order - number)
      -- If the result is negative, b comes before a.
      -- If the result is positive, a comes before b.
      -- If the result is zero, their order doesn't change.
      
  3. a > b ? 1 : -1 (Ascending Order - string)
  -- If the result is negative (-1), a comes before b.
      -- If the result is positive (1), b comes before a.
      -- If the result is zero (0), their order doesn't change.
      
  4. a < b ? 1 : -1 (Descending Order - string)
  -- If the result is negative (-1), a comes before b.
      -- If the result is positive (1), b comes before a.
      -- If the result is zero (0), their order doesn't change.

-- for  array
     a -- > first element of the array , after each step (a+1 => a)
     b -- > second element of the array , after each step (b+1 => b)

*/
