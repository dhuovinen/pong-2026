import { RULES, createGame, stepGame } from './physics.js';

const canvas = document.querySelector('#game');
const context = canvas.getContext('2d');
const court = document.querySelector('#court');
const overlay = document.querySelector('#overlay');
const action = document.querySelector('#action');
const pauseButton = document.querySelector('#pause');
const score = document.querySelector('#score');
const status = document.querySelector('#status');
const title = document.querySelector('#overlay-title');
const description = document.querySelector('#overlay-description');
const label = document.querySelector('#overlay-label');
const hint = document.querySelector('#keyboard-hint');
const message = document.querySelector('#rally-message');
let game = createGame();
const keys = new Set();
let targetX = null, previousTime = null, accumulator = 0, lastMode = '', lastScore = -1;

function start() {
  game = createGame();
  game.mode = 'playing';
  targetX = null;
  keys.clear();
  accumulator = 0;
  previousTime = null;
  lastScore = -1;
  canvas.focus({ preventScroll: true });
  syncUI();
}

function togglePause() {
  if (game.mode === 'playing') game.mode = 'paused';
  else if (game.mode === 'paused') game.mode = 'playing';
  else return start();
  keys.clear();
  targetX = null;
  accumulator = 0;
  previousTime = null;
  canvas.focus({ preventScroll: true });
  syncUI();
}

function autoPause() {
  keys.clear(); targetX = null;
  if (game.mode === 'playing') { game.mode = 'paused'; syncUI(); }
}

function syncUI() {
  if (lastScore !== game.score) {
    score.textContent = String(game.score).padStart(2, '0');
    message.textContent = game.score ? `${game.score} ${game.score === 1 ? 'RETURN' : 'RETURNS'}. KEEP GOING.` : 'THE NEXT MOVE IS YOURS.';
    lastScore = game.score;
  }
  if (lastMode === game.mode) return;
  lastMode = game.mode;
  overlay.hidden = game.mode === 'playing';
  pauseButton.disabled = game.mode === 'ready' || game.mode === 'over';
  pauseButton.innerHTML = game.mode === 'paused' ? 'Resume <span aria-hidden="true">↗</span>' : 'Pause <span aria-hidden="true">Ⅱ</span>';
  status.textContent = ({ ready: 'READY TO PLAY', playing: 'RALLY IN PROGRESS', paused: 'PAUSED', over: 'GAME OVER' })[game.mode];
  if (game.mode === 'paused') {
    label.textContent = 'TAKE A BREATHER'; title.textContent = 'Rally on hold.';
    description.textContent = 'Your next bounce can wait.';
    action.innerHTML = 'Resume game <span aria-hidden="true">↗</span>';
    hint.textContent = 'OR PRESS SPACE';
  }
  if (game.mode === 'over') {
    label.textContent = 'END OF RALLY'; title.textContent = 'Game Over';
    description.textContent = `${game.score} successful ${game.score === 1 ? 'return' : 'returns'}. Ready for another round?`;
    action.innerHTML = 'Restart <span aria-hidden="true">↗</span>';
    hint.textContent = 'OR PRESS SPACE';
    message.textContent = 'ONE MORE RALLY?';
    action.focus({ preventScroll: true });
  }
}

function draw() {
  context.fillStyle = '#000'; context.fillRect(0, 0, RULES.width, RULES.height);
  context.fillStyle = '#fff';
  context.fillRect(0, 0, RULES.width, RULES.wall);
  context.fillRect(0, 0, RULES.wall, RULES.height);
  context.fillRect(RULES.width - RULES.wall, 0, RULES.wall, RULES.height);
  context.fillRect(game.paddle.x - RULES.paddleWidth / 2, RULES.paddleY, RULES.paddleWidth, RULES.paddleHeight);
  if (game.mode !== 'over') {
    context.beginPath(); context.arc(game.ball.x, game.ball.y, RULES.radius, 0, Math.PI * 2); context.fill();
  }
}

function frame(time) {
  if (previousTime === null) previousTime = time;
  const delta = Math.min((time - previousTime) / 1000, 0.1);
  previousTime = time;
  if (game.mode === 'playing') {
    accumulator += delta;
    while (accumulator >= RULES.step && game.mode === 'playing') {
      const axis = Number(keys.has('ArrowRight')) - Number(keys.has('ArrowLeft'));
      stepGame(game, { axis, targetX }, RULES.step);
      accumulator -= RULES.step;
    }
  }
  syncUI(); draw(); requestAnimationFrame(frame);
}

court.addEventListener('pointermove', event => {
  if (game.mode !== 'playing' || event.pointerType === 'touch' && !event.buttons) return;
  const rect = canvas.getBoundingClientRect();
  targetX = (event.clientX - rect.left) * RULES.width / rect.width;
});
court.addEventListener('pointerdown', event => {
  if (event.target !== canvas || game.mode !== 'playing') return;
  const rect = canvas.getBoundingClientRect();
  targetX = (event.clientX - rect.left) * RULES.width / rect.width;
  canvas.setPointerCapture(event.pointerId);
});
window.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault(); keys.add(event.key); targetX = null;
  }
  if (event.code === 'Space' && !event.repeat) { event.preventDefault(); togglePause(); }
});
window.addEventListener('keyup', event => keys.delete(event.key));
window.addEventListener('blur', autoPause);
document.addEventListener('visibilitychange', () => { if (document.hidden) autoPause(); });
action.addEventListener('click', () => game.mode === 'paused' ? togglePause() : start());
pauseButton.addEventListener('click', togglePause);
syncUI(); requestAnimationFrame(frame);
