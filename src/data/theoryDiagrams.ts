import { CONE, D, G, P, PUCK, carry, pass, run, type Diagram } from "./diagramKit";
import { drillDiagrams } from "./drillDiagrams";

/** The small teaching diagrams in each category's Theory tab, drawn on the same rink. Several reuse a drill's diagram. */
export const theoryDiagrams: Record<string, Diagram> = {
  "The 1-3-1": drillDiagrams["PPP-001"]!,
  "The overload": drillDiagrams["PPP-002"]!,
  "Getting in": drillDiagrams["PPP-007"]!,
  "The box": drillDiagrams["PKP-001"]!,
  "The diamond": drillDiagrams["PKP-002"]!,
  "The clear": drillDiagrams["PKP-006"]!,
  "3-on-2 rush": drillDiagrams["OFZ-003"]!,
  "Gap and angle": { // the defender keeps the gap tight and steers the attacker to the boards
    markers: [G(50, 91.5), P(58, 50), PUCK(59.8, 50.6), D(52, 66), D(50, 80)],
    arrows: [carry([58, 53], [78, 66]), run([52, 64], [66, 70])],
  },
  "Shot lanes": { // shoot through the lane between the defenders, with a screen in front of the goalie
    markers: [G(), P(50, 34), PUCK(51.8, 34.6), D(40, 26), D(60, 26), P(50, 14)],
    arrows: [pass([50, 32], [50, 11])],
  },
  "Give and go": { // pass, then skate into the open lane for the return pass
    markers: [P(36, 48, "1"), P(62, 38, "2"), D(50, 44), PUCK(37.8, 48.6)],
    arrows: [pass([38, 47], [60, 39]), run([36, 46], [54, 30], [[44, 36]]), pass([61, 37], [54, 31])],
  },
  "Edge work": drillDiagrams["SKT-009"]!,
  "Playing the angle": { // the goalie stays in the crease on the line between the puck and the middle of the net
    markers: [G(46, 9.5), P(30, 24), PUCK(31.8, 24.6)],
    arrows: [pass([32, 23], [48, 10]), run([50, 8.6], [46, 9.6])],
  },
  "Small-area game": drillDiagrams["SAG-001"]!,
};
void CONE;
