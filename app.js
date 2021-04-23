const startButton = document.getElementById('start_button');
let gameArea = null;
document.querySelector('.brand_img').addEventListener('click', () => gameArea.state.win())

if (startButton) {
  startButton.addEventListener('click', e => {
    if(startButton.classList.contains('reading__1')) {
      document.querySelector('.p_1').innerText = 'Alas!';
      document.querySelector('.p_2').innerText = 'The universe is unkind and continually assaults our young hero with deliciously creamy, dairy treats.';
      startButton.classList.add('reading__2');
      startButton.classList.remove('reading__1');
    } else if (startButton.classList.contains('reading__2')) {
      startButton.innerHTML = 'Play &#127846';
      document.querySelector('.p_1').innerText = 'Can you help Charlie dodge these temptations, avoid sever stomach bloat, and safe guard the universe from her gastric distress?';
      document.querySelector('.p_2').innerText = 'Somehow I doubt it, but hey, why not give it a try?';
      startButton.classList.add('reading__3');
      startButton.classList.remove('reading__2');
    } else if (startButton.classList.contains('reading__3')) {
      document.body.classList.add('isPlaying');
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
        setTimeout(() => {
          gameArea.resetGame()
          document.querySelector('#canvas').style.backgroundColor = 'mediumblue';
        }, 2000);
      });
    }
  });
}


function sizeCanvasToParent() {
  const main = document.getElementById('main');
  const width = main.offsetWidth;
  const height = main.offsetHeight;
  const canvas = document.getElementById('canvas');
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);

  if(gameArea) {
    gameArea.size.w = width;
    gameArea.size.h = height;
  }
}

//update canvas size to match main element
window.onresize = sizeCanvasToParent;

function trackScore(points) {
  const score = document.getElementById('score');
  score.innerText = points;
}

function trackLives(lives) {
  const playerLives = document.getElementById('lives');
  playerLives.innerText = lives;
}

function trackLevels(level) {
  const levels = document.getElementById('level');
  levels.innerText = level;
}

const delayedColorChange = (color, delay) => {
  return new Promise((resolve, reject) => {
    if(gameArea.state.state === 'winning') {  
      setTimeout(() => {
          document.querySelector('#canvas').style.backgroundColor = color;
          resolve();
      }, delay);
    } else {
      document.querySelector('#canvas').style.backgroundColor = 'mediumblue';
      reject();
    }
  });
};

async function rainbow() {
    try {
      await delayedColorChange('#F72585', 1000);
      await delayedColorChange('#B5179E', 1000);
      await delayedColorChange('#7209B7', 1000);
      await delayedColorChange('#560BAD', 1000);
      await delayedColorChange('#560BAD', 1000);
      await delayedColorChange('#4361EE', 1000);
      await delayedColorChange('#4895EF', 1000);
      await delayedColorChange('#4CC9F0', 1000);
      await delayedColorChange('#00e5ff', 1000);
      await delayedColorChange('#80ffdb', 1000);
    
    } catch (error) {
      console.log(`error ${error}`);
  }
}