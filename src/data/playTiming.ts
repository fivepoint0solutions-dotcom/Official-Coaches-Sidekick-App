/* Animation timing for the power-play and penalty-kill plays: one number per arrow (in the order the arrows are listed in the diagram).
   Arrows with the same number happen together; the next number starts when the one before it has finished.
   Plays that are not listed here play their passes one after another with every skater moving first. */
export const playSteps: Record<string, number[]> = {
  "PPP-007": [0, 1, 2, 0], // carry wide · drop it back · pass up the wall while the left winger skates off
  "PPP-008": [0, 1, 2, 1, 1], // win the draw · cross to the other D while the wingers go to the net · shot
  "PKP-001": [0, 1, 0, 1], // the box shifts with the puck
  "PKP-002": [0, 1, 1], // diamond: top man steps up, then the wing pressures as the puck moves
  "PKP-006": [0, 1, 2], // forechecker pressures · D rims it · the winger takes it up the boards
  "PKP-007": [0, 0, 0], // pass to the point while both blockers slide into the lane
};
