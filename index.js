const main = document.querySelector(".game");
let total = parseInt(localStorage.getItem("pairs")) * 2;
let seconds = 0;
let timerInterval = null;

const arr = [
  "red",
  "yellow",
  "blue",
  "green",
  "pink",
  "orange",
  "magenta",
  "purple",
  "lime",
  "gray",
  "lightgray",
  "navy",
  "beige",
  "brown",
  "lightblue",
  "lightpink",
  "cyan",
  "teal",
  "aqua",
  "azure",
  "aquamarine",
  "blueviolet",
  "chocolate",
  "coral",
  "darkcyan",
  "seagreen",
  "rosybrown",
  "royalblue",
  "gold",
  "hotpink",
  "khaki",
];

total = arr.length * 2 < total ? arr.length * 2 : total;

const game = {
  game: [],
  flip: [],
  timer: {},
  pause: false,
  score: 0,
  total: 0,
};

game.total = total / 2;

function initInfo(event) {
  event.preventDefault();

  const nickname = document.getElementById("nickname").value;
  const pairs = parseInt(document.getElementById("pairs").value);

  localStorage.setItem("nickname", nickname);
  localStorage.setItem("pairs", pairs);

  document.getElementById("playerNick").innerText = `שלום ${nickname}`;
  total = arr.length * 2 < pairs * 2 ? arr.length * 2 : pairs * 2;
  game.total = total / 2;
}

function createCardGrid() {
  for (let i = 0; i < total; i++) {
    const el = generateGameElement("div", main, "", "card");
    el.onclick = flipCard;
  }
  main.style.setProperty(
    `grid-template-columns`,
    `repeat(auto-fit, minmax(150px, 1fr))`
  );
  setupCardValues();
}

function toggleFlip(parent, bool) {
  const backEle = parent.querySelector(".back");
  const frontEle = parent.querySelector(".front");

  if (bool) {
    backEle.style.display = "none";
    frontEle.style.display = "block";
  } else {
    backEle.style.display = "block";
    frontEle.style.display = "none";
  }
  console.log(parent);
}

function checkCards() {
  game.pause = true;
  let match = null;
  let found = false;
  game.flip.forEach((ele) => {
    if (ele.val == match) {
      console.log("found match");
      found = true;
    } else {
      match = ele.val;
    }
  });

  if (!found) {
    game.timer = setTimeout(flipCardBack, 500);
  } else {
    game.score++;
    game.flip.forEach((ele) => {
      ele.found = true;
      ele.style.boxShadow = "0 0 5px 5px green";
    });
    game.pause = false;
    game.flip.length = 0;
    if (game.score >= game.total) {
      alert(`Game Finished in ${seconds} seconds`);
      timerStop();
    }
  }
}

function flipCardBack() {
  game.flip.forEach((ele) => {
    toggleFlip(ele, false);
    ele.classList.remove("active");
  });
  game.pause = false;
  game.flip.length = 0;
}

function flipCard(e) {
  const parent = e.target.parentNode;
  const tempv = parent.classList.contains("active");
  if (!game.pause && !tempv) {
    if (parent.found) {
      alert("already found");
    } else {
      parent.classList.add("active");
      if (game.flip.length >= 2) {
        toggleFlip(parent, false);
      } else {
        toggleFlip(parent, true);
      }
      game.flip.push(parent);
      if (game.flip.length >= 2) {
        checkCards();
      }
    }
  } else {
    alert("Game Paused");
  }
}

function setupCardValues() {
  let gameItems = total / 2;
  let temp = [];
  arr.sort(() => Math.random() - 0.5);
  for (let i = 0; i < gameItems; i++) {
    temp.push(arr[i]);
  }
  game.game = temp.concat(temp);
  game.game.sort(() => Math.random() - 0.5);
  const boxes = main.querySelectorAll(".card");
  boxes.forEach((ele, ind) => {
    ele.val = game.game[ind];
    ele.found = false;
    const front = generateGameElement("div", ele, game.game[ind], "front");
    front.style.backgroundColor = game.game[ind];
    front.style.display = "none";
    const back = generateGameElement("div", ele, ind + 1, "back");
    back.style.display = "block";
  });
}

function generateGameElement(eleType, parent, html, cla) {
  const ele = document.createElement("div");
  ele.classList.add(cla);
  ele.innerHTML = html;
  return parent.appendChild(ele);
}

function hideForm() {
  document.getElementById("form-group").classList.add("hidden");
}

function showForm() {
  document.getElementById("form-group").classList.remove("hidden");
}

function showGame() {
  document.getElementById("game-group").classList.remove("hidden");
}

function hideGame() {
  document.getElementById("game-group").classList.add("hidden");
}

function handleSubmit() {
  hideForm();
  showGame();
  createCardGrid();
  timerStart();
}

function playAgain() {
  game.flip = [];
  game.timer = {};
  game.pause = false;
  game.score = 0;
  main.innerHTML = "";
  createCardGrid();
  timerStart();
}

function restartGame() {
  resetStats();

  main.innerHTML = "";

  const pairs = parseInt(localStorage.getItem("pairs")) || 0;
  total = arr.length * 2 < pairs * 2 ? arr.length * 2 : pairs * 2;
  game.total = total / 2;

  hideGame();
  showForm();

  const nickname = localStorage.getItem("nickname") || "Player";
  document.getElementById("playerNick").innerText = `שלום ${nickname}`;

  timerStart();
}

function resetStats() {
  game.game = [];
  game.flip = [];
  game.timer = {};
  game.pause = false;
  game.score = 0;
}

function timerStart() {
  seconds = 0;

  if (timerInterval) {
    clearInterval(timerInterval);
  }

  const timeCounterDiv = document.getElementById("timeCounter");
  if (!timeCounterDiv) {
    return;
  }

  timerInterval = setInterval(() => {
    seconds++;
    timeCounterDiv.textContent = `Time: ${seconds} seconds`;
  }, 1000);
}

function timerStop() {
  clearInterval(timerInterval);
}
