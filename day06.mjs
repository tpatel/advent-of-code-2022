import { readFileSync } from "node:fs";

const input = readFileSync("day06.txt", { encoding: "utf-8" }) // read day??.txt content
  .replace(/\r/g, "") // remove all \r characters to avoid issues on Windows
  .trim(); // Remove starting/ending whitespace

function isUnique(array) {
  return new Set(array).size === array.length;
}

function part1() {
  let slidingWindow = [];
  for (let i = 0; i < input.length; i++) {
    slidingWindow.push(input[i]);
    if (slidingWindow.length > 4) {
      slidingWindow.shift();
    }
    if (slidingWindow.length === 4 && isUnique(slidingWindow)) {
      console.log(i + 1);
      break;
    }
  }
}

function part2() {
  const windowLength = 14;
  let slidingWindow = [];
  for (let i = 0; i < input.length; i++) {
    slidingWindow.push(input[i]);
    if (slidingWindow.length > windowLength) {
      slidingWindow.shift();
    }
    if (slidingWindow.length === windowLength && isUnique(slidingWindow)) {
      console.log(i + 1);
      break;
    }
  }
}

part1();
part2();
