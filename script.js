
let visited = false;
let boxesContainer = document.querySelector(".boxes-container");

const levels = [
  { N: 12, startIndex: 2, endIndex: 142, waterBoxes: [2, 3, 15, 16, 17, 29, 41, 40, 52, 64, 65, 66, 78, 78, 90, 102, 103, 115, 116,
    117, 129, 130, 142,] },
  { N: 13, startIndex: 3, endIndex: 169, waterBoxes: [3, 4, 17,18,31,30,43,56,55,68,81,94,107,108,121,122,135,148,149,150,137,138,139,140,141, 142,155,168,169] },
  { N: 14, startIndex: 4, endIndex: 196, waterBoxes: [4, 5, 6,20,34,35,36,50,64,63,77,76,90,89,103,117,118,119,133,134,135,149,163,164,178,179,180,194,195,196] },
];

let currentLevelIndex = 0; // Start with the first level
let { N, startIndex, endIndex, waterBoxes } = levels[currentLevelIndex];

const waterSound = document.getElementById("waterSound");
const lastBoxSound = document.getElementById("lastBoxSound");
const losingSound = document.getElementById("losingSound");
const backgroundMusic = document.getElementById("backgroundMusic");
backgroundMusic.volume = 0.1;

function startNewLevel() {
  // Increment the level index
  currentLevelIndex++;

  // Check if there are more levels
  if (currentLevelIndex < levels.length) {
    // Use the parameters of the new level
    ({ N, startIndex, endIndex, waterBoxes } = levels[currentLevelIndex]);

    // Start the new level
    startGame();
  } else {
    // You've completed all levels, you can add more logic here
    updateGameMessage("Congratulations! You've completed all levels.");
  }
}

function triggerConfetti() {
  // Configure confetti options
  const config = {
    // ... (unchanged)
  };

  // Trigger confetti explosion
  confetti(config);
}

function generateActiveGameBoard() {
  boxesContainer.innerHTML = "";
  boxesContainer.style.setProperty("--columns", N); // Set custom property for column count

  for (let i = 1; i <= N * N; i++) {
    let boxHTML = generateBoxHTML(i);
    boxesContainer.innerHTML += boxHTML;
  }

  document.querySelectorAll(".box").forEach(function (boxElement) {
    boxElement.addEventListener("mouseover", function () {
      if (!waterBoxes.includes(parseInt(boxElement.dataset.index))) {
        userLost();
      } else {
        visited = true;
        boxElement.classList.add("water-box-visited");
        playSound();
      }
    });

    boxElement.addEventListener("mouseleave", function () {
      if (waterBoxes.includes(parseInt(boxElement.dataset.index))) {
        visited = false;
      }
      updateGameMessage("Game started!! Avoid the GREY boxes");
    });
  });

  document.querySelector(".end-box").addEventListener("mouseover", function () {
    if (checkAllWaterBoxesVisited()) {
      updateGameMessage("You won!");
      playLastSound();
      gsap.to("body", {
        duration: 0.5,
        backgroundColor: "#00ff00",
        ease: "power2.inOut",
        onComplete: function () {
          setTimeout(function () {
            gsap.to("body", {
              duration: 0.5,
              backgroundColor: "#6495ED",
              ease: "power2.inOut",
            });
          }, 2000);
        },
      });
      triggerConfetti();
      gsap.to(".game-message", {
        duration: 1.5,
        fontSize: "100px",
        top: "50%",
        left: "50%",
        ease: "bounce",
      });
      setTimeout(() => {
        gsap.to(".game-message", {
          duration: 0.5,
          fontSize: "initial",
          x: "initial",
          y: "initial",
          ease: "bounce",
        });

        startNewLevel();
      }, 3000);
    } else {
      userLost();
    }
    generateInActiveGameBoard();
  });
}

function userLost() {
  updateGameMessage("You lost! Try again.");
  losingSoundfn();

  gsap.to("body", {
    duration: 0.5,
    backgroundColor: "#ff0000",
    ease: "power2.inOut",
    onComplete: function () {
      setTimeout(function () {
        gsap.to("body", {
          duration: 0.5,
          backgroundColor: "#6495ED",
          ease: "power2.inOut",
        });
      }, 2000);
    },
  });

  gsap.to(".game-message", {
    duration: 1.5,
    fontSize: "100px",
    top: "50%",
    left: "50%",
    ease: "bounce",
  });
  setTimeout(() => {
    gsap.to(".game-message", {
      duration: 0.5,
      fontSize: "initial",
      x: "initial",
      y: "initial",
      ease: "bounce",
    });
  }, 3000);

  generateInActiveGameBoard();
}

function generateInActiveGameBoard() {
  boxesContainer.innerHTML = "";
  visited = false;
  for (let i = 1; i <= N * N; i++) {
    let boxHTML = generateInActiveBox(i);
    boxesContainer.innerHTML += boxHTML;
  }
  document.querySelector(".start-box").addEventListener("click", startGame);
}

function startGame() {
  updateGameMessage("Game started, avoid the gray boxes!");
  generateActiveGameBoard();
}

function updateGameMessage(message) {
  document.querySelector(".game-message").innerHTML = message;
}

function generateBoxHTML(i) {
  let isWater = waterBoxes.includes(i);
  return `
        <p data-index=${i} class="box ${i == startIndex ? "start-box" : ""} ${
    i == endIndex ? "end-box" : ""
  } ${isWater ? "water-box" : ""} ${visited ? "water-box-visited" : ""}">${i}</p>
        `;
}

function generateInActiveBox(i) {
  return `
        <p class="box ${i == startIndex ? "start-box" : ""}">${i}</p>
        `;
}

function playSound() {
  waterSound.currentTime = 0.3;
  waterSound.play();
}

function playLastSound() {
  lastBoxSound.currentTime = 0;
  lastBoxSound.volume = 1;
  lastBoxSound.addEventListener("canplay", function () {
    lastBoxSound.play();
  });
}

function losingSoundfn() {
  losingSound.currentTime = 0;
  losingSound.play();
}

function checkAllWaterBoxesVisited() {
  const waterBoxElements = document.querySelectorAll(".water-box");
  return Array.from(waterBoxElements).every((box) =>
    box.classList.contains("water-box-visited")
  );
}

// Initial game setup
startGame();
