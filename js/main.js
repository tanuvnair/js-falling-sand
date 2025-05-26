const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const CELL_SIZE = 10;
let ROWS = Math.floor(canvas.height / CELL_SIZE);
let COLS = Math.floor(canvas.width / CELL_SIZE);

let GRID = new Array(ROWS);
for (let i = 0; i < ROWS; i++) {
  GRID[i] = new Array(COLS).fill(0);
}

let HUE_VALUE = 1;

function drawGrid() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      ctx.fillStyle = GRID[i][j] > 0 ? `hsl(${HUE_VALUE}, 100%, 50%)` : "black";
      ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}

function applyGravity() {
  let nextGrid = JSON.parse(JSON.stringify(GRID));

  for (let row = ROWS - 2; row >= 0; row--) {
    for (let col = 0; col < COLS; col++) {
      let current = GRID[row][col];
      if (current === 0) continue;

      let below = GRID[row + 1][col];
      if (below === 0) {
        nextGrid[row + 1][col] = GRID[row][col];
        nextGrid[row][col] = 0;
      } else {
        let dir = Math.random() < 0.5 ? -1 : 1;
        let diag = col + dir;

        if (diag >= 0 && diag < COLS && GRID[row + 1][diag] === 0) {
          nextGrid[row + 1][diag] = GRID[row][col];
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
  const mouseRow = Math.floor(mouseY / CELL_SIZE);
  const mouseCol = Math.floor(mouseX / CELL_SIZE);

  let BRUSH_SIZE = 3;
  let extent = Math.floor(BRUSH_SIZE / 2);
  for (let i = -extent; i <= extent; i++) {
    for (let j = -extent; j <= extent; j++) {
      if (Math.random() < 0.75) {
        let row = mouseRow + i;
        let col = mouseCol + j;

        if (row >= 0 && row <= ROWS && col >= 0 && col <= COLS) {
          GRID[row][col] = HUE_VALUE;
        }
      }
    }
  }

  HUE_VALUE += 10;
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

window.addEventListener("keydown", (event) => {
  if ((event.key === '+' || (event.key === '=' && event.shiftKey))) {
    console.log("Plus key pressed");
    HUE_VALUE += 10;
  }
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
