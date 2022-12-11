import { readFileSync } from "node:fs";

function getOperationFunction(input) {
  return function (old) {
    const string = input.replace(/old/, old);
    // Warning: do not use in prod
    return eval(string);
  };
}

// console.log(getOperationFunction("old * 19")(10));
// console.log(getOperationFunction("old * old")(10));
// console.log(getOperationFunction("old + 3")(10));

function getMonkeys() {
  const monkeys = readFileSync("day11.txt", { encoding: "utf-8" }) // read day??.txt content
    .replace(/\r/g, "") // remove all \r characters to avoid issues on Windows
    .trim() // Remove starting/ending whitespace
    .split("\n\n") // Split on newline
    .map((lines, monkeyId) => {
      const items = lines
        .match(/Starting items(?:[:,] (\d+))+/g)[0]
        .split(": ")[1]
        .split(", ")
        .map(Number);
      const operation = lines.match(/= ([^\n]+)/)[1];

      const divisibleBy = parseInt(lines.match(/divisible by (\d+)/)[1]);
      const whenTrueSendTo = parseInt(
        lines.match(/If true: throw to monkey (\d)/)[1]
      );
      const whenFalseSendTo = parseInt(
        lines.match(/If false: throw to monkey (\d)/)[1]
      );

      return {
        id: monkeyId,
        totalInspectedObjects: 0,
        items,
        divisibleBy,
        operation: getOperationFunction(operation),
        sendTo: (item) =>
          item % divisibleBy === 0 ? whenTrueSendTo : whenFalseSendTo,
      };
    });
  return monkeys;
}

function part1() {
  const monkeys = getMonkeys();
  for (let i = 0; i < 20; i++) {
    for (const monkey of monkeys) {
      let items = monkey.items;
      while (items.length) {
        let item = items.shift();
        monkey.totalInspectedObjects++;

        item = monkey.operation(item);
        item = Math.floor(item / 3);
        const destination = monkey.sendTo(item);

        monkeys[destination].items.push(item);
      }
    }
  }
  const activity = monkeys.map((m) => m.totalInspectedObjects);
  activity.sort((a, b) => b - a);
  console.log(activity[0] * activity[1]);
}

function part2() {
  const monkeys = getMonkeys();
  const divider = monkeys.map((m) => m.divisibleBy).reduce((a, b) => a * b, 1);
  for (let i = 0; i < 10000; i++) {
    for (const monkey of monkeys) {
      let items = monkey.items;
      while (items.length) {
        let item = items.shift();
        monkey.totalInspectedObjects++;

        item = monkey.operation(item);
        item = item % divider;
        const destination = monkey.sendTo(item);

        monkeys[destination].items.push(item);
      }
    }
  }
  const activity = monkeys.map((m) => m.totalInspectedObjects);
  activity.sort((a, b) => b - a);
  console.log(activity[0] * activity[1]);
}

part1();
part2();
