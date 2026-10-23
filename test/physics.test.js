import test from 'node:test';
import assert from 'node:assert/strict';
import { RULES, createGame, stepGame, recentPaddleVelocity, paddleBounce } from '../src/physics.js';

const close = (actual, expected, epsilon = 1e-7) => assert.ok(Math.abs(actual - expected) < epsilon, `${actual} should equal ${expected}`);
const playing = () => Object.assign(createGame(), { mode: 'playing' });
function advance(game, seconds, input = {}) {
  for (let i = 0; i < Math.round(seconds / RULES.step); i++) stepGame(game, input);
}

test('PONG-3: initial ball starts near the top center and drops vertically at the chosen speed', () => {
  const g = playing(); advance(g, 0.5);
  close(g.ball.x, 480); close(g.ball.y, 34 + 0.5 * RULES.ballSpeed);
  close(Math.hypot(g.ball.vx, g.ball.vy), RULES.ballSpeed);
});

test('PONG-4: stationary paddle exactly mirrors an oblique incoming shot', () => {
  const incomingX = 190, incomingY = Math.sqrt(RULES.ballSpeed ** 2 - incomingX ** 2);
  const bounce = paddleBounce(incomingX, incomingY, 0);
  close(bounce.vx, incomingX); close(bounce.vy, -incomingY);
});

test('PONG-4: landing off-center on a stationary paddle adds no steering', () => {
  const g = playing(); g.ball.x += 60; g.ball.y = 499;
  stepGame(g); assert.equal(g.score, 1); close(g.ball.vx, 0); assert.ok(g.ball.vy < 0);
});

test('PONG-4: a ball traveling upward past the paddle is not hit again', () => {
  const g = playing(); g.ball.y = 501; g.ball.vy = -RULES.ballSpeed;
  stepGame(g); assert.equal(g.score, 0); assert.ok(g.ball.vy < 0);
});

test('PONG-4: right, left and top collisions reflect and consume the remaining step', () => {
  for (const [x, vx] of [[947, 380], [13, -380]]) {
    const g = playing(); Object.assign(g.ball, { x, y: 100, vx, vy: 0 });
    stepGame(g, {}, 0.02); assert.equal(g.ball.vx, -vx); assert.ok(g.ball.x >= 12 && g.ball.x <= 948);
  }
  const g = playing(); Object.assign(g.ball, { y: 13, vx: 0, vy: -380 });
  stepGame(g, {}, 0.02); assert.equal(g.ball.vy, 380); assert.ok(g.ball.y > 12);
});

test('PONG-5: average uses the entire half second, including stationary time', () => {
  const history = [{ time: 0, x: 100 }, { time: 0.25, x: 200 }, { time: 0.5, x: 200 }];
  close(recentPaddleVelocity(history, 0.5), 200);
});

test('PONG-5: window boundary is interpolated, not rounded to an input sample', () => {
  const history = [{ time: 0, x: 100 }, { time: 0.2, x: 200 }, { time: 0.6, x: 300 }];
  close(recentPaddleVelocity(history, 0.6), 300);
});

test('PONG-5: signed opposing movements cancel', () => {
  close(recentPaddleVelocity([{ time: 0, x: 100 }, { time: 0.25, x: 250 }, { time: 0.5, x: 100 }], 0.5), 0);
});

test('PONG-5: motion older than the history window no longer influences the bounce', () => {
  const history = [{ time: 0, x: 100 }, { time: 0.2, x: 200 }, { time: 0.7, x: 200 }];
  close(recentPaddleVelocity(history, 0.7), 0);
});

test('PONG-5: paddle motion steers in its direction and preserves total speed', () => {
  for (const velocity of [-3000, -200, 200, 3000]) {
    const bounce = paddleBounce(0, RULES.ballSpeed, velocity);
    assert.equal(Math.sign(bounce.vx), Math.sign(velocity)); assert.ok(bounce.vy < 0);
    close(Math.hypot(bounce.vx, bounce.vy), RULES.ballSpeed);
    assert.ok(Math.abs(Math.atan2(bounce.vx, -bounce.vy)) <= RULES.maxAngle + 1e-10);
  }
});

test('PONG-5: moving shortly before contact affects the actual rally after stopping', () => {
  const g = playing();
  advance(g, 0.15, { axis: 1 }); advance(g, 0.15);
  Object.assign(g.ball, { x: g.paddle.x, y: 499 });
  stepGame(g); assert.equal(g.score, 1); assert.ok(g.ball.vx > 0);
});

test('PONG-5: paddle motion expires after stopping for a full window', () => {
  const g = playing(); advance(g, 0.15, { axis: -1 }); advance(g, 0.55);
  Object.assign(g.ball, { x: g.paddle.x, y: 499 });
  stepGame(g); assert.equal(g.score, 1); close(g.ball.vx, 0);
});

test('PONG-2: either keyboard direction is clamped inside the side walls', () => {
  for (const axis of [-1, 1]) {
    const g = playing(); advance(g, 1, { axis });
    close(g.paddle.x, axis < 0 ? 76 : 884);
  }
});

test('PONG-2: pointer target moves the paddle smoothly and respects the walls', () => {
  const g = playing(); stepGame(g, { targetX: 9000 });
  close(g.paddle.x, 480 + RULES.paddleSpeed * RULES.step);
  advance(g, 0.8, { targetX: 9000 }); close(g.paddle.x, 884);
});

test('PONG-4/6: swept collision catches a paddle hit without tunneling and counts it once', () => {
  const g = playing(); g.ball.y = 490;
  stepGame(g, {}, 0.1); assert.equal(g.score, 1); assert.ok(g.ball.y < 500);
  advance(g, 0.2); assert.equal(g.score, 1);
});

test('PONG-4: collision checks the paddle location at contact, not the end of the frame', () => {
  const g = playing(); Object.assign(g.ball, { x: 420, y: 499 });
  stepGame(g, { axis: 1 }, 0.1);
  assert.equal(g.score, 1); assert.ok(g.ball.vy < 0);
});

test('PONG-6: a miss ends the rally without awarding a point', () => {
  const g = playing(); g.ball.x = 100; advance(g, 1.5);
  assert.equal(g.mode, 'over'); assert.equal(g.score, 0);
  const snapshot = JSON.stringify(g); advance(g, 1); assert.equal(JSON.stringify(g), snapshot);
});

test('ready and paused games do not advance or accumulate paddle motion', () => {
  for (const mode of ['ready', 'paused']) {
    const g = createGame(); g.mode = mode;
    const snapshot = JSON.stringify(g); advance(g, 0.5, { axis: 1 }); assert.equal(JSON.stringify(g), snapshot);
  }
});

test('PONG-6: a new game clears the previous score and motion history', () => {
  const g = playing(); advance(g, 1.3); assert.equal(g.score, 1);
  const restarted = createGame(); assert.equal(restarted.score, 0); close(recentPaddleVelocity(restarted.history, 0), 0);
});

test('a prolonged moving-paddle rally keeps the ball at its original speed', () => {
  const g = playing();
  for (let i = 0; i < 240 * 30 && g.mode === 'playing'; i++) {
    stepGame(g, { targetX: g.ball.x });
    close(Math.hypot(g.ball.vx, g.ball.vy), RULES.ballSpeed);
    assert.ok(g.ball.x >= 12 - 1e-7 && g.ball.x <= 948 + 1e-7);
  }
  assert.ok(g.score >= 5, `Expected a sustained rally, got ${g.score} hits`);
});
