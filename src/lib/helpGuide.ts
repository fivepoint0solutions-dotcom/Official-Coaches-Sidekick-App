/* Coach's Sidekick: the step-by-step help guide shown on /help.
   Each topic has a short intro, numbered steps, optional tips and an optional shortcut that
   takes the person to the screen being explained. */

import type { DiagramSpec } from "@/components/help/HelpDiagram";

export type GuideLink = { to: "/" | "/drills" | "/drills/new" | "/lessons" | "/ideas" | "/materials" | "/create"; label: string };

export type GuideTopic = {
  id: string;
  title: string;
  intro: string;
  diagram?: DiagramSpec;
  steps: string[];
  tips?: string[];
  go?: GuideLink;
};

export type GuideGroup = { id: string; title: string; topics: GuideTopic[] };

export const GUIDE_GROUPS: GuideGroup[] = [
  {
    id: "around",
    title: "Finding your way around",
    topics: [
      {
        id: "top-bar",
        title: "The bar at the top of every screen",
        intro: "The same bar sits at the top of every page, so you always know where to tap.",
        diagram: { kind: "top-bar", noDots: true, notes: [["Logo and name", "Tap to go back to the Dashboard"], ["Three lines", "Opens the menu"]] },
        steps: [
          "Tap the logo and \"Coach's Sidekick\" on the left to jump back to the Dashboard from anywhere.",
          "To change the language, open Help and scroll to Settings: English, Español, Français or हिन्दी.",
          "Tap the round button with three lines on the right to open the menu.",
        ],
        tips: ["Scroll down and the bar slides out of the way so you can see more. Scroll up a little and it slides back."],
        go: { to: "/", label: "Go to the Dashboard" },
      },
      {
        id: "menu",
        title: "The menu (three lines)",
        intro: "The menu lists every page of the app. It floats over the screen and closes by itself.",
        diagram: { kind: "menu", items: ["Drill Library", "My Practices", "My Ideas", "Team Materials", "Help"], highlight: "Help" },
        steps: [
          "Tap the round button with three lines in the top right corner.",
          "A list of buttons appears: Drill Library, My Practices, My Ideas, Team Materials and Help.",
          "Tap the one you want and you are taken there.",
          "To close the menu without choosing, tap the X where the three lines were.",
        ],
        tips: ["The page you are on has a white outline in the list. The Dashboard is the logo at the top left."],
      },
      {
        id: "computer",
        title: "On a computer",
        intro: "On a bigger screen the pages are listed down the left side, so you do not need the menu.",
        diagram: { kind: "sidebar", items: ["Dashboard", "Drill Library", "My Practices", "My Ideas", "Team Materials"] },
        steps: [
          "Look at the panel on the left: Dashboard, Drill Library, My Practices, My Ideas and Team Materials.",
          "Click the page you want. The one you are on is highlighted.",
          "Help is in the menu at the top right (the three lines).",
        ],
      },
      {
        id: "swipe",
        title: "Swiping from page to page (phones)",
        intro: "You can move between the main pages with your finger instead of the menu.",
        diagram: { kind: "swipe", pages: ["Dashboard", "Drill Library", "My Practices", "My Ideas", "Team Materials"] },
        steps: [
          "Swipe from right to left to go to the next page. Swipe from left to right to go to the previous one.",
          "The pages are in this order: Dashboard, Drill Library, My Practices, My Ideas, Team Materials.",
                  ],
        tips: [
          "Swiping is ignored when your finger starts on a button, a text box, or a row that scrolls sideways (like the category tabs in the Drill Library). That is on purpose, so you never change page by accident.",
        ],
      },
      {
        id: "floating",
        title: "The floating buttons",
        intro: "The feedback whistle floats over every page, just above the beta banner, so it is always within reach.",
        diagram: { kind: "floating", left: ["Whistle:", "send feedback"], right: ["Chevron:", "hide the banner"] },
        steps: [
          "Bottom left: the whistle. Tap it to send feedback to the team that built the app.",
          "The voice / chat button is switched off. To turn it on, open Help, then Settings, and tick \"Show the voice / chat button\".",
        ],
      },
    ],
  },
  {
    id: "plan",
    title: "Planning with the four modes",
    topics: [
      {
        id: "dashboard",
        title: "The Dashboard: where every plan starts",
        intro: "The Dashboard greets you and shows everything you can start.",
        steps: [
          "Tap the logo to open the Dashboard.",
          "Tap one of the big cards: Draw Up Plays, Build a Practice, Handle the Busywork, Scout Me or the Drill Library. Each one opens its own page.",
          "Under the cards, Recent work shows what you saved most recently. Tap See all to open the full list.",
        ],
        go: { to: "/", label: "Go to the Dashboard" },
      },
      {
        id: "modes",
        title: "Which mode should I pick?",
        intro: "The four modes are four different kinds of help. You are in charge of every decision in all of them.",
        diagram: { kind: "modes", modes: [{ t: "Draw Up Plays", d: ["Ideas and angles,", "not a finished plan"] }, { t: "Build a Practice", d: ["Shape a practice", "step by step"] }, { t: "Handle the Busywork", d: ["Drill sheets, reports,", "rubrics, messages"] }, { t: "Scout Me", d: ["A second opinion", "on your plan"] }] },
        steps: [
          "Draw Up Plays: draw a play on the rink, bring in one you already have on your phone, or type your own. It is your play book and it never turns into a practice.",
          "Build a Practice: open a category, add drills from the drill library, read the theory, then build your practice with the full drills in it.",
          "Handle the Busywork: you get finished material fast, such as a drill sheet, scouting report, rubric or team message.",
          "Scout Me: you describe a play or game plan you already have and get a second opinion that points out weak spots and offers alternatives. It never gives a verdict.",
        ],
      },
      {
        id: "inspire",
        title: "Draw Up Plays: your play book",
        intro: "A place of its own for the plays you draw, photograph or type in.",
        steps: [
          "On the Dashboard, tap Draw Up Plays.",
          "Tap Draw a new play, name it, and draw it on the rink: drop players and cones, draw skating and passing lines.",
          "Or just type the play in as notes. You can upload a picture of one too. Tap Save play.",
          "Your plays are listed under My plays. Tap Edit to change one or the bin to delete it.",
        ],
        tips: ["Plays stay in Draw Up Plays. They are never pulled into a practice unless you add a drill yourself."],
      },
      {
        id: "build",
        title: "Build a Practice: pick drills, then build",
        intro: "Start from the drills, not from a questionnaire.",
        steps: [
          "On the Dashboard, tap Build a Practice.",
          "The drill inventory is stacked by category: Power Play, Penalty Kill, Offense, Defense, Shooting, Passing, Skating, Goaltending and Conditioning & Games. Tap a category to open it.",
          "Inside a category, Drills shows every drill with its diagram. Tap Add to practice on the ones you want, or See the whole drill to read it first.",
          "Theory is the short version of that category: what to teach and why, with diagrams.",
          "When you have your drills, tap Build my practice. Every drill appears in full: setup, steps, coaching points and diagram. Reorder or remove drills, then tap Save or Print.",
          "Need one that is not in the library? Tap Open a drill to pick one from the library, or Upload a drill to bring in your own. Both are at the top of every planning page.",
        ],
      },
      {
        id: "busywork",
        title: "Handle the Busywork: finished materials fast",
        intro: "For the paperwork you would rather not write.",
        steps: [
          "On the Dashboard, tap Handle the Busywork.",
          "Under \"What do you need?\", pick the type: Drill Sheet, Scouting Report, Evaluation Rubric, Team Message and so on.",
          "Fill in the few questions that appear. For a Team Message you choose who it is for and the tone.",
          "Tap Handle the Busywork. The finished material appears, ready to edit and save.",
        ],
      },
      {
        id: "challenge",
        title: "Scout Me: a second opinion",
        intro: "Use this when you already have a plan and want it pressure-tested.",
        steps: [
          "On the Dashboard, tap Scout Me.",
          "Under \"What would you like a second opinion on?\", type or paste a play, a practice plan or your strategy.",
          "Tap Challenge This Idea.",
          "Read the feedback. It is grouped as What's working, Worth a second look, Questions to sit with and Other ways in.",
          "Tap Challenge it again for another pass, or Help me improve this to rewrite the plan with the feedback built in.",
        ],
        tips: ["It is one perspective, not a verdict. You know your team best. Take what is useful and leave the rest."],
      },
      {
        id: "quick",
        title: "Quick buttons to improve a draft",
        intro: "A row of quick buttons sits under a draft so you can keep improving it without retyping anything.",
        steps: [
          "Give me 3 approaches: shows three different ways to do the same thing.",
          "Make this more creative, Make this simpler, Make this more challenging: change the level in one tap.",
          "Try a completely different approach: starts over from a new angle.",
          "Help me improve this: tightens up what you have.",
          "Take care of the boring parts: fills in the routine details for you.",
        ],
      },
    ],
  },
  {
    id: "saved",
    title: "Your saved work",
    topics: [
      {
        id: "saving",
        title: "Saving and finding your work",
        intro: "Anything you approve and save is kept for you, sorted by what it is.",
        steps: [
          "Tap Approve & Save on a draft. A message confirms it was saved to your library.",
          "Practice plans and drills go to My Practices.",
          "Brainstorms go to My Ideas.",
          "Drill sheets, scouting reports, rubrics, team messages and other items go to Team Materials.",
          "Open the menu (or the left panel on a computer) and pick the page. The Dashboard also shows your latest work under Recent work.",
          "Tap Open on a card to carry on editing it. Tap Delete to remove it. You are asked to confirm first.",
        ],
        tips: ["Your library is saved on this device, in this browser. Clearing the browser's data removes it."],
        go: { to: "/lessons", label: "Open My Practices" },
      },
    ],
  },
  {
    id: "drills",
    title: "The Drill Library and your own drills",
    topics: [
      {
        id: "browse",
        title: "Browsing the Drill Library",
        intro: "A collection of ready-made hockey drills, plus any you add yourself.",
        steps: [
          "Open the menu and tap Drill Library.",
          "Type in the search box to find a drill by name, skill or equipment.",
          "Once you have added your own drills, a My drills only button appears. Tap it to see just yours.",
          "Tap any drill to open it.",
        ],
        go: { to: "/drills", label: "Open the Drill Library" },
      },
      {
        id: "drill-page",
        title: "Inside a drill",
        intro: "Each drill has everything you need to run it.",
        steps: [
          "At the top you see the category, the drill name, how long it takes and the age group.",
          "Diagram shows how the drill looks on the rink.",
          "Equipment and Setup tell you what to bring and how to lay it out.",
          "Step-by-step instructions are numbered. Coaching points are the cues to give your players.",
          "Tap Add to practice to put this drill in your practice, then open Build a Practice and tap Build my practice.",
        ],
      },
      {
        id: "add-drill",
        title: "Making your own drill",
        intro: "Add your own drills and they sit right alongside the built-in ones.",
        diagram: { kind: "drill-form" },
        steps: [
          "Open the Drill Library and tap Add a drill.",
          "Fill in Category, Drill name, Age group, Duration, Equipment and Setup. For example Offense, 2-on-1 Rush, U10+, 15-20 min, Cones and 1 puck per player.",
          "Under Step-by-step instructions, type the first step. Tap Add for the next one, and repeat until the drill is described. At least one step is needed.",
          "Under Coaching points, type a cue you would give your players. Tap Add for more.",
          "To include a picture, tap Draw a diagram (see \"Drawing a diagram\").",
          "Tap Save drill. Your drill opens and is now in the library.",
        ],
        tips: ["Your drills are saved on this device. Use the My drills only button to see just yours."],
        go: { to: "/drills/new", label: "Add a drill now" },
      },
      {
        id: "upload-drills",
        title: "Uploading and downloading drills",
        intro: "Bring in drills you already have, or take yours with you. Files are read on your device and are never uploaded anywhere.",
        steps: [
          "Open the Drill Library and find the box called Upload or download drills.",
          "To add drills you already have, tap Upload a file.",
          "A spreadsheet (.csv) or a drill file you downloaded here: you see a list of the drills found. Tap Add them all to my library.",
          "A PDF, a Word file, a photo of a drill sheet or a notes file: it opens as a first draft in the Add a drill form. Fix anything that is off, then tap Save drill.",
          "To fill in a spreadsheet yourself, tap Blank template, open it in Excel or Google Sheets, type one drill per row, save it as .csv, and upload it.",
          "To take your drills with you, tap My drills (file) to download a file you can add back later or share with another coach, or My drills (spreadsheet) for Excel.",
        ],
        tips: [
          "Put | between steps and between coaching points in a spreadsheet cell, for example: Pass around the outside | Win the ball.",
          "Photos and scanned PDFs are read with text recognition the first time you use them. That can take a minute. A clear, flat photo works best.",
          "Only your own drills are in the downloads. The built-in library drills are not included.",
        ],
        go: { to: "/drills", label: "Open the Drill Library" },
      },
      {
        id: "diagram",
        title: "Drawing a diagram",
        intro: "A simple board lets you sketch the drill with players, cones and arrows.",
        diagram: { kind: "drill-board" },
        steps: [
          "In the drill form, tap Draw a diagram. A board appears.",
          "Tap a marker tool (Player, Defender, Goalie, Cone, Puck or Coach), then tap the board to drop one.",
          "Tap an arrow tool (Skate or Pass), tap where it starts, then tap where it ends.",
          "Tap Pen, then press and drag to draw a freehand line.",
          "Tap Select, then drag a marker to move it.",
          "Tap Eraser, then tap a marker, arrow or line to remove it.",
          "Tap Undo to take back the last change, or Clear to start the board again.",
          "Tap Remove diagram if you decide not to include one.",
        ],
        tips: ["The line under the tools tells you what the current tool does."],
      },
      {
        id: "edit-drill",
        title: "Editing or deleting your drill",
        intro: "Only the drills you made yourself can be changed.",
        steps: [
          "Open one of your drills from the Drill Library.",
          "Tap Edit to change anything, then tap the save button.",
          "Tap Delete to remove it. You are asked to confirm, and it cannot be undone.",
        ],
        tips: ["The built-in library drills cannot be edited or deleted. Use Use in Practice to build on them instead."],
      },
    ],
  },
  {
    id: "ask",
    title: "Ask Coach's Sidekick",
    topics: [
      {
        id: "chat",
        title: "The chat button",
        intro: "Tell Coach's Sidekick what you are working on in your own words.",
        steps: [
          "Turn on the voice / chat button first (Help, then Settings). Then tap the round chat button at the bottom left, above the whistle. The chat opens.",
          "Type what you need, for example \"I want to work on zone defense with my U12 team.\" Or tap one of the starter suggestions.",
          "Tap Send (the arrow). Coach's Sidekick replies and can set up a draft for you in the workspace.",
          "Close the chat with the X to go back to where you were.",
        ],
        tips: ["Not sure where to start? Tap \"I don't know where to start.\" and it will guide you."],
      },
    ],
  },
  {
    id: "settings",
    title: "Settings and when something goes wrong",
    topics: [
      {
        id: "display",
        title: "Text size and colours",
        intro: "Make the words bigger or change the colours of the whole app. Both are on this Help page, under Settings.",
        steps: [
          "Scroll to Settings at the bottom of this page.",
          "Under Text size, tap A, A+ or A++. The whole app grows at once.",
          "Under Color theme, tap Show, then tap a theme. The whole app changes straight away.",
        ],
        tips: ["Your choices are remembered on this device."],
      },
      {
        id: "language",
        title: "Changing the language",
        intro: "The app can be used in four languages.",
        steps: [
          "Open Help from the menu and scroll to Settings.",
          "Under Language, choose English, Español, Français or हिन्दी. Menus and buttons change straight away.",
        ],
      },
      {
        id: "trouble",
        title: "If something does not work",
        intro: "Most problems fix themselves with one of these.",
        steps: [
          "If a page looks stuck, reload it. Everything you saved is kept.",
          "If the chat or a draft says it could not be reached, check your internet connection and try again.",
          "To tell us about a problem, tap the red Feedback goal light at the bottom right, or email fivepoint0solutions@gmail.com.",
        ],
        tips: ["Your saved practices, ideas, materials and drills live in this browser on this device. They are not on other devices."],
      },
    ],
  },
];
