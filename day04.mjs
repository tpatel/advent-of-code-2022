import { readFileSync } from "node:fs";

const lines = readFileSync("day04.txt", { encoding: "utf-8" }) // read day??.txt content
  .replace(/\r/g, "") // remove all \r characters to avoid issues on Windows
  .trim() // Remove starting/ending whitespace
  .split("\n"); // Split on newline

function part1() {
  const res = lines.map((line) => {
    const [interval1, interval2] = line
      .split(",")
      .map((interval) => interval.split("-").map(Number))
      .sort((a, b) => {
        const oneSize = a[1] - a[0];
        const twoSize = b[1] - b[0];
        return twoSize - oneSize;
      });

    const oneFullContainsTwo =
      interval1[0] <= interval2[0] && interval1[1] >= interval2[1];

    return oneFullContainsTwo ? 1 : 0;
  });
  console.log(res.reduce((a, b) => a + b, 0));
}

function part2() {
  const res = lines.map((line) => {
    const [first, second] = line
      .split(",")
      .map((interval) => interval.split("-").map(Number))
      .sort((a, b) => {
        const oneSize = a[1] - a[0];
        const twoSize = b[1] - b[0];
        return twoSize - oneSize;
      });

    const overlap = first[1] >= second[0] && second[1] >= first[0];

    return overlap ? 1 : 0;
  });
  console.log(res.reduce((a, b) => a + b, 0));
}

part1();
part2();
