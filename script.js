let visited = false;
let N = 12;
let startIndex = 2;
let endIndex = 142;
let waterBoxes = [
  2, 3, 15, 16, 17, 29, 41, 40, 52, 64, 65, 66, 78, 78, 90, 102, 103, 115, 116,
  117, 129, 130, 142,
];
let boxesContainer = document.querySelector(".boxes-container");


function triggerConfetti() {
  // Configure confetti options
  const config = {
    spread: 180,
    startVelocity: 40,
    elementCount: 5,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    colors: ['#FFD700', '#FF4500', '#00FF00', '#1E90FF'],
    
  };

  // Trigger confetti explosion
  confetti(config);
}
// 12 x 12
// loop to generate 100 boxes
generateInActiveGameBoard();

const waterSound = document.getElementById("waterSound");
const lastBoxSound = document.getElementById("lastBoxSound");
const losingSound = document.getElementById("losingSound")
const backgroundMusic = document.getElementById('backgroundMusic');
backgroundMusic.volume = 0.1;

function generateActiveGameBoard() {
  boxesContainer.innerHTML = "";
  for (i = 1; i <= N * N; i++) {
    // generate a box
    let boxHTML = generateBoxHTML(i);
    // append it to boxes container
    boxesContainer.innerHTML += boxHTML;
  }
  

  document.querySelectorAll(".box").forEach(function (boxElement) {
    boxElement.addEventListener("mouseover", function () {
      if (!waterBoxes.includes(parseInt(boxElement.dataset.index))) {
        userLost();
      }else{
      visited = true; // Set visited to true when hovering over a water box
      boxElement.classList.add("water-box-visited"); // Add a class to apply the blue color
      playSound();
    }
    });

    // Modify the event listener for mouseleave
    boxElement.addEventListener("mouseleave", function () {
      if (waterBoxes.includes(parseInt(boxElement.dataset.index))) {
        visited = false; // Set visited to true only if it's not a water box
      }
      updateGameMessage("Game started!! Avoid the GREY boxes")
      
      ; // Clear the message on mouse leave
    });
  });
  

  document.querySelector(".end-box").addEventListener("mouseover", function () {
    if (checkAllWaterBoxesVisited()) {
    updateGameMessage("You won!");
    playLastSound()
    gsap.to("body", {
      duration: 0.5,
      backgroundColor: "#00ff00",
      ease: "power2.inOut",
      onComplete: function () {
        // Delay for 2 seconds and then revert to white
        setTimeout(function () {
          gsap.to("body", {
            duration: 0.5,
            backgroundColor: "#6495ED", // White color
            ease: "power2.inOut",
          });
        }, 2000); // 2000 milliseconds (2 seconds) delay
      },
    });
    triggerConfetti()
    gsap.to(".game-message", {
      duration: 1.5,
      fontSize: "100px",
      top: "50%",
      left: "50%",
      ease: "bounce",
    });
    setTimeout(() => {
      // Revert styles back to normal
      gsap.to(".game-message", {
        duration: 0.5,
        fontSize: "initial",
        x: "initial",
        y: "initial",
        ease: "bounce",
      });
      
  
      // Reset board
      generateInActiveGameBoard();
    }, 3000); // Adjust the time in milliseconds as needed
  }else{
    userLost()
  }
    generateInActiveGameBoard();
  });
}

function userLost() {

  // show you lose message
  updateGameMessage("You lost! Try again.");
  losingSoundfn()
  
  gsap.to("body", {
    duration: 0.5,
    backgroundColor: "#ff0000",
    ease: "power2.inOut",
    onComplete: function () {
      // Delay for 2 seconds and then revert to white
      setTimeout(function () {
        gsap.to("body", {
          duration: 0.5,
          backgroundColor: "#6495ED", // White color
          ease: "power2.inOut",
        });
      }, 2000); // 2000 milliseconds (2 seconds) delay
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
    // Revert styles back to normal
    gsap.to(".game-message", {
      duration: 0.5,
      fontSize: "initial",
      x: "initial",
      y: "initial",
      ease: "bounce",
    });

    // Reset board
    
  }, 3000); // Adjust the time in milliseconds as needed
  generateInActiveGameBoard();
}

function generateInActiveGameBoard() {
  boxesContainer.innerHTML = "";
  visited = false
  for (i = 1; i <= N * N; i++) {
    // generate a box
    let boxHTML = generateInActiveBox(i);
    // append it to boxes container
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

function playSound(){
  waterSound.currentTime = 0.3; 
  waterSound.play();
}
function playLastSound(){

  lastBoxSound.currentTime = 0; 
  lastBoxSound.volume=1
  lastBoxSound.addEventListener("canplay", function () {
    lastBoxSound.play();
  });
  
}
function losingSoundfn(){
  losingSound.currentTime=0;
  losingSound.play()
}

function checkAllWaterBoxesVisited() {
  const waterBoxElements = document.querySelectorAll(".water-box");
  return Array.from(waterBoxElements).every((box) =>
    box.classList.contains("water-box-visited")
  );
}