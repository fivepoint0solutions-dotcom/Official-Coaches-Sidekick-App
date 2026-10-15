import { CONE, COACH, D, G, P, PUCK, RINK, carry, onEllipse, pass, run, spread, type Diagram } from "./diagramKit";

const CC = RINK.centre;
const GT = G(); // goalie in the top crease
const GB = G(50, 91.5); // goalie in the bottom crease
const O = (pts: [number, number][]) => pts.map(([x, y]) => P(x, y));
const X = (pts: [number, number][]) => pts.map(([x, y]) => D(x, y));

/** Puck handling, body contact, defensive-zone and offensive-zone drills (#30–60). Attacking end is the top. */
export const drillDiagrams2: Record<string, Diagram> = {
  "PHL-001": { // spread out, stand in your own space, wide-narrow dribbling
    markers: [...O([[22, 24], [50, 20], [78, 24], [24, 50], [76, 50], [22, 76], [50, 80], [78, 76]]), ...[[22, 24], [50, 20], [78, 24], [24, 50], [76, 50], [22, 76], [50, 80], [78, 76]].map(([x, y]) => PUCK(x! + 3.4, y! + 1.4))],
    arrows: [carry([15, 30], [30, 30]), carry([70, 56], [86, 56])],
  },
  "PHL-002": { // six cones in a zigzag down the slot, figure-eights, then a shot
    markers: [GT, ...[[38, 70], [62, 62], [38, 54], [62, 46], [38, 38], [62, 30]].map(([x, y]) => CONE(x!, y!)), P(50, 88), PUCK(51.8, 88.6)],
    arrows: [carry([50, 84], [50, 22], [[45, 70], [55, 62], [45, 54], [55, 46], [45, 38], [55, 30]]), pass([50, 21], [50, 11])],
  },
  "PHL-003": { // two lines at the goal line, toe drags at each blue line, coach stands at centre ice as a passive defender
    markers: [...O([[38, 92], [38, 87], [62, 92], [62, 87]]), PUCK(39.8, 92.6), PUCK(63.8, 92.6), COACH(50, 50, "Coach"), GT],
    arrows: [carry([38, 84], [38, 12], [[38, 66], [45, 58], [45, 42], [38, 35]]), carry([62, 84], [62, 14], [[62, 66], [62, 36]]), pass([38, 13], [50, 10])],
  },
  "PHL-004": { // carrier starts in the corner, defender at the half boards pressures up the boards, cut to the middle and shoot
    markers: [GT, P(91, 9), PUCK(89.2, 9.6), D(84, 23)],
    arrows: [carry([91, 12], [88, 31], [[91, 21]]), carry([86, 34], [66, 34]), pass([64, 33], [52, 11])],
  },
  "PHL-005": { // shooters at the blue line, defender at the top of the circle, one deke, one shot
    markers: [GT, ...O([[34, 36], [42, 36], [66, 36]]), PUCK(35.8, 36.6), D(52, 27)],
    arrows: [carry([38, 34], [58, 20], [[44, 30], [56, 25]]), pass([57, 19], [51, 10])],
  },
  "PHL-006": { // four stations: cone weave, tire gate, stick-lift gate, tight-turn pylon
    markers: [
      ...[[22, 14], [22, 22], [22, 30]].map(([x, y]) => CONE(x!, y!)), P(22, 7), PUCK(23.8, 7.6),
      CONE(72, 22), CONE(86, 22), P(79, 10), PUCK(80.8, 10.6),
      CONE(26, 70), CONE(42, 70), P(34, 84), PUCK(35.8, 84.6),
      CONE(76, 70), P(76, 86), PUCK(77.8, 86.6),
    ],
    arrows: [carry([22, 9], [22, 36], [[16, 14], [28, 22], [16, 30]]), carry([79, 12], [79, 34]), carry([34, 82], [34, 56]), carry([76, 82], [76, 56], [[84, 70], [76, 62]])],
  },
  "PHL-007": { // small circles of cones, two players and two pucks per circle
    markers: [
      ...[[27, 28], [73, 28], [50, 70]].flatMap(([cx, cy]) => [0, 90, 180, 270].map((a) => { const [x, y] = onEllipse(cx!, cy!, 10, 4.9, a); return CONE(x, y); })),
      ...[[27, 28], [73, 28], [50, 70]].flatMap(([cx, cy]) => [P(cx! - 3, cy!), P(cx! + 3, cy!), PUCK(cx! - 4.9, cy! + 1.4), PUCK(cx! + 4.9, cy! + 1.4)]),
    ],
  },
  "PHL-008": { // goal line, sprint the length with the puck, three touches a zone, sprint back
    markers: [...O(spread(14, 92, 86, 92, 5)), PUCK(15.8, 92.6), PUCK(33.8, 92.6), PUCK(51.8, 92.6), PUCK(69.8, 92.6), PUCK(87.8, 92.6), COACH(50, 50, "Coach")],
    arrows: [carry([38, 88], [38, 12]), carry([62, 12], [62, 88])],
  },
  "PHL-009": { // keepaway in the centre circle: four attackers, two defenders, one puck
    markers: [...[0, 90, 180, 270].map((a) => { const [x, y] = onEllipse(CC[0], CC[1], 12, 5.84, a); return P(x, y); }), D(46, 47.5), D(55, 52), PUCK(51.8, 49.2)],
    arrows: [pass([60, 50], [51, 56.5]), pass([49, 56], [41, 50]), pass([42, 48], [50, 43.5])],
  },
  "BDC-001": { // pairs skate side by side down the boards, a controlled shoulder bump every five strides
    markers: [...O([[8, 80], [16, 80], [8, 54], [16, 54]]), COACH(26, 70, "Coach")],
    arrows: [run([8, 76], [8, 40]), run([16, 76], [16, 40]), run([8, 50], [8, 18]), run([16, 50], [16, 18])],
  },
  "BDC-002": { // offensive player from the blue line, defender from the red line, angle to the boards
    markers: [P(14, 66), PUCK(15.8, 66.6), D(32, 50), P(86, 66), PUCK(84.2, 66.6), D(68, 50)],
    arrows: [carry([14, 63], [10, 36]), run([32, 48], [14, 42]), carry([86, 63], [90, 36]), run([68, 48], [86, 42])],
  },
  "BDC-003": { // carrier skates the puck into the corner, defender two strides behind pins him to the boards
    markers: [P(78, 20), PUCK(79.8, 20.6), D(70, 28), P(22, 20), PUCK(23.8, 20.6), D(30, 28)],
    arrows: [carry([80, 18], [91, 8]), run([72, 26], [89, 11]), carry([20, 18], [9, 8]), run([28, 26], [11, 11])],
  },
  "BDC-004": { // pairs skate the length of the ice, carrier stickhandling, checker alongside
    markers: [P(28, 88), PUCK(29.8, 88.6), D(38, 88), P(62, 88), PUCK(63.8, 88.6), D(72, 88)],
    arrows: [carry([28, 84], [28, 12]), run([38, 84], [38, 12]), carry([62, 84], [62, 12]), run([72, 84], [72, 12])],
  },
  "BDC-005": { // carriers from centre ice, defenders from the far blue line steer them to the outside
    markers: [P(34, 52), PUCK(35.8, 52.6), D(40, 34.6), P(66, 52), PUCK(64.2, 52.6), D(60, 34.6)],
    arrows: [carry([34, 49], [18, 30], [[26, 40]]), run([40, 36], [26, 33]), carry([66, 49], [82, 30], [[74, 40]]), run([60, 36], [74, 33])],
  },
  "BDC-006": { // coach at the point dumps a puck into the corner, two players race in from the hash marks, winner passes back to the coach
    markers: [COACH(32, 36, "Coach"), P(12, 20.5), D(12, 27), PUCK(8.2, 9)],
    arrows: [pass([31, 35], [9, 10]), run([12, 19], [9, 11]), run([12, 25], [10, 12]), pass([13, 12], [31, 34], [[24, 16]])],
  },
  "BDC-007": { // coach shoots from the point, D boxes out the forward at the crease, rebound to the corner
    markers: [GT, COACH(30, 36, "Coach"), D(50, 14), P(32, 22), PUCK(31, 35)],
    arrows: [pass([31, 34], [49, 11]), run([33, 22], [45, 15]), carry([50, 14], [76, 14])],
  },
  "DFZ-001": { // five cones mark the coverage spots, players walk to them
    markers: [GB, ...[[36, 86], [64, 86], [50, 77], [24, 72], [76, 72]].map(([x, y]) => CONE(x!, y!)), ...X([[24, 62], [38, 62], [50, 62], [62, 62], [76, 62]]), COACH(92, 78, "Coach"), PUCK(88, 80)],
    arrows: [run([24, 66], [24, 69]), run([38, 66], [36, 83]), run([50, 66], [50, 74]), run([62, 66], [64, 83]), run([76, 66], [76, 69])],
  },
  "DFZ-002": { // strong-side breakout: D behind the net, wingers on the boards, centre low
    markers: [GB, D(50, 95.4), D(7, 80), D(93, 80), D(50, 82), PUCK(51.8, 96)],
    arrows: [pass([48, 95.4], [9, 82], [[18, 92]]), carry([7, 78], [7, 46]), run([50, 80], [34, 86])],
  },
  "DFZ-003": { // reverse: D carries behind the net under pressure, reverses to his partner, weak-side winger carries out
    markers: [GB, D(36, 95.4), D(64, 95.4), D(6, 78), D(94, 78), D(50, 72), P(26, 86), P(74, 88), PUCK(37.8, 96)],
    arrows: [carry([38, 95.4], [52, 95.4]), pass([54, 95.4], [62, 95.4]), pass([64, 94], [93, 82]), carry([94, 76], [94, 44]), run([28, 84], [37, 94])],
  },
  "DFZ-004": { // wheel: D retrieves a dumped puck behind the net, wheels it out, wingers stretch to the far blue line
    markers: [GB, D(60, 95.4), PUCK(61.8, 96), D(10, 35), D(90, 35), COACH(50, 52, "Coach")],
    arrows: [pass([50, 55], [58, 94]), carry([58, 95.4], [28, 70], [[36, 95.4], [28, 86]]), pass([28, 68], [10, 38])],
  },
  "DFZ-005": { // 2-on-2 low coverage: coach at the point moves the puck low
    markers: [GB, ...X([[42, 84], [58, 84]]), ...O([[24, 88], [36, 76]]), COACH(30, 65.3, "Coach"), PUCK(31.8, 65.9)],
    arrows: [pass([30, 66], [25, 86]), pass([26, 87], [35, 78])],
  },
  "DFZ-006": { // backcheck: 2-on-0 rush from the far blue line, backcheckers start at centre ice three seconds later
    markers: [GT, ...O([[40, 36], [60, 36]]), PUCK(41.8, 36.6), ...X([[44, 50], [56, 50]])],
    arrows: [carry([40, 33], [42, 18]), pass([43, 17], [58, 15]), pass([58, 14], [52, 10]), run([44, 47], [44, 26]), run([56, 47], [58, 24])],
  },
  "DFZ-007": { // 5-on-5 walkthrough in the defensive zone, coach moves the puck at the point
    markers: [GB, ...X([[36, 86], [64, 86], [50, 76], [24, 70], [76, 70]]), ...O([[34, 66], [66, 66], [50, 62], [22, 80], [78, 80]]), COACH(50, 65.3, "Coach"), PUCK(48, 66)],
    arrows: [pass([49, 66], [35, 66]), pass([36, 67], [22, 79]), pass([77, 79], [66, 67])],
  },
  "OFZ-001": { // net drive 1-on-0: down the wing around a passive defender, cut to the net
    markers: [GT, P(86, 36), PUCK(87.8, 36.6), COACH(70, 27, "Coach")],
    arrows: [carry([86, 33], [60, 13], [[86, 24], [78, 17]]), pass([60, 12], [53, 10])],
  },
  "OFZ-002": { // 2-on-1 rush from centre ice
    markers: [GT, P(42, 52), P(58, 52), PUCK(43.8, 52.6), D(50, 36)],
    arrows: [carry([42, 49], [40, 30]), run([58, 49], [62, 28]), pass([41, 29], [60, 24]), pass([60, 23], [53, 10])],
  },
  "OFZ-003": { // 3-on-2 rush: middle drive creates the lane
    markers: [GT, P(34, 52), P(50, 55), P(66, 52), PUCK(51.8, 55.6), D(43, 37), D(57, 37)],
    arrows: [carry([50, 52], [50, 36], [[50, 44]]), run([34, 49], [28, 26]), run([66, 49], [72, 26]), pass([50, 35], [72, 27]), pass([72, 25], [54, 10])],
  },
  "OFZ-004": { // cycle down low: two forwards and the coach down low, D at the points
    markers: [GT, P(14, 14), P(26, 24), COACH(88, 26, "Coach"), P(30, 36, "D"), P(70, 36, "D"), PUCK(15.8, 14.6)],
    arrows: [pass([16, 15], [25, 22]), pass([26, 22], [15, 10]), pass([18, 16], [29, 34]), pass([31, 35], [49, 11])],
  },
  "OFZ-005": { // point shots with traffic: D walk the blue line, forwards screen and tip
    markers: [GT, P(30, 36, "D"), P(70, 36, "D"), P(44, 15), P(56, 15), PUCK(31.8, 36.6)],
    arrows: [run([32, 34], [44, 34]), pass([45, 34], [50, 11])],
  },
  "OFZ-006": { // zone entry, wide drive: winger down the boards, defender gaps up, centre drives the middle
    markers: [GT, P(86, 52), PUCK(87.8, 52.6), D(76, 36), P(50, 52)],
    arrows: [carry([86, 49], [74, 17], [[91, 40], [90, 28]]), run([50, 49], [50, 18]), pass([73, 16], [53, 10])],
  },
  "OFZ-007": { // behind the net: carry behind, read the coverage, wraparound or feed the slot
    markers: [GT, P(62, 4.6), PUCK(60.2, 5.1), D(70, 8), D(50, 15), P(50, 28)],
    arrows: [carry([60, 4.6], [36, 4.6]), pass([36, 5.6], [50, 25])],
  },
  "OFZ-008": { // two nets, two corners: skate toward each other, give-and-go at centre, finish 2-on-0
    markers: [GT, GB, P(9, 91), PUCK(10.8, 91.6), P(91, 9), PUCK(89.2, 9.6)],
    arrows: [carry([10, 88], [44, 56], [[12, 72], [30, 62]]), carry([90, 12], [56, 44], [[88, 28], [70, 38]]), pass([46, 54], [54, 46]), pass([54, 45], [54, 20]), pass([54, 19], [51, 10])],
  },
};
