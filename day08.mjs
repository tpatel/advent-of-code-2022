import { readFileSync } from "node:fs";

const lines = readFileSync("day08.txt", { encoding: "utf-8" }) // read day??.txt content
  .replace(/\r/g, "") // remove all \r characters to avoid issues on Windows
  .trim() // Remove starting/ending whitespace
  .split("\n") // Split on newline
  .map((line) => [...line].map(Number));

function setVisible(y, x, visible) {
  visible.add(`${y}-${x}`);
}

function checkLine(y, x, dy, dx, map, visible) {
  setVisible(y, x, visible);
  let maximum = map[y][x];
  // loop
  while (true) {
    y += dy;
    x += dx;
    if (y < 0 || y >= map.length || x < 0 || x >= map[y].length) {
      break;
    }
    if (map[y][x] > maximum) {
      maximum = map[y][x];
      setVisible(y, x, visible);
    }
  }
}

function checkLine2(y, x, dy, dx, map) {
  let visible = 0;
  let maximum = map[y][x];
  while (true) {
    y += dy;
    x += dx;
    if (y < 0 || y >= map.length || x < 0 || x >= map[y].length) {
      break;
    }
    visible++;
    if (map[y][x] >= maximum) {
      break;
    }
  }
  return visible;
}

function part1() {
  const visible = new Set();
  // all columns
  for (let i = 0; i < lines[0].length; i++) {
    checkLine(0, i, 1, 0, lines, visible);
    checkLine(lines.length - 1, i, -1, 0, lines, visible);
  }
  // all rows
  for (let i = 0; i < lines.length; i++) {
    checkLine(i, 0, 0, 1, lines, visible);
    checkLine(i, lines[0].length - 1, 0, -1, lines, visible);
  }

  console.log(visible.size);
}

function part2() {
  let max = 0;
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      const score =
        checkLine2(y, x, -1, 0, lines) *
        checkLine2(y, x, 1, 0, lines) *
        checkLine2(y, x, 0, 1, lines) *
        checkLine2(y, x, 0, -1, lines);
      if (score > max) max = score;
    }
  }

  console.log(max);
}

part1();
part2();
