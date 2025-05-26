const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const CELL_SIZE = 25;
let ROWS = Math.floor(canvas.height / CELL_SIZE);
let COLS = Math.floor(canvas.width / CELL_SIZE);

let GRID = new Array(ROWS);
for (let i = 0; i < ROWS; i++) {
  GRID[i] = new Array(COLS).fill(0);
}

function drawGrid() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      ctx.fillStyle = GRID[i][j] === 1 ? "white" : "black";
      ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      ctx.strokeStyle = "gray";
      ctx.strokeRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}

function applyGravity() {
  let nextGrid = JSON.parse(JSON.stringify(GRID));

  for (let row = ROWS - 2; row >= 0; row--) {
    for (let col = 0; col < COLS; col++) {
      let current = GRID[row][col];
      if (current !== 1) continue;

      let below = GRID[row + 1][col];
      if (below === 0) {
        nextGrid[row + 1][col] = 1;
        nextGrid[row][col] = 0;
      } else {
        let dir = Math.random() < 0.5 ? -1 : 1;
        let diag = col + dir;

        if (diag >= 0 && diag < COLS && GRID[row + 1][diag] === 0) {
          nextGrid[row + 1][diag] = 1;
          nextGrid[row][col] = 0;
        }
      }
    }
  }

  GRID = nextGrid;
}

function paintTile(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  const col = Math.floor(mouseX / CELL_SIZE);
  const row = Math.floor(mouseY / CELL_SIZE);

  if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
    GRID[row][col] = 1;
  }
}

let isDragging = false;

canvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  paintTile(e);
});

canvas.addEventListener("mousemove", (e) => {
  if (isDragging) paintTile(e);
});

window.addEventListener("mouseup", () => {
  isDragging = false;
});

canvas.addEventListener("mouseleave", () => {
  isDragging = false;
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ROWS = Math.floor(canvas.height / CELL_SIZE);
  COLS = Math.floor(canvas.width / CELL_SIZE);

  GRID = new Array(ROWS);
  for (let i = 0; i < ROWS; i++) {
    GRID[i] = new Array(COLS).fill(0);
  }
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  applyGravity();
  requestAnimationFrame(animate);
}
animate();
