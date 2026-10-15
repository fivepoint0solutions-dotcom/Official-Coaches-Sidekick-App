import { CONE, COACH, D, G, P, PUCK, RINK, arcPts, carry, onEllipse, pass, run, spread, type Diagram } from "./diagramKit";

const { topCircleY: TCY, botCircleY: BCY, circleRx: CRX, circleRy: CRY } = RINK;
const [TL, TR] = [[27.3, TCY], [72.6, TCY]] as const;
const [BL, BR] = [[27.3, BCY], [72.6, BCY]] as const;
const CC = RINK.centre;
const row = (pts: [number, number][]) => pts.map(([x, y]) => P(x, y));

/** Skating, shooting and passing drills 1–30. Top of the rink is the attacking end; every goalie stands in the crease. */
export const drillDiagrams1: Record<string, Diagram> = {
  "SKT-001": { // line up on the goal line, stride and glide the full length
    markers: [...row(spread(14, 91, 86, 91, 5)), COACH(50, 50)],
    arrows: [run([32, 88], [32, 36]), run([32, 33], [32, 10]), run([68, 88], [68, 36]), run([68, 33], [68, 10])],
  },
  "SKT-002": { // spread along the boards, c-cuts, then across the ice
    markers: row(spread(6, 18, 6, 88, 6)),
    arrows: [run([13, 38], [90, 38]), run([13, 62], [90, 62])],
  },
  "SKT-003": { // two lines at the goal line, stopping zone of cones between the blue lines
    markers: [P(36, 92), P(36, 86), P(36, 80), P(64, 92), P(64, 86), P(64, 80), CONE(18, 38), CONE(82, 38), CONE(18, 62), CONE(82, 62)],
    arrows: [run([36, 76], [36, 52]), run([36, 47], [36, 10]), run([64, 76], [64, 52]), run([64, 47], [64, 10])],
  },
  "SKT-004": { // five players around one faceoff circle, crossovers, then a puck
    markers: [...[0, 72, 144, 216, 288].map((a) => { const [x, y] = onEllipse(TL[0], TL[1], CRX, CRY, a); return P(x, y); }), PUCK(40.6, 21.6)],
    arrows: [run(onEllipse(TL[0], TL[1], CRX + 2, CRY + 1.5, 30), onEllipse(TL[0], TL[1], CRX + 2, CRY + 1.5, 330), arcPts(TL[0], TL[1], CRX + 2, CRY + 1.5, 60, 300, 30))],
  },
  "SKT-005": { // line up on the goal line facing up ice, backward c-cuts to the blue line
    markers: row(spread(16, 91, 84, 91, 5)),
    arrows: [run([32, 86], [32, 68]), run([68, 86], [68, 68]), run([32, 68], [32, 88]), run([68, 68], [68, 88])],
  },
  "SKT-006": { // cones on the four neutral-zone dots, two lines at centre ice, half with pucks
    markers: [CONE(27.3, 41), CONE(72.6, 41), CONE(27.3, 59), CONE(72.6, 59), P(44, 49), P(44, 53), P(56, 49), P(56, 53), PUCK(45.8, 49), PUCK(54.2, 53)],
    arrows: [carry([44, 49], [27, 44], [[33, 45]]), run([27, 40], [72, 44], [[40, 38], [60, 38]]), run([73, 46], [73, 57]), run([72, 61], [28, 56], [[50, 63]]), run([27, 54], [27, 36])],
  },
  "SKT-007": { // three pivot gates (red line, both blue lines), two lines at the goal line
    markers: [CONE(38, 65.3), CONE(62, 65.3), CONE(38, 49.9), CONE(62, 49.9), CONE(38, 34.6), CONE(62, 34.6), P(44, 92), P(44, 86), P(56, 92), P(56, 86)],
    arrows: [run([44, 82], [44, 68]), run([44, 63], [44, 53]), run([44, 47], [44, 37]), run([44, 31], [44, 6])],
  },
  "SKT-008": { // russian circles: end circle, centre circle, far end circle, two groups from opposite ends
    markers: [P(21, 20.5), P(27, 24), P(79, 79.3), P(73, 76)],
    arrows: [
      run(onEllipse(TL[0], TL[1], CRX, CRY, 60), onEllipse(TL[0], TL[1], CRX, CRY, 120), arcPts(TL[0], TL[1], CRX, CRY, 60, 400, 30)),
      run([34, 27], [42, 44]),
      run(onEllipse(CC[0], CC[1], RINK.centreRx, RINK.centreRy, 200), onEllipse(CC[0], CC[1], RINK.centreRx, RINK.centreRy, 160), arcPts(CC[0], CC[1], RINK.centreRx, RINK.centreRy, 200, 520, 30)),
      run([58, 56], [66, 73]),
      run(onEllipse(BR[0], BR[1], CRX, CRY, 240), onEllipse(BR[0], BR[1], CRX, CRY, 300), arcPts(BR[0], BR[1], CRX, CRY, 240, 600, 30)),
    ],
  },
  "SKT-009": { // six cones down the middle, three metres apart, weave on one foot
    markers: [...spread(50, 27, 50, 73, 6).map(([x, y]) => CONE(x, y)), P(44, 92), P(56, 92)],
    arrows: [run([50, 86], [50, 16], [[44, 73], [56, 64], [44, 55], [56, 46], [44, 36], [56, 27]])],
  },
  "SKT-010": { // players around the centre circle, backward crossovers with a puck, coach in the middle
    markers: [...[0, 72, 144, 216, 288].flatMap((a) => { const [x, y] = onEllipse(CC[0], CC[1], 12, 5.84, a); return [P(x, y), PUCK(x + 1.9, y + 1.2)]; }), COACH(50, 49.9)],
    arrows: [run(onEllipse(CC[0], CC[1], 14.5, 7.4, 20), onEllipse(CC[0], CC[1], 14.5, 7.4, 330), arcPts(CC[0], CC[1], 14.5, 7.4, 50, 340, 30))],
  },
  "SHT-001": { // pairs along the boards, shooter puts wrist shots into the boards, partner collects the rebound
    markers: [P(14, 22), P(14, 31), P(14, 50), P(14, 59), P(14, 76), P(14, 85), P(86, 36), P(86, 45), P(86, 64), P(86, 73), PUCK(15.8, 22.6), PUCK(15.8, 50.6), PUCK(15.8, 76.6), PUCK(84.2, 36.6), PUCK(84.2, 64.6)],
    arrows: [pass([13, 22], [3, 22]), pass([13, 50], [3, 50]), pass([13, 76], [3, 76]), pass([87, 36], [97, 36]), pass([87, 64], [97, 64])],
  },
  "SHT-002": { // down the boards with a puck, coach slides a second puck into the path, sweep shot on the move
    markers: [G(), P(90, 12), P(90, 7), P(93, 16), PUCK(88.2, 12.6), COACH(86, 23, "Coach"), PUCK(83, 24.5)],
    arrows: [carry([89, 14], [82, 20], [[88, 18]]), pass([82, 23], [76, 22]), pass([72, 20], [53, 10]), run([70, 20], [55, 12])],
  },
  "SHT-003": { // line in the slot with pucks, forehand then backhand lifts at the net
    markers: [G(), P(50, 28), P(50, 33), P(50, 38), P(50, 43), PUCK(51.8, 28.6)],
    arrows: [pass([50, 26], [50, 12])],
  },
  "SHT-004": { // passers at the half boards, shooters in the slot, catch-and-release
    markers: [G(), P(90, 24, "P"), P(90, 29, "P"), P(40, 20, "S"), P(40, 26, "S"), PUCK(88.2, 24.6)],
    arrows: [pass([88, 24], [43, 22]), pass([38, 20], [48, 9]), run([40, 20], [50, 12])],
  },
  "SHT-005": { // passer at the goal line, shooters at the top of the circle, one-timers
    markers: [G(), P(84, 6.5, "P"), P(68, 22), P(68, 27), P(68, 32), PUCK(82.2, 7.4)],
    arrows: [pass([83, 8], [69, 20]), pass([66, 20], [53, 10]), run([62, 18], [57, 12])],
  },
  "SHT-006": { // far blue line, one at a time down the wing, shoot in stride at the top of the circle
    markers: [G(), P(78, 36), P(84, 36), P(90, 36), PUCK(78, 38), D(60, 31)],
    arrows: [carry([78, 34], [74, 26], [[78, 30]]), pass([73, 23], [53, 10]), run([72, 20], [60, 12])],
  },
  "SHT-007": { // full ice: far net with goalie, players at the far blue line, slap shots
    markers: [G(), P(30, 36), P(40, 36), P(50, 36), P(60, 36), P(70, 36), PUCK(31.8, 37)],
    arrows: [run([50, 33], [50, 24]), pass([50, 22], [50, 11]), run([50, 22], [50, 16])],
  },
  "SHT-008": { // shooter at the point, tipper at the top of the crease
    markers: [G(), P(38, 36, "S"), P(50, 13, "T"), D(56, 13), PUCK(39.8, 37)],
    arrows: [pass([39, 35], [50, 15]), pass([50, 14], [50, 10])],
  },
  "SHT-009": { // shootout moves from centre ice, one deke, one shot
    markers: [G(), P(44, 50), P(50, 53), P(56, 50), PUCK(45.8, 50.8), PUCK(51.8, 53.8), PUCK(57.8, 50.8)],
    arrows: [carry([44, 48], [50, 28], [[47, 38]]), carry([50, 27], [56, 22], [[53, 24]]), pass([55, 21], [51, 10])],
  },
  "SHT-010": { // three cones in the slot triangle, passer at the half boards, one-second release
    markers: [G(), CONE(40, 24), CONE(60, 24), CONE(50, 16), P(40, 26), P(60, 26), P(50, 18), P(90, 22, "P"), PUCK(88.2, 22.6)],
    arrows: [pass([88, 22], [62, 25]), pass([60, 23], [53, 11]), run([62, 24], [88, 12]), run([88, 12], [62, 24])],
  },
  "PAS-001": { // pairs across the ice, forehand to forehand, five metres apart
    markers: [P(20, 25), P(20, 36), P(80, 25), P(80, 36), P(20, 63), P(20, 74), P(80, 63), P(80, 74), P(50, 20), P(50, 31), PUCK(21.8, 25.6), PUCK(81.8, 25.6), PUCK(21.8, 63.6), PUCK(81.8, 63.6), PUCK(51.8, 20.6)],
    arrows: [pass([20, 28], [20, 33]), pass([80, 28], [80, 33]), pass([20, 66], [20, 71]), pass([80, 66], [80, 71]), pass([50, 23], [50, 28])],
  },
  "PAS-002": { // same pairs, backhand to backhand
    markers: [P(20, 25), P(20, 36), P(80, 25), P(80, 36), P(20, 63), P(20, 74), P(80, 63), P(80, 74), PUCK(18.2, 25.6), P(50, 20), P(50, 31), PUCK(51.8, 20.6), PUCK(81.8, 25.6), PUCK(21.8, 63.6), PUCK(81.8, 63.6)],
    arrows: [pass([20, 28], [20, 33]), pass([80, 28], [80, 33]), pass([20, 66], [20, 71]), pass([80, 66], [80, 71]), pass([50, 23], [50, 28])],
  },
  "PAS-003": { // two lines at opposite blue lines, exchange the pass at the red line
    markers: [P(34, 65.3), P(34, 70), P(66, 34.6), P(66, 30), P(66, 65.3), P(66, 70), P(34, 34.6), P(34, 30), PUCK(35.8, 66), PUCK(67.8, 35.2)],
    arrows: [run([34, 62], [38, 50]), run([66, 38], [62, 50]), pass([40, 50], [60, 50]), run([62, 48], [66, 36])],
  },
  "PAS-004": { // down the wing, give to the coach at the half boards, sprint past, return pass, shoot
    markers: [G(), P(90, 9), P(90, 5), P(93, 13), PUCK(88.2, 9.6), COACH(84, 24, "Coach")],
    arrows: [carry([89, 12], [85, 21], [[88, 17]]), pass([84, 22], [82, 30], [[88, 26]]), run([83, 20], [74, 28], [[85, 25]]), run([72, 28], [58, 14]), pass([58, 14], [50, 10])],
  },
  "PAS-005": { // pairs along the boards ten metres apart, bank pass off the boards
    markers: [P(12, 22), P(12, 42), P(88, 58), P(88, 78), PUCK(13.8, 22.6), PUCK(86.2, 58.6)],
    arrows: [pass([13, 24], [12, 40], [[4, 33]]), pass([87, 60], [88, 76], [[96, 69]]), run([12, 44], [12, 50])],
  },
  "PAS-006": { // saucer pass over two sticks laid flat between the pair
    markers: [P(34, 30), P(66, 30), P(34, 66), P(66, 66), CONE(46, 30), CONE(54, 30), CONE(46, 66), CONE(54, 66), PUCK(35.8, 30.6), PUCK(35.8, 66.6)],
    arrows: [pass([36, 29], [64, 29]), pass([64, 31], [36, 31]), pass([36, 65], [64, 65]), pass([64, 67], [36, 67])],
  },
  "PAS-007": { // two D at the points with pucks, two forwards in front, D-to-D then a low shot to tip
    markers: [G(), P(30, 36, "D"), P(70, 36, "D"), P(45, 13), P(56, 13), PUCK(31.8, 36.8)],
    arrows: [pass([32, 36], [68, 36]), pass([71, 36], [32, 36]), pass([68, 34], [50, 12])], // D-to-D, D-to-D again, then the shot (arrow order = time order)
  },
  "PAS-008": { // full ice: D behind the net, winger on the near blue line, forward breaking at the far blue line
    markers: [G(50, 91.5), P(50, 97, "D"), P(86, 65.3, "W"), P(40, 34.6, "F"), PUCK(51.8, 97.4)],
    arrows: [pass([52, 96], [86, 68], [[92, 88]]), pass([85, 63], [44, 36]), run([40, 33], [46, 14]), pass([46, 14], [50, 10])],
  },
  "PAS-009": { // one-touch circle at centre ice, one defender in the middle
    markers: [...[0, 72, 144, 216, 288].map((a) => { const [x, y] = onEllipse(CC[0], CC[1], 12, 5.84, a); return P(x, y); }), D(50, 49.9), PUCK(63, 50.6)],
    arrows: [pass([61, 50], [53.7, 55]), pass([49, 56.5], [39.5, 54.6]), pass([37, 51], [37, 46])],
  },
};
