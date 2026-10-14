import type { DrillDiagramSpec } from "@/components/drills/DrillDiagram";
import { rinkSpec } from "./drillDiagrams";
import { theoryDiagrams } from "./theoryDiagrams";
import type { DrillCategory } from "./drillLibrary";

export type TheoryDiagram = { title: string; caption: string; diagram: DrillDiagramSpec };
export type CategoryTheory = {
  tagline: string;
  summary: string[];
  keyIdeas: string[];
  whyItMatters: string;
  diagrams: TheoryDiagram[];
};

export const categoryTheory: Record<DrillCategory, CategoryTheory> = {
  "Power Play": {
    tagline: "Playing with an extra skater",
    summary: [
      "A power play starts when the other team takes a penalty. You get an extra skater (5-on-4, or 5-on-3 if there are two penalties) until the penalty ends or you score on a minor.",
      "The job is simple to say and hard to do: move the puck faster than the penalty killers can move their feet, until someone gets a clean shot or a shot with a screen in front.",
    ],
    keyIdeas: [
      "Shape first: the 1-3-1, the umbrella and the overload are all ways to stretch four killers.",
      "One-touch puck movement: if the puck sits, the box closes.",
      "Shooters need lanes; a net-front player needs to be a screen, not a target.",
      "Every shot is followed by a rebound plan.",
      "A clean entry matters as much as the setup: win the blue line first.",
    ],
    whyItMatters: "Power plays decide close games. A team that scores on one in five power plays wins far more often than a team that does not, and the habits you build here (patience, puck movement, picking a shot) carry into five-on-five play.",
    diagrams: [
      { title: "The 1-3-1", caption: "One at the point, three across the middle, one in front. It stretches the box wide and deep.", diagram: rinkSpec(theoryDiagrams["The 1-3-1"]!) },
      { title: "The overload", caption: "Three on the strong side pull the box over; the weak side opens for the one-timer.", diagram: rinkSpec(theoryDiagrams["The overload"]!) },
      { title: "Getting in", caption: "A drop pass at speed beats a standing box: carry, drop, and attack the line together.", diagram: rinkSpec(theoryDiagrams["Getting in"]!) },
    ],
  },
  "Penalty Kill": {
    tagline: "Defending a man short",
    summary: [
      "A penalty kill is when your team has a player in the penalty box and has to defend with fewer players, usually four against five.",
      "The goal is not to look good. It is to take away the middle of the ice, force the other team to the outside, and clear the puck at the first chance.",
    ],
    keyIdeas: [
      "Shape: the box, the diamond and the triangle are all ways to protect the slot.",
      "Stay inside: let them have the outside and keep the middle clean.",
      "Sticks in lanes, eyes on the puck and your man.",
      "Block shots with your body and your stick, and win the loose puck.",
      "Clear it and change: a good clear is a win.",
    ],
    whyItMatters: "A strong penalty kill takes the other team's best advantage away and often swings momentum. Killing a penalty gives the whole bench a lift, and the habits (gap control, communication, shot blocking) make you better at five-on-five.",
    diagrams: [
      { title: "The box", caption: "Two high, two low. The box shifts as one toward the puck and keeps the slot closed.", diagram: rinkSpec(theoryDiagrams["The box"]!) },
      { title: "The diamond", caption: "One high player pressures the puck while the others protect the slot.", diagram: rinkSpec(theoryDiagrams["The diamond"]!) },
      { title: "The clear", caption: "Hard and flat around the boards, never up the middle.", diagram: rinkSpec(theoryDiagrams["The clear"]!) },
    ],
  },
  Offense: {
    tagline: "Creating and finishing chances",
    summary: [
      "Offense is how a team turns possession into quality chances: entering the zone with control, moving without the puck, and getting to the net.",
      "Good offense is a few simple habits repeated: support the puck carrier, use the width of the ice, and attack the net with speed and numbers.",
    ],
    keyIdeas: ["Enter with control, then support.", "Use the whole width: wide players pull defenders apart.", "Cycle low to wear a defender down.", "Always get a body to the net.", "Shoot with purpose; a rebound is a second chance."],
    whyItMatters: "Teams score from structure, not luck. A clear offensive plan means players know where to be even when the play changes.",
    diagrams: [{ title: "3-on-2 rush", caption: "Three attackers use width and one drives the net against two defenders.", diagram: rinkSpec(theoryDiagrams["3-on-2 rush"]!) }],
  },
  Defense: {
    tagline: "Winning the puck back",
    summary: [
      "Defense is more than blocking shots. It is closing space, taking time away, and getting the puck back and moving the other way.",
      "A good defender controls the gap: close enough to take away time, far enough to avoid being beaten.",
    ],
    keyIdeas: ["Gap control: stay a stick-length ahead of the attacker.", "Take the inside lane away first.", "Stick on the ice, body between the man and the net.", "Talk early and often.", "Win the puck, then move it quickly."],
    whyItMatters: "Most games are decided by who wins the puck battles in their own end. Strong defensive habits keep chances low and give your offence the puck more often.",
    diagrams: [{ title: "Gap and angle", caption: "The defender keeps the gap tight and steers the attacker to the boards.", diagram: rinkSpec(theoryDiagrams["Gap and angle"]!) }],
  },
  Shooting: {
    tagline: "Getting the puck on net",
    summary: [
      "Shooting is a mix of technique and timing: a quick release, a clear target, and a goalie who is moving or screened.",
      "The best shooters pick a spot, shoot early, and follow every shot to the net for the rebound.",
    ],
    keyIdeas: ["Weight transfer: push from the back foot through the puck.", "Quick release beats a perfect windup.", "Pick a corner before you shoot.", "Shoot through traffic; a screen is a weapon.", "Follow the shot."],
    whyItMatters: "A shot is only a chance if it is on net. Players who shoot with intent create the rebounds and tips that win games.",
    diagrams: [{ title: "Shot lanes", caption: "Shoot through the lanes between defenders, with a screen in front of the goalie.", diagram: rinkSpec(theoryDiagrams["Shot lanes"]!) }],
  },
  Passing: {
    tagline: "Moving the puck with purpose",
    summary: [
      "Passing is how a team moves faster than a skater. A good pass is flat, on the stick, and gives the receiver time to make the next play.",
      "Great passers look first, pass early, and always move after the pass.",
    ],
    keyIdeas: ["Pass to the stick, not the body.", "Receive with soft hands and the blade open.", "Lead the receiver into open ice.", "Pass and move: give-and-go.", "Use the boards and the seam."],
    whyItMatters: "Teams that pass well keep the puck and tire out their opponent. Passing is the base of every power play and every breakout.",
    diagrams: [{ title: "Give and go", caption: "Pass, then skate into the open lane to take the return pass.", diagram: rinkSpec(theoryDiagrams["Give and go"]!) }],
  },
  Skating: {
    tagline: "The foundation of everything",
    summary: [
      "Skating is the base skill in hockey. Edges, balance and a strong stride let every other skill happen at speed.",
      "Good skating is low, balanced and quiet on top: bent knees, a full push, and a recovery that is quick.",
    ],
    keyIdeas: ["Knees bent, chest up, head up.", "Push to the side, not just back.", "Use inside and outside edges.", "Crossovers for speed and turns.", "Stops and starts: quick feet win races."],
    whyItMatters: "A player who skates well has more time and more options. Skating improves every other part of your game.",
    diagrams: [{ title: "Edge work", caption: "Weave through cones to build edge control and tight turns.", diagram: rinkSpec(theoryDiagrams["Edge work"]!) }],
  },
  Goaltending: {
    tagline: "The last line of defence",
    summary: [
      "Goaltending is a position of its own: angles, positioning, tracking the puck and recovering for the next shot.",
      "A good goalie plays the angle, stays square to the puck, and stays calm after a goal against.",
    ],
    keyIdeas: ["Stay square and on the angle.", "Track the puck with your eyes and your chest.", "T-push and shuffle to move post to post.", "Control rebounds, and cover when you can.", "Reset your feet after every save."],
    whyItMatters: "Goalies see more shots than anyone. A consistent goalie gives the whole team confidence.",
    diagrams: [{ title: "Playing the angle", caption: "The goalie moves out from the net and stays on the line between the puck and the middle of the net.", diagram: rinkSpec(theoryDiagrams["Playing the angle"]!) }],
  },
  "Conditioning & Games": {
    tagline: "Fitness with a puck",
    summary: [
      "Conditioning builds the legs and lungs. Games make that work fun and teach small-area decisions.",
      "The best practices mix both: short, hard bursts with the puck, then a small game that rewards what you just worked on.",
    ],
    keyIdeas: ["Warm up with purpose.", "Short, hard intervals beat long, slow ones.", "Small-area games teach decisions.", "Keep the score close.", "Finish with a cool-down."],
    whyItMatters: "Players who are fit make better decisions in the third period. Small games keep young players engaged while they learn.",
    diagrams: [{ title: "Small-area game", caption: "3-on-3 in a tight space with two nets, built for quick touches and fast decisions.", diagram: rinkSpec(theoryDiagrams["Small-area game"]!) }],
  },
};
