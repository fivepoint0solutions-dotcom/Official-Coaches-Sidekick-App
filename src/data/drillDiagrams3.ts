import { CONE, COACH, D, G, P, PUCK, RINK, carry, onEllipse, pass, run, type Diagram } from "./diagramKit";

const GT = G(); // goalie in the top crease (the end we attack)
const GB = G(50, 91.5); // goalie in the bottom crease (the end we defend)
const TL = [27.3, RINK.topCircleY] as const;
const TR = [72.6, RINK.topCircleY] as const;
const BL = [27.3, RINK.botCircleY] as const;

/** The power play unit attacking the top net, in an umbrella: point, two half-boards, two low. */
const ppTop = () => [P(50, 36, "LD"), P(10, 22, "LW"), P(90, 22, "RW"), P(34, 10, "C"), P(66, 10, "RD")];
/** The same unit when it is attacking the bottom zone (the penalty kill drills defend there). */
const ppBottom = () => [P(50, 64, "LD"), P(10, 78, "LW"), P(90, 78, "RW"), P(34, 90, "C"), P(66, 90, "RD")];
/** Four penalty killers in a box in the bottom zone: two high, two low. */
const pkBox = () => [D(40, 75, "C"), D(60, 75, "RW"), D(38, 85, "LD"), D(62, 85, "RD")];

/** Power play, penalty kill, faceoff and goaltending drills (#61–85). */
export const drillDiagrams3: Record<string, Diagram> = {
  "PPL-001": { // umbrella: point, two at the half boards, two low; cones mark the spots, two passive killers hold a box
    markers: [...ppTop(), ...[[50, 36], [10, 22], [90, 22], [34, 10], [66, 10]].map(([x, y]) => CONE(x! + 3.8, y! + 3.4)), D(44, 20, "C"), D(56, 20, "RW"), PUCK(48.4, 37.6), COACH(50, 28, "Coach")],
    arrows: [pass([48, 34], [14, 23]), pass([14, 20], [32, 12]), pass([37, 10], [62, 10]), pass([68, 12], [87, 21]), pass([87, 24], [54, 35])],
  },
  "PPL-002": { // PP breakout entry: unit in the neutral zone, four killers at the blue line; carry-in wide, drop pass, or stretch pass
    markers: [GT, P(40, 57, "LD"), P(60, 57, "RD"), P(18, 52, "LW"), P(82, 52, "RW"), P(50, 48, "C"), PUCK(41.8, 57.6), D(30, 35, "LD"), D(43, 35, "C"), D(57, 35, "RW"), D(70, 35, "RD")],
    arrows: [carry([18, 49], [10, 24], [[12, 38]]), pass([12, 26], [26, 38]), pass([60, 54], [80, 24])],
  },
  "PPL-003": { // one-timer seam pass: passer at the half boards, shooter in the opposite circle, screener in front
    markers: [GT, P(10, 23, "LW"), P(70, 22, "RW"), P(50, 15, "C"), PUCK(11.8, 23.6), D(16, 27)],
    arrows: [pass([13, 23], [66, 22]), pass([70, 20], [53, 10])],
  },
  "PPL-004": { // 5-on-4 controlled scrimmage: umbrella against a box, coach starts at the point
    markers: [GT, ...ppTop(), D(43, 22, "C"), D(57, 22, "RW"), D(43, 11, "LD"), D(57, 11, "RD"), COACH(30, 37, "Coach"), PUCK(48.2, 37.6)],
    arrows: [pass([31, 37], [46, 36])],
  },
  "PPL-005": { // net-front screen and tips: point shooter, screener on the goalie, one defender ties the stick
    markers: [GT, P(50, 36, "LD"), P(46, 14, "C"), D(54, 15, "RD"), PUCK(51.8, 36.6)],
    arrows: [pass([50, 34], [50, 11])],
  },
  "PPL-006": { // 5-on-3 rotation: umbrella plus one, coach feeds from the corner
    markers: [GT, P(36, 36, "LD"), P(64, 36, "RD"), P(10, 22, "LW"), P(90, 22, "RW"), P(50, 12, "C"), D(42, 14, "LD"), D(58, 14, "RD"), D(50, 23, "C"), COACH(94, 6, "Coach"), PUCK(92.2, 8.6)],
    arrows: [pass([92, 8], [90, 20]), pass([87, 23], [64, 35]), pass([36, 37], [13, 23]), pass([13, 20], [48, 14])],
  },
  "PKL-001": { // box basics: four killers in the box, cones on the spots, five attackers move the puck around the perimeter
    markers: [GB, ...pkBox(), ...[[40, 75], [60, 75], [38, 85], [62, 85]].map(([x, y]) => CONE(x! + 3.8, y! + 3)), ...ppBottom(), PUCK(48.2, 65.6), COACH(82, 70, "Coach")],
    arrows: [pass([48, 66], [13, 77]), pass([14, 80], [32, 88]), pass([37, 90], [62, 90]), run([40, 73], [34, 73]), run([60, 73], [54, 73])],
  },
  "PKL-002": { // diamond: one high pressuring, two across, one low; the high killer forces the point
    markers: [GB, D(50, 72, "C"), D(36, 80, "LW"), D(64, 80, "RW"), D(50, 86, "LD"), ...ppBottom(), PUCK(48.2, 65.6)],
    arrows: [run([50, 70], [50, 66]), pass([48, 66], [13, 77])],
  },
  "PKL-003": { // pressure points: coach calls a scenario, killers choose to pressure or contain
    markers: [GB, ...pkBox(), ...ppBottom(), COACH(26, 64, "Coach"), PUCK(11.8, 79.6)],
    arrows: [run([38, 73], [18, 77]), run([40, 77], [34, 80]), pass([12, 77], [32, 88])],
  },
  "PKL-004": { // 4-on-5 controlled scrimmage: faceoff at the dot, coach drops the puck
    markers: [GB, ...pkBox(), ...ppBottom(), COACH(33, 81, "Coach"), PUCK(27.3, 79.3)],
    arrows: [],
  },
  "PKL-005": { // clear the zone under pressure: two killers against two light forecheckers, no goalie
    markers: [D(40, 86, "LD"), D(60, 86, "RD"), P(28, 76, "LW"), P(72, 76, "RW"), PUCK(38.2, 86.6)],
    arrows: [pass([38, 84], [8, 60]), carry([60, 83], [66, 56], [[64, 70]])],
  },
  "PKL-006": { // faceoff loss recovery: win it clean and clear, or defend live for thirty seconds
    markers: [GB, D(25, 79.3, "C"), P(29.6, 79.3, "C"), D(14, 79.3, "LW"), P(40, 79.3, "RW"), D(24, 88, "LD"), D(36, 88, "RD"), P(20, 70, "LD"), P(36, 70, "RD"), COACH(18, 86, "Coach"), PUCK(27.3, 79.3), P(14, 70, "LW")],
    arrows: [pass([26, 81], [32, 87]), run([24, 86], [10, 64])],
  },
  "FOF-001": { // pairs at each faceoff dot, correct stance, coach circulates
    markers: [P(TL[0], 18.8), D(TL[0], 22.2), P(TR[0], 18.8), D(TR[0], 22.2), P(BL[0], 77.6), D(BL[0], 81), P(72.6, 77.6), D(72.6, 81), COACH(50, 28, "Coach"), PUCK(27.9, 20.5), PUCK(73.2, 20.5), PUCK(27.9, 79.3), PUCK(73.2, 79.3)],
  },
  "FOF-002": { // centre wins the draw straight back to the D at the point, who one-touches it up the boards
    markers: [P(TL[0], 18.8, "C"), D(TL[0], 22.2), P(32, 35, "D"), COACH(40, 24, "Coach"), PUCK(TL[0] + 0.6, TL[1])],
    arrows: [pass([TL[0], 21], [32, 33]), pass([30, 35], [10, 48])],
  },
  "FOF-003": { // tie-up and help: two centres tie up, wingers crash in, D at the points
    markers: [P(TL[0], 18.8, "C"), D(TL[0], 22.2, "C"), P(15, 15), P(40, 15), D(15, 25.5), D(40, 25.5), P(22, 36, "D"), D(33, 36, "D"), PUCK(27.9, 20.5)],
    arrows: [run([17, 17], [24, 20]), run([38, 17], [31, 20]), run([17, 24], [24, 22]), run([38, 24], [31, 22])],
  },
  "FOF-004": { // forehand sweep and backhand win: pairs at the dots, coach counts clean wins
    markers: [P(TL[0], 18.8), D(TL[0], 22.2), P(TR[0], 18.8), D(TR[0], 22.2), COACH(50, 34, "Coach"), PUCK(27.9, 20.5), PUCK(73.2, 20.5)],
    arrows: [pass([TL[0] + 1.5, 20.5], [TL[0] + 8, 27]), pass([TR[0] - 1.5, 20.5], [TR[0] - 8, 27])],
  },
  "FOF-005": { // set play off the draw: centre wins back, D one-touches to the winger breaking
    markers: [GT, P(TL[0], 18.8, "C"), D(TL[0], 22.2), P(31, 36, "D"), P(10, 30), P(44, 30), D(18, 30), D(40, 24), PUCK(TL[0] + 0.6, TL[1]), COACH(50, 28, "Coach")],
    arrows: [pass([TL[0], 21], [31, 34]), pass([30, 36], [12, 28]), run([10, 28], [14, 14])],
  },
  "GLT-001": { // crease shuffles: goalie squares up to the coach, shuffles left or right
    markers: [GT, COACH(50, 24, "Coach"), PUCK(51.8, 24.6)],
    arrows: [run([45, 8.6], [40, 8.6]), run([55, 8.6], [60, 8.6]), pass([50, 22], [50, 12])],
  },
  "GLT-002": { // butterfly basics: coach shoots low from the slot
    markers: [GT, COACH(50, 22, "Coach"), PUCK(51.8, 22.6)],
    arrows: [pass([50, 20], [50, 11])],
  },
  "GLT-003": { // T-push post to post: coach at the top of the circle passes across, goalie pushes to the far post and sets
    markers: [G(44, 9), COACH(30, 21, "Coach"), PUCK(31.8, 21.6)],
    arrows: [pass([33, 21], [68, 21]), run([46, 9], [56, 9]), pass([70, 20], [54, 10])],
  },
  "GLT-004": { // rebound control: shooter in the slot, second shooter ready at the hash marks
    markers: [GT, P(50, 24), PUCK(51.8, 24.6), P(66, 20)],
    arrows: [pass([50, 22], [50, 11]), pass([55, 9], [86, 7])],
  },
  "GLT-005": { // glove and blocker reaction: quick wrist shots high glove, high blocker
    markers: [GT, COACH(50, 22, "Coach"), PUCK(51.8, 22.6)],
    arrows: [pass([48, 20], [44, 8]), pass([52, 20], [57, 8])],
  },
  "GLT-006": { // breakaway reads: shooter from centre ice, goalie holds the top of the crease and matches pace backward
    markers: [GT, P(44, 52), P(50, 56), P(56, 52), PUCK(45.8, 52.6)],
    arrows: [carry([44, 49], [48, 22], [[46, 36]]), pass([48, 21], [52, 10]), run([50, 11], [50, 9])],
  },
  "GLT-007": { // post integration and wraps: goalie on the post, shooter wraps from the corner
    markers: [G(44, 9), P(10, 8), PUCK(11.8, 8.6), P(70, 22)],
    arrows: [carry([12, 7], [58, 5], [[30, 4.6]]), run([46, 9], [57, 9]), pass([70, 20], [57, 10]), pass([58, 5], [68, 20])],
  },
  "GLT-008": { // puck handling behind the net: coach rims it, goalie stops it behind the net and sets it for the D
    markers: [GT, D(36, 4.8, "D"), D(64, 4.8, "D"), COACH(88, 26, "Coach"), PUCK(86.2, 26.6), D(78, 15)],
    arrows: [pass([86, 24], [92, 8], [[93, 16]]), pass([90, 6], [68, 5]), pass([54, 7], [39, 5]), pass([36, 5], [18, 42])],
  },
};
