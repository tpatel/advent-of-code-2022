import { readFileSync } from "node:fs";

const lines = readFileSync("day16.txt", { encoding: "utf-8" }) // read day??.txt content
  .replace(/\r/g, "") // remove all \r characters to avoid issues on Windows
  .trim() // Remove starting/ending whitespace
  .split("\n"); // Split on newline

const regexp =
  /^Valve (?<valve>[A-Z]{2}) has flow rate=(?<flow>\d+); tunnels? leads? to valves? (?<otherValves>.*)$/;

function bfs(graph, root) {
  const queue = [];
  root.paths = {};
  const explored = new Set();
  explored.add(root.valve);
  queue.push(root);

  while (queue.length > 0) {
    const current = queue.shift();
    for (const valve of graph[current.valve].otherValves) {
      if (!explored.has(valve)) {
        explored.add(valve);
        root.paths[valve] = (root.paths[current.valve] || 0) + 1;
        queue.push(graph[valve]);
      }
    }
  }
}

// Return a new object to avoid side effects between part 1 and 2
function getInput() {
  const array = lines.map((line) => {
    const { valve, flow, otherValves } = line.match(regexp).groups;
    return {
      valve,
      flow: parseInt(flow),
      otherValves: otherValves.split(", "),
    };
  });

  const graph = Object.fromEntries(array.map((x) => [x.valve, x]));

  for (const node of array) {
    bfs(graph, node);
  }

  return graph;
}

function addFlow(graph, openValves) {
  let sum = 0;
  for (const key in openValves) {
    sum += graph[key].flow;
  }
  return sum;
}

function part1() {
  const time = 30; //minutes
  const graph = getInput();
  console.log("parsed ✅");

  const queue = [];
  const root = {
    node: "AA",
    time,
    flow: 0,
    openValves: {},
  };
  queue.push(root);

  let maxFlow = 0;

  while (queue.length > 0) {
    const current = queue.shift();
    // console.log(current.time);

    if (current.time <= 0) {
      throw new Error("should not happen");
    }
    // Moving to another valve **that can be opened**
    const options = Object.values(graph).filter(
      (valve) => valve.flow > 0 && !current.openValves[valve.valve]
    );
    if (options.length === 0) {
      // End condition
      const ending =
        current.flow + current.time * addFlow(graph, current.openValves);
      if (ending > maxFlow) {
        maxFlow = ending;
      }
    }
    for (const { valve } of options) {
      // Move AND open the valve
      const steps = graph[current.node].paths[valve] + 1;
      if (current.time - steps <= 0) {
        // End condition
        const ending =
          current.flow + current.time * addFlow(graph, current.openValves);
        if (ending > maxFlow) {
          maxFlow = ending;
        }
      } else {
        queue.push({
          node: valve,
          time: current.time - steps,
          flow: current.flow + steps * addFlow(graph, current.openValves),
          openValves: { ...current.openValves, [valve]: current.time - steps },
        });
      }
    }
  }

  console.log(maxFlow);
}

function part2() {}

part1();
