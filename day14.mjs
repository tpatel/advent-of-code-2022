import { readFileSync } from "node:fs";

const lines = readFileSync("day14.txt", { encoding: "utf-8" }) // read day??.txt content
  .replace(/\r/g, "") // remove all \r characters to avoid issues on Windows
  .trim() // Remove starting/ending whitespace
  .split("\n"); // Split on newline

// Return a new object to avoid side effects between part 1 and 2
function getInput() {
  const map = new Set();

  let maxY = 0;

  //498,4 -> 498,6 -> 496,6
  for (const line of lines) {
    const points = line.split(" -> ").map((point) => {
      const [x, y] = point.split(",").map(Number);
      if (y > maxY) {
        maxY = y;
      }
      return { x, y };
    });

    let currentPoint = points.shift();
    while (points.length) {
      let targetPoint = points.shift();

      // Draw a line between currentPoint and targetPoint
      while (
        currentPoint.x !== targetPoint.x ||
        currentPoint.y !== targetPoint.y
      ) {
        map.add(`${currentPoint.x},${currentPoint.y}`);
        if (currentPoint.x !== targetPoint.x) {
          const delta =
            (targetPoint.x - currentPoint.x) /
            Math.abs(targetPoint.x - currentPoint.x);
          currentPoint.x += delta;
        } else {
          const delta =
            (targetPoint.y - currentPoint.y) /
            Math.abs(targetPoint.y - currentPoint.y);
          currentPoint.y += delta;
        }
      }
      map.add(`${currentPoint.x},${currentPoint.y}`);
    }
  }

  return { map, maxY };
}

function part1() {
  const { map, maxY } = getInput();

  let sandIntoEndlessVoid = false;
  let sandUnits = 0;
  while (!sandIntoEndlessVoid) {
    //spawn sand
    let point = { x: 500, y: 0 }; // assume this point is always empty
    sandUnits++;

    // drop the sand
    while (!sandIntoEndlessVoid) {
      if (!map.has(`${point.x},${point.y + 1}`)) {
        // direct fall
        point.y++;
      } else if (!map.has(`${point.x - 1},${point.y + 1}`)) {
        // diagonal fall to the left
        point.y++;
        point.x--;
      } else if (!map.has(`${point.x + 1},${point.y + 1}`)) {
        // diagonal fall to the right
        point.y++;
        point.x++;
      } else {
        // can't fall further
        map.add(`${point.x},${point.y}`);
        break;
      }
      if (point.y >= maxY) {
        sandIntoEndlessVoid = true;
        sandUnits--;
      }
    }
  }

  console.log(sandUnits);
}

function part2() {
  const { map, maxY } = getInput();

  let sandUnits = 0;
  while (true) {
    if (map.has(`500,0`)) {
      break;
    }
    //spawn sand
    let point = { x: 500, y: 0 };
    sandUnits++;

    // drop the sand
    while (true) {
      if (point.y === maxY + 1) {
        // reached the bottom floor
        map.add(`${point.x},${point.y}`);
        break;
      } else if (!map.has(`${point.x},${point.y + 1}`)) {
        // direct fall
        point.y++;
      } else if (!map.has(`${point.x - 1},${point.y + 1}`)) {
        // diagonal fall to the left
        point.y++;
        point.x--;
      } else if (!map.has(`${point.x + 1},${point.y + 1}`)) {
        // diagonal fall to the right
        point.y++;
        point.x++;
      } else {
        // can't fall further
        map.add(`${point.x},${point.y}`);
        break;
      }
    }
  }

  console.log(sandUnits);
}

part1();
part2();
