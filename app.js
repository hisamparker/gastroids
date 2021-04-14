const startButton = document.getElementById('start_button');
let gameArea = null;

if (startButton) {
  startButton.addEventListener('click', e => {
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

