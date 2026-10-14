import { COACH, D, G, P, PUCK, RINK, carry, pass, run, type Diagram } from "./diagramKit";

const GT = G();
const GB = G(50, 91.5);
const TL = [27.3, RINK.topCircleY] as const;
const BL = [27.3, RINK.botCircleY] as const;

/** Four penalty killers in a box in the top zone, two high and two low (passive killers for power-play plays). */
const boxTop = (): ReturnType<typeof D>[] => [D(41, 21, "C"), D(59, 21, "RW"), D(41, 12, "LD"), D(59, 12, "RD")];
/** The power play unit attacking the bottom net, for the penalty kill plays. */
const ppBottom = () => [P(50, 64, "LD"), P(10, 78, "LW"), P(90, 78, "RW"), P(34, 90, "C"), P(66, 90, "RD")];
const pkBox = () => [D(40, 75, "C"), D(60, 75, "RW"), D(38, 85, "LD"), D(62, 85, "RD")];

/** The 16 power-play and penalty-kill plays. Power-play plays attack the top net; penalty-kill plays defend the bottom net. */
export const drillDiagrams5: Record<string, Diagram> = {
  "PPP-001": { // 1-3-1: point, three across (half walls and a bumper), one in front
    markers: [GT, P(50, 36, "LD"), P(12, 23, "LW"), P(50, 26, "RD"), P(88, 23, "RW"), P(50, 14, "C"), ...boxTop().map((m) => ({ ...m, x: m.x + (m.x < 50 ? -2 : 2) })), PUCK(48.2, 37.6)],
    arrows: [pass([47, 35], [15, 24]), pass([16, 25], [47, 26]), pass([53, 26], [85, 24]), pass([87, 22], [54, 10])],
  },
  "PPP-002": { // overload: three on the strong side, weak-side one-timer
    markers: [GT, P(12, 14, "LW"), P(22, 26, "C"), P(30, 35, "LD"), P(72, 22, "RW"), P(62, 35, "RD"), D(30, 22, "C"), D(42, 20, "RW"), D(34, 12, "LD"), D(46, 14, "RD"), PUCK(13.8, 14.6)],
    arrows: [pass([14, 15], [21, 25]), pass([23, 28], [29, 34]), pass([32, 35], [69, 24]), pass([72, 20], [54, 10])],
  },
  "PPP-003": { // 4-1 spread: four around the outside, one in front
    markers: [GT, P(36, 36, "LD"), P(64, 36, "RD"), P(10, 22, "LW"), P(90, 22, "RW"), P(50, 14, "C"), ...boxTop(), PUCK(34.2, 37.6)],
    arrows: [pass([34, 35], [12, 23]), pass([12, 20], [36, 11], [[26, 14]]), pass([62, 36], [88, 23]), pass([49, 14], [50, 11])],
  },
  "PPP-004": { // 5-on-3 triangle: five attackers against three killers
    markers: [GT, P(36, 36, "LD"), P(64, 36, "RD"), P(10, 22, "LW"), P(90, 22, "RW"), P(50, 12, "C"), D(42, 15, "LD"), D(58, 15, "RD"), D(50, 23, "C"), PUCK(34.2, 37.6)],
    arrows: [pass([37, 35], [64, 35]), pass([66, 34], [88, 23]), pass([88, 20], [52, 11])],
  },
  "PPP-005": { // half-wall seam play: passer on the half wall, slot shooter, four passive killers in a box
    markers: [GT, P(10, 23, "LW"), P(50, 18, "C"), D(38, 23, "C"), D(62, 23, "RW"), D(40, 12, "LD"), D(60, 12, "RD"), PUCK(11.8, 23.6)],
    arrows: [pass([13, 22], [47, 18.5]), pass([50, 16], [50, 10.5])],
  },
  "PPP-006": { // bumper slot shot: passers on both half walls, bumper in the slot, no killers to start
    markers: [GT, P(10, 22, "LW"), P(90, 22, "RW"), P(50, 21, "C"), PUCK(11.8, 22.6)],
    arrows: [pass([13, 22], [47, 21]), pass([50, 19], [50, 11]), pass([87, 22], [53, 21])],
  },
  "PPP-007": { // drop-pass entry: carry wide, drop it back to the trailing man
    markers: [GT, P(52, 50, "C"), P(24, 50, "LW"), P(78, 54, "RW"), P(42, 60, "LD"), P(62, 58, "RD"), PUCK(53.8, 50.6), D(28, 35, "LD"), D(42, 35, "C"), D(58, 35, "RW"), D(72, 35, "RD")],
    arrows: [carry([52, 47], [86, 44], [[70, 46]]), pass([86, 43], [66, 54]), pass([62, 56], [80, 40]), run([24, 48], [14, 30])],
  },
  "PPP-008": { // offensive-zone faceoff play: win it back to the point, cross to the other D for a shot, wingers go to the net
    markers: [GT, P(TL[0], 18.8, "C"), D(TL[0], 22.2, "C"), P(32, 36, "LD"), P(60, 36, "RD"), P(14, 24, "LW"), P(46, 22, "RW"), D(20, 30, "LW"), D(40, 30, "RW"), PUCK(TL[0] + 0.6, TL[1])],
    arrows: [pass([TL[0], 21], [31, 34]), pass([34, 36], [58, 36]), pass([60, 34], [52, 11]), run([46, 20], [49, 14]), run([14, 22], [42, 13])],
  },
  "PKP-001": { // box: two high, two low, shifting as one
    markers: [GB, ...pkBox(), ...ppBottom(), PUCK(48.2, 65.6)],
    arrows: [pass([48, 66], [13, 77]), pass([14, 80], [32, 88]), run([40, 73], [34, 73]), run([60, 73], [54, 73])],
  },
  "PKP-002": { // diamond: one high, two wide, one low
    markers: [GB, D(50, 72, "C"), D(36, 80, "LW"), D(64, 80, "RW"), D(50, 86, "LD"), ...ppBottom(), PUCK(48.2, 65.6)],
    arrows: [run([50, 70], [50, 66]), pass([48, 66], [13, 77]), run([36, 78], [26, 74])],
  },
  "PKP-003": { // triangle plus one: three form a triangle in front, the fourth pressures
    markers: [GB, D(40, 84, "LD"), D(60, 84, "RD"), D(50, 77, "C"), D(50, 69, "RW"), ...ppBottom(), PUCK(48.2, 65.6)],
    arrows: [run([50, 67], [50, 65])],
  },
  "PKP-004": { // aggressive pressure: two forwards pressure high, two defencemen hold the net
    markers: [GB, D(42, 70, "C"), D(58, 70, "RW"), D(40, 86, "LD"), D(60, 86, "RD"), ...ppBottom(), PUCK(48.2, 65.6)],
    arrows: [run([42, 68], [28, 66]), run([58, 68], [72, 66])],
  },
  "PKP-005": { // 5-on-3 triangle: three killers against five
    markers: [GB, D(40, 84, "LD"), D(60, 84, "RD"), D(50, 76, "C"), ...ppBottom(), PUCK(48.2, 65.6)],
    arrows: [run([50, 74], [50, 70])],
  },
  "PKP-006": { // rim clear under pressure: D retrieves, forechecker applies pressure, rim it up the boards
    markers: [D(36, 90, "LD"), P(26, 80, "C"), PUCK(37.8, 90.6)],
    arrows: [run([26, 82], [34, 88]), pass([34, 90], [6, 72]), pass([6, 70], [6, 46])],
  },
  "PKP-007": { // shot-block lanes: two blockers, a point shooter, a tip player in front
    markers: [GB, D(42, 79, "LD"), D(58, 79, "RD"), P(50, 64, "LD"), P(50, 86, "C"), PUCK(51.8, 64.6)],
    arrows: [pass([50, 66], [50, 84]), run([42, 77], [46, 72]), run([58, 77], [54, 72])],
  },
  "PKP-008": { // defensive-zone faceoff: centre and four killers set for the draw, win it back to the D
    markers: [GB, D(BL[0], 77.6, "C"), P(BL[0], 81, "C"), D(14, 80, "LW"), D(39, 80, "RW"), D(23, 88, "LD"), D(37, 88, "RD"), P(20, 68, "LD"), P(36, 68, "RD"), P(10, 72, "LW"), P(46, 72, "RW"), PUCK(BL[0], BL[1])],
    arrows: [pass([BL[0], 79], [36, 86])],
  },
};
void COACH;
