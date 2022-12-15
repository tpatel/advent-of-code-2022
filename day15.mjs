import { readFileSync } from "node:fs";

const lines = readFileSync("day15.txt", { encoding: "utf-8" }) // read day??.txt content
  .replace(/\r/g, "") // remove all \r characters to avoid issues on Windows
  .trim() // Remove starting/ending whitespace
  .split("\n"); // Split on newline

const regexp =
  /Sensor at x=(?<sensorX>-?\d+), y=(?<sensorY>-?\d+): closest beacon is at x=(?<beaconX>-?\d+), y=(?<beaconY>-?\d+)/;

function distance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// Return a new object to avoid side effects between part 1 and 2
function getInput() {
  return lines.map((line) => {
    const match = line.match(regexp).groups;
    const result = {
      sensor: {
        x: parseInt(match.sensorX),
        y: parseInt(match.sensorY),
      },
      beacon: {
        x: parseInt(match.beaconX),
        y: parseInt(match.beaconY),
      },
    };

    result.dist = distance(result.sensor, result.beacon);

    return result;
  });
}

function part1() {
  const input = getInput();
  const y = input.length === 14 ? 10 : 2000000;
  let cannotContainBeacon = new Set();
  let beaconsOnLine = new Set();
  for (const { sensor, beacon, dist } of input) {
    if (beacon.y === y) {
      beaconsOnLine.add(beacon.x);
    }
    const minDistance = distance(sensor, { x: sensor.x, y });
    if (minDistance <= dist) {
      const distanceAroundSensorX = dist - minDistance;
      for (
        let x = sensor.x - distanceAroundSensorX;
        x <= sensor.x + distanceAroundSensorX;
        x++
      ) {
        cannotContainBeacon.add(x);
      }
    }
  }
  console.log(cannotContainBeacon.size - beaconsOnLine.size);
}

function part2() {
  const input = getInput();

  const maxCoordinate = input.length === 14 ? 20 : 4000000;

  // Dummy implementation
  // for (let y = 0; y < maxCoordinate; y++) {
  //   for (let x = 0; x < maxCoordinate; x++) {
  //     let found = false;
  //     for (const { sensor, beacon, dist } of input) {
  //       if (distance({ x, y }, sensor) <= dist) {
  //         found = true;
  //         break;
  //       }
  //     }
  //     if (!found) {
  //       console.log(x * 4000000 + y);
  //       return;
  //     }
  //   }
  // }

  for (let y = 0; y < maxCoordinate; y++) {
    const intervals = [];
    for (const { sensor, dist } of input) {
      const minDistance = distance(sensor, { x: sensor.x, y });
      if (minDistance <= dist) {
        const distanceAroundSensorX = dist - minDistance;
        let from = sensor.x - distanceAroundSensorX;
        let to = sensor.x + distanceAroundSensorX;

        intervals.push([from, to]);
      }
    }

    intervals.sort((a, b) => a[0] - b[0]);
    for (let i = 1; i < intervals.length; i++) {
      if (intervals[i - 1][1] >= intervals[i][0]) {
        // merge them
        intervals[i - 1][1] = Math.max(intervals[i - 1][1], intervals[i][1]);
        intervals.splice(i, 1);
        i--;
      }
    }

    const res = [];
    for (const interval of intervals) {
      if (interval[0] > maxCoordinate || 0 > interval[1]) {
        continue;
      }
      res.push([
        Math.max(interval[0], 0),
        Math.min(interval[1], maxCoordinate),
      ]);
    }

    if (res.length > 1) {
      const x = res[0][1] + 1;
      console.log(x * 4e6 + y);
      return;
    }
  }
}

part1();
part2();
