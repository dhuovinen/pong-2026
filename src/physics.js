// Logical coordinates are independent of the canvas's rendered size.
export const RULES = Object.freeze({
  width: 960, height: 560, wall: 4, radius: 8, ballSpeed: 380,
  paddleWidth: 144, paddleHeight: 12, paddleY: 508, paddleSpeed: 800,
  historyWindow: 0.5, influence: 0.65, maxAngle: 70 * Math.PI / 180,
  step: 1 / 240,
});
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export function createGame() {
  return {
    mode: 'ready', time: 0, score: 0,
    ball: { x: RULES.width / 2, y: 34, vx: 0, vy: RULES.ballSpeed },
    paddle: { x: RULES.width / 2 },
    history: [{ time: -RULES.historyWindow, x: RULES.width / 2 }, { time: 0, x: RULES.width / 2 }],
  };
}

function positionAt(history, time) {
  if (time <= history[0].time) return history[0].x;
  for (let i = 1; i < history.length; i++) {
    const before = history[i - 1], after = history[i];
    if (after.time >= time) {
      const span = after.time - before.time;
      return span ? before.x + (after.x - before.x) * (time - before.time) / span : after.x;
    }
  }
  return history.at(-1).x;
}

export function recentPaddleVelocity(history, time) {
  return (positionAt(history, time) - positionAt(history, time - RULES.historyWindow)) / RULES.historyWindow;
}

export function paddleBounce(vx, vy, paddleVelocity) {
  // A still paddle is an exact mirror; contact offset adds no artificial steering.
  if (Math.abs(paddleVelocity) < 1e-8) return { vx, vy: -Math.abs(vy) };
  const angle = clamp(Math.atan2(vx + RULES.influence * paddleVelocity, Math.abs(vy)), -RULES.maxAngle, RULES.maxAngle);
  return { vx: Math.sin(angle) * RULES.ballSpeed, vy: -Math.cos(angle) * RULES.ballSpeed };
}

export function stepGame(game, input = {}, dt = RULES.step) {
  if (game.mode !== 'playing') return;
  const startTime = game.time;
  const oldX = game.paddle.x;
  const minX = RULES.wall + RULES.paddleWidth / 2;
  const maxX = RULES.width - minX;
  let movement = (input.axis || 0) * RULES.paddleSpeed * dt;
  if (!input.axis && Number.isFinite(input.targetX)) {
    movement = clamp(input.targetX - oldX, -RULES.paddleSpeed * dt, RULES.paddleSpeed * dt);
  }
  game.paddle.x = clamp(oldX + movement, minX, maxX);
  game.time += dt;
  game.history.push({ time: game.time, x: game.paddle.x });

  const b = game.ball;
  const left = RULES.wall + RULES.radius, right = RULES.width - left;
  const top = RULES.wall + RULES.radius;
  const paddlePlane = RULES.paddleY - RULES.radius;
  let remaining = dt, elapsed = 0;
  // Resolve the earliest collision and spend the rest of this step in the new direction.
  for (let impacts = 0; remaining > 1e-10 && impacts < 8; impacts++) {
    let event = '', hitTime = remaining;
    const consider = (time, name) => {
      if (time >= -1e-10 && time <= hitTime) { hitTime = Math.max(0, time); event = name; }
    };
    if (b.vx < 0) consider((left - b.x) / b.vx, 'side');
    if (b.vx > 0) consider((right - b.x) / b.vx, 'side');
    if (b.vy < 0) consider((top - b.y) / b.vy, 'top');
    if (b.vy > 0 && b.y <= paddlePlane) {
      const contactTime = (paddlePlane - b.y) / b.vy;
      const contactX = b.x + b.vx * contactTime;
      const paddleX = oldX + (game.paddle.x - oldX) * (elapsed + contactTime) / dt;
      // The paddle's broad, flat face includes the ball's horizontal radius.
      if (Math.abs(contactX - paddleX) <= RULES.paddleWidth / 2 + RULES.radius) consider(contactTime, 'paddle');
    }
    if (b.vy > 0) consider((RULES.height + RULES.radius - b.y) / b.vy, 'miss');
    b.x += b.vx * hitTime;
    b.y += b.vy * hitTime;
    elapsed += hitTime;
    remaining -= hitTime;
    if (!event) break;
    if (event === 'side') b.vx = -b.vx;
    if (event === 'top') b.vy = -b.vy;
    if (event === 'paddle') {
      Object.assign(b, paddleBounce(b.vx, b.vy, recentPaddleVelocity(game.history, startTime + elapsed)));
      game.score++;
    }
    if (event === 'miss') { game.mode = 'over'; break; }
  }
  // Keep one sample before the boundary so the next average can interpolate it.
  const cutoff = game.time - RULES.historyWindow;
  while (game.history.length > 2 && game.history[1].time < cutoff) game.history.shift();
}
