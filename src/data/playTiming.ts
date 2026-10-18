/* Animation timing: one number per arrow (in the order the arrows are listed in the diagram).
   Arrows with the same number happen together; the next number starts when the one before it has finished.
   Drills not listed here play their passes one after another with every skater moving first.
   A marker waits between its own arrow legs until the next leg's step, so a hold is a later step. */
export const playSteps: Record<string, number[]> = {
  // Skating: second leg waits out the two-second hold, then goes.
  "SKT-003": [0, 1, 0, 1],
  // Skating: return leg only after the stop and turn.
  "SKT-005": [0, 0, 1, 1],
  // Shooting: all five pairs shoot at the same time, not one after another.
  "SHT-001": [0, 0, 0, 0, 0],
  "SHT-007": [0, 1, 2],
  // Passing: all five pairs pass at the same time.
  "PAS-001": [0, 0, 0, 0, 0],
  "PAS-002": [0, 0, 0, 0, 0],
  // Passing: skate together, exchange at the red line; both keep skating to the far line and the pass leads the receiver.
  "PAS-003": [0, 0, 1, 1, 1],
  // Passing: both pairs bank at once; the receiver skates with the pass.
  "PAS-005": [0, 0, 0],
  // Passing: both pairs saucer out together, both return together.
  "PAS-006": [0, 1, 0, 1],
  // Passing: D-to-D, D-to-D again, then the shot.
  "PAS-007": [0, 1, 2],
  // Defence: dump arrives, then the wheel, then the pass up.
  "DFZ-004": [0, 1, 2],
  // Power play: killers shift as a unit tracking the puck around the perimeter.
  "PKL-001": [0, 2, 3, 1, 1],
  // Penalty kill: draw win first, then everyone sprints to the structure.
  "PKL-006": [0, 1],
  // Small-area games: both zones play at the same time.
  "SAG-001": [0, 0],
  "SAG-002": [0, 0],
  // Small-area games: ongoing game, no sequence.
  "SAG-008": [0, 0],
  // Small-area games: keepaway passes in order; defender pressures during the first pass.
  "SAG-010": [1, 2, 3, 1],
  "PPP-008": [0, 1, 2, 1, 1], // win the draw · cross to the other D while the wingers go to the net · shot
  "PKP-001": [0, 1, 0, 1], // the box shifts with the puck
  "PKP-002": [0, 1, 1], // diamond: top man steps up, then the wing pressures as the puck moves
  "PKP-006": [0, 1, 2], // forechecker pressures · D rims it · the winger takes it up the boards
  "PKP-007": [0, 0, 0, 1], // pass to the point while both blockers slide into the lane, then the clear
  // ---- timing reviewed against each drill's written directions (a fraction starts something part-way into a step; a receiver who skates away takes the pass in stride) ----
  // Russian circles: end-zone circle, then the centre circle, then the far circle, one after the other.
  "SKT-008": [0, 1, 2, 3, 4],
  // Speed carry: sprint the length, then back.
  "PHL-008": [0, 1],
  // Pinning: the defender follows two strides behind the carrier.
  "BDC-003": [0, 0.35, 0, 0.35],
  // Corner battle: the racers go as the puck is dumped; the winner's pass to the coach comes after they get possession.
  "BDC-006": [0, 0.4, 0.4, 1.6],
  // Box out: the forward crashes just after the point shot; the D clears after the battle.
  "BDC-007": [0, 0.3, 1.4],
  // Strong-side breakout: the winger carries in stride with the pass and the centre swings low with it.
  "DFZ-002": [0, 0, 0],
  // Reverse: carry behind the net, reverse to the partner D, D-to-winger, the winger carries out in stride; the forechecker presses with the carry.
  "DFZ-003": [0, 1, 2, 2, 0],
  // Backcheck: 2-on-0 rush (the second forward rushes alongside and takes the pass in stride); the backcheckers start three seconds behind the rush.
  "DFZ-006": [0, 1, 2, 1.76, 1.76, 0, 1],
  // Sweep shot on the move: the coach slides a puck into his path, he shoots in stride then carries on to the net.
  "SHT-002": [0, 1, 1.4, 1],
  // Catch and release: the shot comes the moment the pass arrives; the rebound drive after the shot.
  "SHT-004": [0, 0.9, 1.9],
  // One-timers: he times the pass and fires as it arrives, then follows the shot to the net.
  "SHT-005": [0, 0.9, 1.9],
  // Shooting in stride: the shot is released while skating, then the drive to the net.
  "SHT-006": [0, 0.75, 1],
  // Tips: the tip is one touch as the shot arrives.
  "SHT-008": [0, 0.9],
  // Quick release: fire within a second of receiving, then sprint to the corner and back.
  "SHT-010": [0, 0.9, 1.9, 2.9],
  // 2-on-0 give-and-go: both skate in, give at centre, the first player goes and takes the return pass in stride, shot, both drive the net.
  "OFZ-008": [0, 0, 1, 2, 3, 2, 3],
  // PP entry: carry-in wide, drop pass, then the stretch pass to the winger breaking up the ice in stride.
  "PPL-002": [0, 1, 2, 2],
  // Clear under pressure: the two clear options (up the boards, skate it out) happen together.
  "PKL-005": [0, 0],
  // Draw win-back: the D one-touches it up the boards as soon as it arrives.
  "FOF-002": [0, 0.85],
  // Set play off the draw: win back, the D one-touches to the winger who breaks in stride.
  "FOF-005": [0, 0.9, 0.9],
  // Crease shuffles: left, then back right, then the shot.
  "GLT-001": [0, 1, 2],
  // T-push: the goalie pushes across as the coach's pass goes across; the shot comes once he is set.
  "GLT-003": [0, 0, 1],
  // Breakaway: the goalie matches the shooter's pace backward while he comes in; the shot comes at the end.
  "GLT-006": [0, 1, 0],
  // Wraparound: the goalie tracks the puck behind the net and pushes across as the shooter wraps, then the pass and the one-timer.
  "GLT-007": [0, 0.6, 1.5, 2.5],
  // Corner battle: the racers go just after the dump.
  "SAG-005": [0, 0.4, 0.4],
  // Puck chase: the pair races as the puck is dumped; the winner passes back to the coach; then the other corner.
  "CND-003": [0, 0.4, 0.4, 2, 3, 3.4, 3.4, 5],
  // Two-line passing: skate together, exchange at the red line, both keep going to the far line in stride.
  "WRM-003": [0, 0, 1, 1, 0, 0, 1],
  // Horseshoe: he receives the pass and opens up forward in stride, drives around the cone, then shoots.
  "WRM-005": [0, 1, 1, 2],
  // 3-pass flow: the far-corner player skates the pass down the wing in stride, then shoots.
  "WRM-006": [0, 1, 2, 2, 3],
  // Drop-pass entry: the trailer takes the drop pass in stride and carries across the line; the others lift the killers.
  "PPP-007": [0, 1, 1, 1],
  // Give and go: carry to the coach, the coach's return pass leads him as he sprints past, drive, then the shot as he arrives.
  "PAS-004": [0, 1, 1, 2, 2.8],
  // Stretch pass: the winger one-touches it and the forward breaks as it is sent; shot when he arrives.
  "PAS-008": [0, 0.9, 0.9, 1.9],
};
