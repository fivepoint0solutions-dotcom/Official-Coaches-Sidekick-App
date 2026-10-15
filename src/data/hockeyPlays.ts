import type { Drill } from "./drillLibrary";

// Real special-teams plays. Each has a written walkthrough; the diagrams are drawn in drillDiagrams5.ts on the same rink as every drill.
type Play = Omit<Drill, "sport">;
export const hockeyPlays: Play[] = [
  // ---------------- POWER PLAY ----------------
  {
    id: "PPP-001", name: "1-3-1 Power Play", category: "Power Play", duration: "12 min", ageGroup: "U13–U18", equipment: "Pucks, goalie", level: "intermediate",
    setup: "Attacking zone with a goalie. Five attackers in the 1-3-1 shape against four penalty killers in a box.",
    steps: [
      "Set the shape: one player at the point, three across the middle (left flank, bumper in the slot, right flank), one in front of the net.",
      "The point passes to a flank; the flank looks first for the bumper, then across to the opposite flank for a one-timer.",
      "The net-front player screens the goalie and fights for rebounds; the bumper slides to fill any open seam.",
      "Rotate positions every two minutes so every player learns every job."
    ],
    coachingPoints: ["The 1-3-1 stretches the box both ways: wide with the flanks, deep with the net-front.", "Move the puck on one touch; if it sits for two seconds the box has time to close.", "The bumper is the quarterback of the middle — always show a stick target."],
  },
  {
    id: "PPP-002", name: "Overload Power Play", category: "Power Play", duration: "12 min", ageGroup: "U13–U18", equipment: "Pucks, goalie", level: "intermediate",
    setup: "Attacking zone with a goalie. Put three attackers on the strong side against a box that has to shift to cover them.",
    steps: [
      "Load the strong side: one player in the corner, one on the half wall, one in the slot; a weak-side shooter at the far post and a point player up top.",
      "Cycle the puck low-to-high on the strong side to pull the box over.",
      "When the weak side opens, skip the puck across to the far-post shooter for a one-timer.",
      "Finish with a shot and two players driving to the net for the rebound."
    ],
    coachingPoints: ["The overload draws the box to one side; the weak-side pass is the payoff.", "Make the penalty killers chase — keep passes sharp and short until the cross-ice look appears.", "The far-post shooter stays patient and keeps the stick on the ice ready."],
  },
  {
    id: "PPP-003", name: "4-1 Spread Power Play", category: "Power Play", duration: "10 min", ageGroup: "U13–U18", equipment: "Pucks, goalie", level: "intermediate",
    setup: "Attacking zone with a goalie. Four players spread around the outside, one in front of the net.",
    steps: [
      "Spread two players at the points and two on the low circle tops; one attacker stays in front of the goalie.",
      "Move the puck around the horn; every touch should force a penalty killer to turn his head.",
      "Look for the shot with a screen, or a pass to the low player for a quick wrist shot.",
      "Attack rebounds with the low players crashing the net on every shot."
    ],
    coachingPoints: ["The spread is a patient shape — the goal is a clean shooting lane, not a rushed shot.", "The net-front player faces the shooter and stays out of the goalie's eyes only when the shot comes.", "Low players read the shot: crash if it is on net, hold if it is wide."],
  },
  {
    id: "PPP-004", name: "5-on-3 Triangle", category: "Power Play", duration: "10 min", ageGroup: "U13–U18", equipment: "Pucks, goalie", level: "advanced",
    setup: "Attacking zone with a goalie. Five attackers against three penalty killers.",
    steps: [
      "Place a point player on top, wall players on both half boards and two shooters low at the circles.",
      "Move the puck wall to wall to stretch the three killers across the zone.",
      "Use the seam pass across the slot to the low shooter on the opposite side.",
      "Shoot on the first clean look — with two extra attackers there is no need to pass up the chance."
    ],
    coachingPoints: ["With two extra players, the slot pass is always there — make the killers commit first.", "Shooters stay in their lanes; do not drift into the passer's path.", "Be ready for the rebound with two players hunting second chances."],
  },
  {
    id: "PPP-005", name: "Half-Wall Seam Play", category: "Power Play", duration: "10 min", ageGroup: "U13–U18", equipment: "Pucks, goalie", level: "intermediate",
    setup: "Attacking zone with a goalie. Half-wall passer, slot shooter, four passive penalty killers in a box.",
    steps: [
      "The half-wall player holds the puck and waits for the box to shift toward him.",
      "As the box leans, the slot player slides into the seam between the two killers.",
      "The half-wall player threads the pass through the seam to the slot player for a one-timer.",
      "Reset and repeat from the other half wall."
    ],
    coachingPoints: ["Patience wins this play — hold the puck until the seam is open.", "The slot player shows a stick target before the pass is made.", "Hit the shot before the box can reset; the one-timer is the whole point."],
  },
  {
    id: "PPP-006", name: "Bumper Slot Shot", category: "Power Play", duration: "8 min", ageGroup: "U13–U18", equipment: "Pucks, goalie", level: "beginner",
    setup: "Attacking zone with a goalie. Bumper in the slot, passers on both half walls, no penalty killers to start.",
    steps: [
      "The left half-wall player passes into the bumper in the slot.",
      "The bumper receives on his forehand and shoots in one motion.",
      "Repeat from the right half wall, then add two passive killers.",
      "Finish with live play: the killers try to take away the lane."
    ],
    coachingPoints: ["Receive the puck with the blade open, already aimed at the net.", "A quick release beats a perfect shot — the goalie needs to be moving.", "Passers lead the bumper with soft, flat passes."],
  },
  {
    id: "PPP-007", name: "Drop-Pass Power Play Entry", category: "Power Play", duration: "10 min", ageGroup: "U13–U18", equipment: "Pucks", level: "intermediate",
    setup: "Full ice. Power play unit in the neutral zone, four penalty killers waiting at the offensive blue line.",
    steps: [
      "The puck carrier skates up the wall at speed toward the blue line.",
      "Just before the line, he drops the puck back to a trailing teammate with speed.",
      "The trailer carries it across the blue line with the first player and two others lifting the penalty killers.",
      "Once in the zone, drop into your setup (1-3-1 or umbrella) immediately."
    ],
    coachingPoints: ["Speed through the neutral zone is the entry — do not slow down to set up.", "The drop pass must be soft and on the trailer's stick.", "Have a plan: if the killers take it away, the backup is a dump to the corner."],
  },
  {
    id: "PPP-008", name: "Offensive-Zone Faceoff Play", category: "Power Play", duration: "8 min", ageGroup: "U13–U18", equipment: "Pucks, goalie", level: "intermediate",
    setup: "Attacking zone with a goalie. Faceoff dot, centre and two defencemen at the points, two wingers.",
    steps: [
      "The centre wins the draw back to the point defenceman.",
      "The point shoots through traffic — or slides it across to the other point for the shot — while the second winger drives to the net.",
      "On a lost draw, the wingers pressure and the centre supports for the second puck.",
      "Rotate centres and run it from both dots."
    ],
    coachingPoints: ["Plan the draw before the puck drops: win it clean to a set spot.", "The shot is low and hard for tips and rebounds.", "Wingers know the lost-draw job before the whistle."],
  },

  // ---------------- PENALTY KILL ----------------
  {
    id: "PKP-001", name: "Box Penalty Kill", category: "Penalty Kill", duration: "12 min", ageGroup: "U13–U18", equipment: "Pucks, goalie", level: "beginner",
    setup: "Defensive zone with a goalie. Four penalty killers in a box against a five-player power play.",
    steps: [
      "Set the box: two killers high near the top of the circles, two low near the dots.",
      "Shift as a unit toward the puck while keeping sticks in the passing lanes.",
      "Take away the seam passes; force the power play to the outside for low-percentage shots.",
      "When the puck is cleared, change quickly and reset."
    ],
    coachingPoints: ["The box is a shape, not a position — it moves with the puck.", "Sticks on the ice, in the lanes, eyes on the puck and your man.", "Never chase out of the box unless the puck is in a clear pressure situation."],
  },
  {
    id: "PKP-002", name: "Diamond Penalty Kill", category: "Penalty Kill", duration: "12 min", ageGroup: "U13–U18", equipment: "Pucks, goalie", level: "intermediate",
    setup: "Defensive zone with a goalie. Four killers in a diamond: one high, two wide, one low.",
    steps: [
      "Place a forward at the top, two players at the wide points of the diamond, and one low in front of the net.",
      "The top player pressures the puck carrier and forces plays to the wall.",
      "The wide players take the half-wall options; the low player protects the slot.",
      "Rotate as the top player attacks so the diamond keeps its shape."
    ],
    coachingPoints: ["The diamond is built to pressure — the high player attacks smartly.", "Wide players stay inside the passing lanes to the point.", "The low player owns the crease and the slot."],
  },
  {
    id: "PKP-003", name: "Triangle-Plus-One Penalty Kill", category: "Penalty Kill", duration: "10 min", ageGroup: "U13–U18", equipment: "Pucks, goalie", level: "intermediate",
    setup: "Defensive zone with a goalie. Three killers form a triangle in front of the net; the fourth pressures.",
    steps: [
      "Three killers form a tight triangle protecting the front of the net.",
      "The fourth killer pressures the puck carrier at the points.",
      "The triangle slides with the puck to keep the shooter’s lanes closed.",
      "On a clear, the pressure player jumps out to start the transition."
    ],
    coachingPoints: ["The triangle stays tight — take away the middle of the ice first.", "The pressure player makes the carrier hurry but does not chase behind the play.", "Triangle players stay on the inside of their man."],
  },
  {
    id: "PKP-004", name: "Aggressive Pressure Penalty Kill", category: "Penalty Kill", duration: "10 min", ageGroup: "U15–U18", equipment: "Pucks, goalie", level: "advanced",
    setup: "Defensive zone with a goalie. Two forwards pressure high, two defencemen hold the net.",
    steps: [
      "Both forwards attack the puck carrier together, forcing quick decisions.",
      "The defencemen stay low and close the slot while the forwards harass.",
      "If a forward gets beaten, the nearest defenceman covers while the forward recovers.",
      "Clear the puck on the first turnover and transition up ice."
    ],
    coachingPoints: ["Pressure only works if the forwards go as a pair.", "Defencemen communicate loudly: “Mine” or “Releasing.”", "Know when to stop pressuring — if the puck is gone, retreat to your shape."],
  },
  {
    id: "PKP-005", name: "5-on-3 Triangle Penalty Kill", category: "Penalty Kill", duration: "10 min", ageGroup: "U13–U18", equipment: "Pucks, goalie", level: "advanced",
    setup: "Defensive zone with a goalie. Three killers against five attackers.",
    steps: [
      "Form a triangle with one killer high and two low on either side of the net.",
      "Protect the slot at all costs — let the attackers have the outside.",
      "Slide as a unit with the puck and stick in the passing lanes.",
      "Block shots with the body and sticks; clear any loose puck immediately."
    ],
    coachingPoints: ["The slot is the whole game; concede the perimeter.", "Stay on the inside of the attackers and keep the triangle tight.", "Clear without icing whenever possible — a break gives the next shift fresh legs."],
  },
  {
    id: "PKP-006", name: "Rim Clear Under Pressure", category: "Penalty Kill", duration: "8 min", ageGroup: "U13–U18", equipment: "Pucks", level: "intermediate",
    setup: "Defensive zone with pucks. One defenceman retrieves, one forechecker applies pressure.",
    steps: [
      "The defenceman retrieves the puck behind the net with the forechecker closing.",
      "He chooses the clear: rim it hard along the boards to the neutral zone.",
      "A winger picks it off the wall and sends it down ice.",
      "Reset and repeat from the other side."
    ],
    coachingPoints: ["Hard and flat on the glass — never up the middle.", "Make the decision before the forechecker arrives.", "Wingers support the wall so the clear is a pass, not a dump."],
  },
  {
    id: "PKP-007", name: "Shot-Block Lanes", category: "Penalty Kill", duration: "8 min", ageGroup: "U13–U18", equipment: "Pucks, goalie", level: "intermediate",
    setup: "Defensive zone with a goalie. Two blockers in the lanes, one point shooter, one tip player.",
    steps: [
      "The point shooter winds up; the first blocker takes the lane with chest and stick.",
      "The second blocker covers the second lane so the shot cannot find a seam.",
      "After the block, the closest killer collects the loose puck and clears.",
      "Rotate roles so everyone practices blocking and clearing."
    ],
    coachingPoints: ["Get big and square; sticks make a second wall.", "Never turn your back on a shot.", "Win the loose puck after the block — that is how the PK gets the whistle."],
  },
  {
    id: "PKP-008", name: "Defensive-Zone Faceoff Penalty Kill", category: "Penalty Kill", duration: "8 min", ageGroup: "U13–U18", equipment: "Pucks, goalie", level: "intermediate",
    setup: "Defensive zone with a goalie. Centre and four killers set up for a draw in your own zone.",
    steps: [
      "The centre and winger line up beside the dot, the other two killers behind them.",
      "On a win, draw the puck back to the defenceman who clears it up the wall.",
      "On a loss, the winger takes the point shooter and the others collapse to the slot.",
      "Repeat from both dots."
    ],
    coachingPoints: ["Plan A and plan B before the puck drops.", "The first clear after a win ends the sequence.", "On a loss, take away the one-timer first."],
  },
];
