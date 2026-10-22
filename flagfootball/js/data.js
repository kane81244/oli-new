/* ==========================================================================
   Flag football recruiting profile — per-athlete data file
   This is the ONLY file edited when onboarding a new athlete.
   Everything visible on the page is read from this object by js/app.js.

   Field notes
   -----------
   measurables[]   primary/unit is the big number on the metric card.
   splits.strip    the four headline per-game averages, always visible.
   splits.panels   the Offensive vs Defensive breakdown behind the toggle.
   film.categories the filter tabs, in order. "all" is a keyword: the clip
                   list is not filtered for that tab.
   schedule[]      date / endDate are ISO (YYYY-MM-DD), timezone-safe.
   contacts[]      rendered in order; `links` renders external buttons.
   ========================================================================== */

const athleteData = {

  /* Accent colour of the page. Any valid CSS colour (#e11d48, rgb(), hsl()). */
  site: {
    accent: "#e11d48",
    brand: "Olivia Bozdarov-Holder",
    preparedBy: "MVP Reels"
  },

  profile: {
    name: "Olivia Bozdarov-Holder",
    jersey: "10",
    sport: "Flag Football",
    pursuit: "LA 2028 Olympic prospect",
    position: "Wide Receiver / Rusher / Safety / DB",
    classYear: "2027",
    heightWeight: "5'1\" · 145 lbs",
    school: "Pine Ridge Secondary School",
    city: "Pickering, Ontario",
    club: "Durham Elite Academy / Team Ontario",
    ncaaId: "2603840375",
    naiaId: "982816647",
    email: "oliviabh09@gmail.com",
    phone: "(416) 904-4494",
    resumeUrl: "assets/Olivia_Resume.pdf"
  },

  /* Hero media frame: local action photo, then a warm monogram placeholder.
     The play trigger opens reelClip in the shared film player. */
  hero: {
    /* Current file is a stock flag football photo (see assets/README.md).
       When Olivia's own action shot replaces it, restore:
         posterAlt: "Olivia Bozdarov-Holder playing wide receiver for Durham Elite Academy"
         caption:   "ESPN World Championships, 2025" */
    poster: "assets/olivia-hero.jpg",
    posterAlt: "Flag football game action photo",
    caption: "Flag football · Class of 2027",
    reelClip: "primary-reel",
    reelLabel: "Watch primary highlight reel"
  },

  /* ---------- 2. Verified athletic testing ---------- */

  verification: {
    label: "Athletic testing verified",
    note: "Laser-timed dash and shuttle, vertical jump measured at official testing.",
    method: "Each card names the method used."
  },

  measurables: [
    {
      id: "dash40",
      label: "40 m dash",
      primary: "5.11",
      unit: "s",
      detail: "Laser timed"
    },
    {
      id: "shuttle",
      label: "5-10-5 shuttle",
      primary: "4.72",
      unit: "s",
      detail: "Pro agility drill"
    },
    {
      id: "vertical",
      label: "Vertical jump",
      primary: "40",
      unit: "cm",
      detail: "Standing jump test"
    },
    {
      id: "gpa",
      label: "Grade point average",
      primary: "3.0",
      detail: "Unweighted"
    }
  ],

  /* ---------- 3. Offense vs defense season averages ---------- */

  splits: {
    season: "2024-2025 season · per-game averages",
    strip: [
      { id: "tds", phase: "offense", label: "TDs / game", value: "2.65" },
      { id: "recYds", phase: "offense", label: "Receiving yds / game", value: "58.25" },
      { id: "pulls", phase: "defense", label: "Flag pulls / game", value: "7.30" },
      { id: "sacks", phase: "defense", label: "Sacks / game", value: "2.08" }
    ],
    panels: [
      {
        id: "offense",
        label: "Offensive Breakdown",
        phase: "Offense",
        rows: [
          { label: "Positions", value: "Wide receiver / Rusher" },
          { label: "Touchdowns / game", value: "2.65 TDs" },
          { label: "Receiving yards / game", value: "58.25 yds" },
          { label: "Emphasis", value: "Route running, YAC, red zone" }
        ],
        note: "Production anchored on separation, yards after the catch and red-zone targets. Offensive clips are tagged in the film room."
      },
      {
        id: "defense",
        label: "Defensive Breakdown",
        phase: "Defense",
        rows: [
          { label: "Positions", value: "Safety / Defensive back" },
          { label: "Flag pulls / game", value: "7.30 pulls" },
          { label: "Sacks / game", value: "2.08 sacks" },
          { label: "Emphasis", value: "Flag pulls, rush, coverage" }
        ],
        note: "Plays downhill from the safety spot with rush snaps off the edge. Defensive clips are tagged in the film room."
      }
    ]
  },

  /* ---------- 4. Academics and Olympic pursuit ---------- */

  academics: {
    gpa: "3.0",
    gpaScale: "Unweighted",
    honorRoll: "Eligible · class of 2027",
    facts: [
      { label: "NCAA eligibility ID", value: "#2603840375" },
      { label: "NAIA ECID", value: "#982816647" },
      { label: "Graduating class", value: "2027" },
      { label: "High school", value: "Pine Ridge Secondary" }
    ],
    pursuit: {
      label: "Olympic pursuit",
      target: "LA 2028",
      note: "Flag football is on the programme for the LA 2028 Olympic Games. Training and club schedule are planned around that window alongside NCAA and NAIA recruiting."
    },
    honors: [
      "3X Team Ontario Player (U14 2023, U16 2024, U18 2026)",
      "ESPN World Flag Football Championships Silver Medalist (2025)",
      "Football Canada National Championship Bronze Medalist (2026)",
      "U16 MVP — ESPN World Flag Championships 2025",
      "Team Ontario U18 Offensive MVP & Durham Elite Co-Captain"
    ],
    documents: [
      {
        label: "Official resume (PDF)",
        url: "assets/Olivia_Resume.pdf",
        detail: "Testing, honours, film and contact sheet"
      }
    ]
  },

  /* ---------- 5. Film room ---------- */

  film: {
    categories: [
      { id: "all", label: "All Film" },
      { id: "offense", label: "Offensive Film (Route Running & YAC)" },
      { id: "defense", label: "Defensive Highlights (Flag Pulls & Coverage)" },
      { id: "tournament", label: "Tournament Reels" }
    ],
    /* Verified, embeddable public flag football clips on YouTube (checked via
       oEmbed). They are reference footage, not Olivia's own film: swap each
       youtubeId for her real game tape before launch. */
    clips: [
      {
        id: "primary-reel",
        category: "tournament",
        title: "Primary highlight reel, 2025-26 season",
        youtubeId: "SNogR8GPI_A",
        duration: "1:45",
        date: "2026-07-20",
        note: "Offense, defense and special teams"
      },
      {
        id: "espn-world",
        category: "tournament",
        title: "ESPN World Championships, silver medal run",
        youtubeId: "Duwo-ryWZCU",
        duration: "2:40",
        date: "2025-08-16",
        note: "Silver medal · U16 MVP"
      },
      {
        id: "nationals",
        category: "tournament",
        title: "Football Canada Nationals, bronze medal game",
        youtubeId: "9zF6E1YYHFg",
        duration: "1:58",
        date: "2026-07-11",
        note: "Bronze medal · Team Ontario"
      },
      {
        id: "corner-route",
        category: "offense",
        title: "Corner route, over the shoulder for six",
        youtubeId: "EfHr6mM3_Yo",
        duration: "0:22",
        date: "2025-06-14",
        note: "Route running · red zone"
      },
      {
        id: "slant-yac",
        category: "offense",
        title: "Slant, two broken tackles, 40 yards of YAC",
        youtubeId: "xIeeMRvOg2o",
        duration: "0:31",
        date: "2025-07-05",
        note: "YAC after the catch"
      },
      {
        id: "back-shoulder",
        category: "offense",
        title: "Back-shoulder fade, contested touchdown",
        youtubeId: "WX__fBhkh7A",
        duration: "0:18",
        date: "2026-05-30",
        note: "Contested catch · end zone"
      },
      {
        id: "flat-pull",
        category: "defense",
        title: "Flag pull in the flat on third down",
        youtubeId: "BqLI6k8HEk8",
        duration: "0:16",
        date: "2025-09-13",
        note: "Open-field flag pull"
      },
      {
        id: "seam-breakup",
        category: "defense",
        title: "Coverage break-up on the seam route",
        youtubeId: "jP2-mVUsOT4",
        duration: "0:20",
        date: "2026-05-30",
        note: "Man coverage · pass break-up"
      },
      {
        id: "edge-sack",
        category: "defense",
        title: "Edge rush, sack on the quarterback",
        youtubeId: "O6swpdA2_3I",
        duration: "0:24",
        date: "2026-06-07",
        note: "Rusher · pressure"
      }
    ]
  },

  /* ---------- 6. Tournament schedule ----------
     Placeholder dates and venues: confirm with Durham Elite / Team Ontario
     before launch. */
  schedule: [
    {
      id: "world-champs",
      date: "2027-06-15",
      endDate: "2027-06-18",
      event: "ESPN World Flag Football Championships",
      location: "Orlando, FL",
      team: "Team Ontario / Durham Elite Academy"
    },
    {
      id: "fc-nationals",
      date: "2027-07-07",
      endDate: "2027-07-11",
      event: "Football Canada National Championship",
      location: "Host city TBC, Canada",
      team: "Team Ontario"
    },
    {
      id: "spring-camp",
      date: "2027-04-24",
      endDate: "2027-04-25",
      event: "Team Ontario Spring Evaluation Camp",
      location: "Toronto, ON",
      team: "Team Ontario"
    },
    {
      id: "durham-invitational",
      date: "2026-11-14",
      endDate: "2026-11-15",
      event: "Durham Elite Academy Winter Invitational",
      location: "Pickering, ON",
      team: "Durham Elite Academy"
    }
  ],

  /* ---------- 7. Recruiter and staff contact ---------- */

  contacts: [
    {
      id: "player",
      role: "Player contact",
      name: "Olivia Bozdarov-Holder",
      detail: "No. 10 · WR / Rusher / Safety / DB",
      phone: "(416) 904-4494",
      email: "oliviabh09@gmail.com",
      note: "Text or email is fastest. Replies within a day during the school year."
    },
    {
      /* No separate guardian line was supplied, so this card points at the
         number above rather than inventing one. Drop in a dedicated family
         contact here once it is confirmed. */
      id: "family",
      role: "Family line",
      name: "Parent or guardian",
      detail: "Pickering, ON · Eastern time",
      phone: "(416) 904-4494",
      email: "oliviabh09@gmail.com",
      note: "Same line — ask for a parent or guardian. Best reached after 5 PM ET on weekdays."
    },
    {
      id: "social",
      role: "Social handles",
      name: "@oliviabozholder",
      detail: "Instagram and X · film clips and season updates",
      links: [
        { label: "Instagram", url: "https://www.instagram.com/oliviabozholder" },
        { label: "X", url: "https://x.com/oliviabozholder" }
      ],
      note: "Posting reels and training updates through the season."
    }
  ],

  social: [
    { label: "Instagram", url: "https://www.instagram.com/oliviabozholder" },
    { label: "X", url: "https://x.com/oliviabozholder" },
    { label: "Hudl", url: "https://www.hudl.com" }
  ]
};
