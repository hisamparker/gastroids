const startButton = document.getElementById('start_button');
let gameArea = null;

if (startButton) {
  startButton.addEventListener('click', e => {
    if(startButton.classList.contains('reading__1')) {
      const p1 = document.querySelector('.p_1');
      const p2 = document.querySelector('.p_2');
      p1.innerHTML = 'Alas!';
      p2.innerText = 'The universe is unkind and continually assaults our young hero with deliciously creamy, dairy treats.';
      startButton.classList.add('reading__2');
      startButton.classList.remove('reading__1');
    } else if (startButton.classList.contains('reading__2')) {
      startButton.innerHTML = 'Play &#127846';
      const p1 = document.querySelector('.p_1');
      const p2 = document.querySelector('.p_2');
      p1.innerHTML = 'Can you help Charlie dodge these temptations, avoid sever stomach bloat, and safe guard the universe from her gastric distress?';
      p2.innerText = 'Somehow I doubt it, but hey, why not give it a try?';
      startButton.classList.add('reading__3');
      startButton.classList.remove('reading__2');
    } else if (startButton.classList.contains('reading__3')) {
      const body = document.body;
      body.classList.add('isPlaying');
      const main = document.getElementById('main');
      const canvas = document.createElement('canvas');
      canvas.setAttribute('id', 'canvas');
      main.appendChild(canvas);
      sizeCanvasToParent();
      gameArea = new GameArea(canvas);
      gameArea.initGame();
      document.getElementById('canvas').addEventListener('click', (event) => {
      gameArea.spawnProjectile(event);
      });
      const resetButton = document.createElement('button');
      resetButton.setAttribute("id", "reset_button");
      resetButton.innerHTML = 'Reset';
      document.getElementById('header').appendChild(resetButton);
      resetButton.addEventListener('click', e => {
        gameArea.stopGame();
        setTimeout(() => {gameArea.resetGame();}, 2000);
      });
    }
  });
}


function sizeCanvasToParent () {
    const main = document.getElementById('main');
    const width = main.offsetWidth;
    const height = main.offsetHeight;
    const canvas = document.getElementById('canvas');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
}

//update canvas size to match main element
window.onresize = sizeCanvasToParent;

function trackScore (points) {
  const score = document.getElementById('score');
  score.innerText = points;
}

function trackLives (lives) {
  const playerLives = document.getElementById('lives');
  playerLives.innerText = lives;
}

function trackLevels (level) {
  const levels = document.getElementById('level');
  levels.innerText = level;
}
