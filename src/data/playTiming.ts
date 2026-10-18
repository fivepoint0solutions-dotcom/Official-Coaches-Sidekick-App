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
  // Shooting: carry in, coach feeds, shot, then the rebound drive.
  "SHT-002": [0, 1, 2, 3],
  // Shooting: pass, shot, then skate to the net for the rebound.
  "SHT-004": [0, 1, 2],
  "SHT-005": [0, 1, 2],
  "SHT-006": [0, 1, 2],
  "SHT-007": [0, 1, 2],
  // Shooting: feed, shot, sprint to the corner and back.
  "SHT-010": [0, 1, 2, 3],
  // Passing: all five pairs pass at the same time.
  "PAS-001": [0, 0, 0, 0, 0],
  "PAS-002": [0, 0, 0, 0, 0],
  // Passing: skate together, exchange at the red line; the receiver keeps skating and the pass leads him.
  "PAS-003": [0, 0, 1, 1],
  // Passing: give, return + sprint in stride, drive to the net, shot.
  "PAS-004": [0, 1, 1, 2, 2],
  // Passing: both pairs bank at once; the receiver skates with the pass.
  "PAS-005": [0, 0, 0],
  // Passing: both pairs saucer out together, both return together.
  "PAS-006": [0, 1, 0, 1],
  // Passing: D-to-D, D-to-D again, then the shot.
  "PAS-007": [0, 1, 2],
  // Passing: D to winger, stretch pass, forward attacks, shot.
  "PAS-008": [0, 1, 2, 3],
  // Battle: dump and both races together, then the winner's return pass.
  "BDC-006": [0, 0, 0, 1],
  // Battle: shot and crash together, then the clear.
  "BDC-007": [0, 0, 1],
  // Defence: pass to the winger, then the carry-out and the support swing.
  "DFZ-002": [0, 1, 1],
  // Defence: carry behind the net, reverse, D-to-winger, winger carries out; forechecker presses with the carry.
  "DFZ-003": [0, 1, 2, 3, 0],
  // Defence: dump arrives, then the wheel, then the pass up.
  "DFZ-004": [0, 1, 2],
  // Defence: backcheckers start behind the rush, before the shot.
  "DFZ-006": [0, 1, 2, 1, 1],
  // Power play: killers shift as a unit tracking the puck around the perimeter.
  "PKL-001": [0, 2, 3, 1, 1],
  // Penalty kill: draw win first, then everyone sprints to the structure.
  "PKL-006": [0, 1],
  // Faceoffs: win back, D one-touches, winger breaks.
  "FOF-005": [0, 1, 2],
  // Goaltending: wrap carry, goalie push + feed together, then the one-timer.
  "GLT-007": [0, 1, 1, 2],
  // Small-area games: both zones play at the same time.
  "SAG-001": [0, 0],
  "SAG-002": [0, 0],
  // Small-area games: dump first, then both attackers race together.
  "SAG-005": [0, 1, 1],
  // Small-area games: ongoing game, no sequence.
  "SAG-008": [0, 0],
  // Small-area games: keepaway passes in order; defender pressures during the first pass.
  "SAG-010": [1, 2, 3, 1],
  // Conditioning: dump left, pair races, return; dump right, pair races, return.
  "CND-003": [0, 1, 1, 2, 3, 4, 4, 5],
  // Warmup: approaches together, exchange, then continue; other pair approaches together.
  "WRM-003": [0, 0, 1, 2, 0, 0],
  // Warmup: skate back, receive, carry around the cone, shoot.
  "WRM-005": [0, 1, 2, 3],
  // Warmup: three passes in order, second corner skates down, shot.
  "WRM-006": [0, 1, 2, 3, 4],
  // Power play: carry wide, drop it back, trailer carries across while the LW lifts the killer.
  "PPP-007": [0, 1, 2, 2],
  "PPP-008": [0, 1, 2, 1, 1], // win the draw · cross to the other D while the wingers go to the net · shot
  "PKP-001": [0, 1, 0, 1], // the box shifts with the puck
  "PKP-002": [0, 1, 1], // diamond: top man steps up, then the wing pressures as the puck moves
  "PKP-006": [0, 1, 2], // forechecker pressures · D rims it · the winger takes it up the boards
  "PKP-007": [0, 0, 0, 1], // pass to the point while both blockers slide into the lane, then the clear
};
