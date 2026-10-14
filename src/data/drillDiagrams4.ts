import { CONE, COACH, D, G, P, PUCK, RINK, carry, onEllipse, pass, run, spread, type Diagram } from "./diagramKit";

const GT = G();
const GB = G(50, 91.5);
const CC = RINK.centre;
const O = (pts: [number, number][]) => pts.map(([x, y]) => P(x, y));
const X = (pts: [number, number][]) => pts.map(([x, y]) => D(x, y));
const cones = (pts: [number, number][]) => pts.map(([x, y]) => CONE(x, y));

/** Small-area games, conditioning and warmups (#86–107). */
export const drillDiagrams4: Record<string, Diagram> = {
  "SAG-001": { // 3-on-3 cross-ice: cones split the ice into two cross-ice zones, a small net at each end of each zone
    markers: [
      ...cones([[8, 50], [28, 50], [50, 50], [72, 50], [92, 50]]),
      ...cones([[3, 22], [3, 28], [97, 22], [97, 28], [3, 72], [3, 78], [97, 72], [97, 78]]),
      ...O([[38, 22], [46, 28], [40, 33]]), ...X([[58, 22], [62, 30], [54, 34]]),
      ...O([[40, 67], [48, 72], [38, 78]]), ...X([[56, 66], [62, 74], [54, 79]]), PUCK(40, 23), PUCK(41, 68),
    ],
    arrows: [pass([39, 23], [45, 27]), pass([41, 69], [47, 71])],
  },
  "SAG-002": { // 2-on-2 half-ice: goalies in both nets, cones mark the middle of the ice
    markers: [GT, GB, ...cones([[50, 14], [50, 28], [50, 42], [50, 56], [50, 70], [50, 84]]), ...O([[20, 36], [30, 46]]), ...X([[24, 64], [34, 72]]), PUCK(21.8, 36.6)],
    arrows: [pass([21, 38], [30, 44]), run([26, 62], [24, 52])],
  },
  "SAG-003": { // king of the ring: three players, one net, each defends their own puck
    markers: [GT, P(34, 22, "1"), P(66, 24, "2"), P(50, 32, "3"), PUCK(36, 23.5)],
    arrows: [carry([34, 24], [44, 16]), pass([46, 15], [51, 10])],
  },
  "SAG-004": { // 4-on-4 with two neutral bumpers on the half boards
    markers: [GT, ...O([[34, 14], [44, 24], [34, 30], [56, 30]]), ...X([[44, 14], [56, 20], [66, 28], [50, 36]]), COACH(6, 22, "N"), COACH(94, 22, "N"), PUCK(35.8, 14.6)],
    arrows: [pass([35, 16], [8, 22]), pass([8, 24], [33, 30])],
  },
  "SAG-005": { // corner battle 2-on-2: coach at the point dumps the puck, pairs battle from the hash marks
    markers: [GT, COACH(30, 36, "Coach"), ...O([[12, 20], [16, 25]]), ...X([[12, 27], [20, 28]]), PUCK(9, 9)],
    arrows: [pass([31, 35], [10, 10]), run([12, 18], [10, 11]), run([13, 26], [11, 12])],
  },
  "SAG-006": { // net-front chaos: coach at the point shoots non-stop, three forwards battle for rebounds
    markers: [GT, COACH(50, 36, "Coach"), ...O([[40, 13], [60, 13], [50, 18]]), PUCK(51.8, 36.6)],
    arrows: [pass([50, 34], [50, 11])],
  },
  "SAG-007": { // transition 3-on-2 continuous: three attackers in the neutral zone, two defenders in the zone, next wave coming the other way
    markers: [GT, ...O([[36, 52], [50, 55], [64, 52]]), ...X([[42, 24], [58, 24]]), PUCK(51.8, 55.6), ...X([[36, 80], [64, 80]]), ...O([[34, 72], [50, 76], [66, 72]])],
    arrows: [carry([50, 52], [50, 34], [[50, 44]]), run([36, 49], [28, 28]), run([64, 49], [72, 28]), pass([50, 33], [72, 29]), pass([72, 27], [54, 10])],
  },
  "SAG-008": { // Swedish 5-on-5 on a shrunken ice: bumpers (cones) shrink the zone, goalies at both ends
    markers: [GT, GB, ...cones([[10, 28], [90, 28], [10, 72], [90, 72], [10, 50], [90, 50]]), ...O([[32, 38], [44, 44], [30, 52], [42, 58], [34, 66]]), ...X([[60, 36], [68, 46], [58, 52], [66, 60], [56, 66]]), PUCK(33.8, 38.6)],
    arrows: [pass([34, 40], [43, 43]), run([60, 38], [48, 40])],
  },
  "SAG-009": { // puck race relay: two teams in opposite corners, race around the far cone and back
    markers: [...O([[8, 92], [14, 92], [8, 86]]), ...X([[92, 92], [86, 92], [92, 86]]), PUCK(9.8, 92.6), PUCK(90.2, 92.6), CONE(28, 14), CONE(72, 14)],
    arrows: [carry([14, 88], [27, 17]), run([30, 17], [18, 88]), carry([86, 88], [73, 17]), run([70, 17], [82, 88])],
  },
  "SAG-010": { // keepaway box 4-on-2: ten passes scores
    markers: [...cones([[24, 40], [76, 40], [24, 60], [76, 60]]), ...O([[32, 44], [68, 44], [32, 56], [68, 56]]), ...X([[46, 49], [56, 52]]), PUCK(33.8, 44.6)],
    arrows: [pass([36, 44], [64, 44]), pass([68, 47], [68, 53]), pass([64, 56], [36, 56]), run([46, 47], [40, 44])],
  },
  "CND-001": { // full-ice sprints: goal line to goal line and back, coach times it
    markers: [...O(spread(16, 92, 84, 92, 5)), COACH(92, 50, "Coach")],
    arrows: [run([30, 89], [30, 9]), run([36, 9], [36, 89]), run([62, 89], [62, 9]), run([68, 9], [68, 89])],
  },
  "CND-002": { // Herbies: near blue line and back, red line and back, far blue line and back, full ice and back
    markers: [...O(spread(14, 92, 86, 92, 5)), COACH(94, 50, "Coach"), PUCK(17.8, 92.6), PUCK(35.8, 92.6), PUCK(53.8, 92.6), PUCK(71.8, 92.6), PUCK(89.8, 92.6)],
    arrows: [
      run([16, 89], [16, 67]), run([21, 67], [21, 89]),
      run([32, 89], [32, 51]), run([37, 51], [37, 89]),
      run([48, 89], [48, 36]), run([53, 36], [53, 89]),
      run([64, 89], [64, 9]), run([69, 9], [69, 89]),
    ],
  },
  "CND-003": { // puck chase sprints: coach dumps a puck into the far corner, pairs race from the blue line, winner passes back
    markers: [COACH(50, 50, "Coach"), ...O([[28, 37], [38, 37], [62, 37], [72, 37]]), PUCK(9, 7), PUCK(91, 7)],
    arrows: [pass([47, 48], [9, 8]), run([28, 34], [11, 10]), run([38, 34], [13, 11]), pass([11, 11], [47, 50], [[26, 30]]), pass([53, 48], [91, 8]), run([62, 34], [88, 11]), run([72, 34], [90, 12]), pass([89, 11], [53, 50], [[74, 30]])],
  },
  "CND-004": { // blue line to blue line repeats
    markers: [...O(spread(14, 65.3, 86, 65.3, 5)), COACH(94, 50, "Coach"), PUCK(15.8, 65.9), PUCK(33.8, 65.9), PUCK(51.8, 65.9), PUCK(69.8, 65.9), PUCK(87.8, 65.9)],
    arrows: [run([30, 62], [30, 38]), run([36, 38], [36, 62]), run([62, 62], [62, 38]), run([68, 38], [68, 62])],
  },
  "CND-005": { // battle circuit: corner battle, net-front battle, 1-on-1 angling, full-ice sprint
    markers: [GT, P(9, 10), D(14, 15), P(44, 14), D(54, 15), P(24, 72), PUCK(25.8, 72.6), D(36, 58), P(88, 92), PUCK(10.8, 10.6), PUCK(49.8, 14.6), COACH(50, 50, "Coach")],
    arrows: [carry([24, 69], [12, 44], [[18, 60]]), run([36, 56], [24, 46]), run([88, 88], [88, 10])],
  },
  "CND-006": { // goal line relay: cones on the far faceoff dots, two teams at the goal line
    markers: [CONE(27.3, 20.5), CONE(72.6, 20.5), ...O([[20, 92], [26, 92], [32, 92]]), ...X([[68, 92], [74, 92], [80, 92]]), PUCK(21.8, 92.6), PUCK(69.8, 92.6)],
    arrows: [run([27, 88], [27, 24]), run([31, 24], [31, 88]), run([73, 88], [73, 24]), run([69, 24], [69, 88])],
  },
  "WRM-001": { // free skate with pucks, no lines, no structure
    markers: [...O([[24, 24], [70, 20], [48, 38], [18, 56], [82, 52], [40, 70], [66, 78], [30, 86]]), ...[[24, 24], [70, 20], [48, 38], [18, 56], [82, 52], [40, 70], [66, 78], [30, 86]].map(([x, y]) => PUCK(x! + 3.4, y! + 1.4))],
    arrows: [carry([24, 28], [38, 46], [[22, 38]]), carry([70, 24], [58, 40], [[68, 34]]), carry([82, 56], [64, 66], [[80, 62]]), carry([40, 74], [26, 80], [[34, 80]])],
  },
  "WRM-002": { // follow the leader: single file behind the coach or a veteran, copying every move
    markers: [COACH(26, 62, "Lead"), ...O([[34, 66], [42, 70], [50, 74], [58, 76], [66, 76]])],
    arrows: [run([68, 78], [14, 46], [[44, 72], [26, 64]]), run([14, 44], [30, 22], [[12, 32]])],
  },
  "WRM-003": { // two-line passing warmup: lines at opposite blue lines, exchange the pass at the red line
    markers: [P(34, 65.3), P(34, 70), P(66, 34.6), P(66, 30), P(66, 65.3), P(66, 70), P(34, 34.6), P(34, 30), PUCK(35.8, 66), PUCK(67.8, 31)],
    arrows: [run([34, 62], [38, 52]), run([66, 38], [62, 48]), pass([40, 50], [60, 50]), run([62, 46], [66, 36]), run([66, 62], [62, 52]), run([34, 38], [38, 48])],
  },
  "WRM-004": { // stretch and flow skate: easy laps while the coach leads dynamic stretches, then build-up sprints
    markers: [COACH(50, 50, "Coach"), ...O([[14, 72], [12, 50], [14, 28], [36, 12], [64, 12], [88, 34]])],
    arrows: [run([50, 88], [56, 88], [[20, 88], [10, 76], [10, 24], [20, 12], [80, 12], [90, 24], [90, 76], [80, 88]])],
  },
  "WRM-005": { // horseshoe: first skater backward, pass from the second, forward around the far cone, drive wide and shoot
    markers: [GT, CONE(18, 34.6), CONE(82, 34.6), P(42, 52), P(42, 58), P(58, 52), P(58, 58), PUCK(43.8, 58.6), PUCK(56.2, 58.6)],
    arrows: [run([42, 51], [42, 55]), pass([42, 57], [43, 54]), carry([41, 52], [26, 20], [[30, 44], [16, 36], [16, 28]]), pass([27, 19], [51, 10])],
  },
  "WRM-006": { // 3-pass flow: two corner lines and a blue-line line, down the wing and shoot
    markers: [GT, P(9, 8), P(9, 14), P(91, 8), P(91, 14), P(50, 36), P(50, 41), PUCK(10.8, 8.6), PUCK(92.8, 8.6)],
    arrows: [pass([11, 9], [47, 34]), pass([50, 34], [13, 11]), pass([13, 8], [88, 8], [[50, 4]]), carry([90, 12], [72, 22], [[88, 18]]), pass([71, 21], [53, 10])],
  },
};
