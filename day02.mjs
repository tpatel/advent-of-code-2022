import { readFileSync } from "node:fs";

const lines = readFileSync("day02.txt", { encoding: "utf-8" }) // read day??.txt content
  .replace(/\r/g, "") // remove all \r characters to avoid issues on Windows
  .trim() // Remove starting/ending whitespace
  .split("\n") // Split on newline
  .map((line) => line.split(" ")); // Parse each line into a number

const moves = {
  rock: 1,
  paper: 2,
  scissors: 3,
};

const mapInput = {
  A: moves.rock,
  B: moves.paper,
  C: moves.scissors,
  X: moves.rock,
  Y: moves.paper,
  Z: moves.scissors,
};

function score(opponentMove, ourMove) {
  if (opponentMove === ourMove) {
    return ourMove + 3;
  }
  if (
    (opponentMove === moves.rock && ourMove === moves.paper) ||
    (opponentMove === moves.paper && ourMove === moves.scissors) ||
    (opponentMove === moves.scissors && ourMove === moves.rock)
  ) {
    // We win
    return ourMove + 6;
  }
  // We lost
  return ourMove;
}

function part1() {
  const outcomes = lines.map((line) => {
    const opponentMove = mapInput[line[0]];
    const ourMove = mapInput[line[1]];
    return score(opponentMove, ourMove);
  });
  console.log(outcomes.reduce((a, b) => a + b, 0));
}

const solution = {
  A: {
    //rock
    X: moves.scissors, //lose
    Y: moves.rock, //draw
    Z: moves.paper, //win
  },
  B: {
    //paper
    X: moves.rock,
    Y: moves.paper,
    Z: moves.scissors,
  },
  C: {
    //scissors
    X: moves.paper,
    Y: moves.scissors,
    Z: moves.rock,
  },
};

function part2() {
  const outcomes = lines.map((line) => {
    const opponentMove = mapInput[line[0]];

    // Guess our move from the instructions
    const ourMove = solution[line[0]][line[1]];

    return score(opponentMove, ourMove);
  });
  console.log(outcomes.reduce((a, b) => a + b, 0));
}

part1();
part2();
