// Built-in player database for the "Player Connections" game.
// Every entry is bundled with the app — no external service required to play.
// Numbers are every jersey number a player is known to have worn across their
// career (college + pro), teams are every team they've played for, and
// colleges are every college they played for (usually one, sometimes two
// via transfer).
//
// This list is a curated starting set focused on connectivity (players who
// share colleges/teams/numbers with several others already in the list) so
// chains stay playable. Extend it freely — the game engine only depends on
// the shape below.

export type Sport = "NFL" | "NBA";

export interface Player {
  id: string;
  name: string;
  sport: Sport;
  colleges: string[];
  teams: string[];
  numbers: number[];
}

export const players: Player[] = [
  // ---- Alabama / Eagles / Dolphins cluster ----
  { id: "devonta-smith", name: "DeVonta Smith", sport: "NFL", colleges: ["Alabama"], teams: ["Philadelphia Eagles"], numbers: [6, 11] },
  { id: "jaylen-waddle", name: "Jaylen Waddle", sport: "NFL", colleges: ["Alabama"], teams: ["Miami Dolphins"], numbers: [17, 1] },
  { id: "tua-tagovailoa", name: "Tua Tagovailoa", sport: "NFL", colleges: ["Alabama"], teams: ["Miami Dolphins"], numbers: [13, 1] },
  { id: "jalen-hurts", name: "Jalen Hurts", sport: "NFL", colleges: ["Alabama", "Oklahoma"], teams: ["Philadelphia Eagles"], numbers: [1] },
  { id: "amari-cooper", name: "Amari Cooper", sport: "NFL", colleges: ["Alabama"], teams: ["Oakland Raiders", "Dallas Cowboys", "Cleveland Browns", "Buffalo Bills"], numbers: [9, 19] },
  { id: "julio-jones", name: "Julio Jones", sport: "NFL", colleges: ["Alabama"], teams: ["Atlanta Falcons", "Tennessee Titans", "Tampa Bay Buccaneers", "Philadelphia Eagles"], numbers: [11] },
  { id: "mark-ingram", name: "Mark Ingram II", sport: "NFL", colleges: ["Alabama"], teams: ["New Orleans Saints", "Baltimore Ravens", "New Orleans Saints"], numbers: [22, 28] },
  { id: "derrick-henry", name: "Derrick Henry", sport: "NFL", colleges: ["Alabama"], teams: ["Tennessee Titans", "Baltimore Ravens"], numbers: [22] },
  { id: "minkah-fitzpatrick", name: "Minkah Fitzpatrick", sport: "NFL", colleges: ["Alabama"], teams: ["Miami Dolphins", "Pittsburgh Steelers"], numbers: [29, 39] },
  { id: "landon-collins", name: "Landon Collins", sport: "NFL", colleges: ["Alabama"], teams: ["New York Giants", "Washington Commanders"], numbers: [21] },

  // ---- Ohio State cluster ----
  { id: "justin-fields", name: "Justin Fields", sport: "NFL", colleges: ["Georgia", "Ohio State"], teams: ["Chicago Bears", "Pittsburgh Steelers", "New York Jets"], numbers: [1] },
  { id: "chris-olave", name: "Chris Olave", sport: "NFL", colleges: ["Ohio State"], teams: ["New Orleans Saints"], numbers: [12] },
  { id: "garrett-wilson", name: "Garrett Wilson", sport: "NFL", colleges: ["Ohio State"], teams: ["New York Jets"], numbers: [17, 5] },
  { id: "marvin-harrison-jr", name: "Marvin Harrison Jr.", sport: "NFL", colleges: ["Ohio State"], teams: ["Arizona Cardinals"], numbers: [18] },
  { id: "dwayne-haskins", name: "Dwayne Haskins", sport: "NFL", colleges: ["Ohio State"], teams: ["Washington Commanders", "Pittsburgh Steelers"], numbers: [7] },
  { id: "ezekiel-elliott", name: "Ezekiel Elliott", sport: "NFL", colleges: ["Ohio State"], teams: ["Dallas Cowboys", "New England Patriots"], numbers: [21, 15] },

  // ---- Georgia cluster ----
  { id: "stetson-bennett", name: "Stetson Bennett", sport: "NFL", colleges: ["Georgia"], teams: ["Los Angeles Rams"], numbers: [13] },
  { id: "nick-chubb", name: "Nick Chubb", sport: "NFL", colleges: ["Georgia"], teams: ["Cleveland Browns", "Houston Texans"], numbers: [24] },
  { id: "sony-michel", name: "Sony Michel", sport: "NFL", colleges: ["Georgia"], teams: ["New England Patriots", "Los Angeles Rams", "Miami Dolphins"], numbers: [26] },
  { id: "todd-gurley", name: "Todd Gurley", sport: "NFL", colleges: ["Georgia"], teams: ["St. Louis Rams", "Los Angeles Rams", "Atlanta Falcons"], numbers: [30] },
  { id: "aj-green", name: "A.J. Green", sport: "NFL", colleges: ["Georgia"], teams: ["Cincinnati Bengals", "Arizona Cardinals"], numbers: [18] },
  { id: "roquan-smith", name: "Roquan Smith", sport: "NFL", colleges: ["Georgia"], teams: ["Chicago Bears", "Baltimore Ravens"], numbers: [58] },
  { id: "jordan-davis", name: "Jordan Davis", sport: "NFL", colleges: ["Georgia"], teams: ["Philadelphia Eagles"], numbers: [90] },
  { id: "kirby-smart-players-brock-bowers", name: "Brock Bowers", sport: "NFL", colleges: ["Georgia"], teams: ["Las Vegas Raiders"], numbers: [89] },

  // ---- Clemson cluster ----
  { id: "trevor-lawrence", name: "Trevor Lawrence", sport: "NFL", colleges: ["Clemson"], teams: ["Jacksonville Jaguars"], numbers: [16] },
  { id: "deshaun-watson", name: "Deshaun Watson", sport: "NFL", colleges: ["Clemson"], teams: ["Houston Texans", "Cleveland Browns"], numbers: [4] },
  { id: "sammy-watkins", name: "Sammy Watkins", sport: "NFL", colleges: ["Clemson"], teams: ["Buffalo Bills", "Los Angeles Rams", "Kansas City Chiefs", "Baltimore Ravens", "Green Bay Packers"], numbers: [14] },
  { id: "deandre-hopkins", name: "DeAndre Hopkins", sport: "NFL", colleges: ["Clemson"], teams: ["Houston Texans", "Arizona Cardinals", "Tennessee Titans", "Kansas City Chiefs", "Baltimore Ravens"], numbers: [10, 8] },
  { id: "tee-higgins", name: "Tee Higgins", sport: "NFL", colleges: ["Clemson"], teams: ["Cincinnati Bengals"], numbers: [85] },

  // ---- LSU cluster ----
  { id: "joe-burrow", name: "Joe Burrow", sport: "NFL", colleges: ["Ohio State", "LSU"], teams: ["Cincinnati Bengals"], numbers: [9] },
  { id: "jamarr-chase", name: "Ja'Marr Chase", sport: "NFL", colleges: ["LSU"], teams: ["Cincinnati Bengals"], numbers: [1] },
  { id: "justin-jefferson", name: "Justin Jefferson", sport: "NFL", colleges: ["LSU"], teams: ["Minnesota Vikings"], numbers: [18] },
  { id: "patrick-queen", name: "Patrick Queen", sport: "NFL", colleges: ["LSU"], teams: ["Baltimore Ravens", "Pittsburgh Steelers"], numbers: [6, 8] },
  { id: "leonard-fournette", name: "Leonard Fournette", sport: "NFL", colleges: ["LSU"], teams: ["Jacksonville Jaguars", "Tampa Bay Buccaneers"], numbers: [27, 28] },
  { id: "odell-beckham-jr", name: "Odell Beckham Jr.", sport: "NFL", colleges: ["LSU"], teams: ["New York Giants", "Cleveland Browns", "Los Angeles Rams", "Baltimore Ravens", "Miami Dolphins"], numbers: [13, 3] },

  // ---- Oklahoma cluster ----
  { id: "kyler-murray", name: "Kyler Murray", sport: "NFL", colleges: ["Texas A&M", "Oklahoma"], teams: ["Arizona Cardinals"], numbers: [1] },
  { id: "baker-mayfield", name: "Baker Mayfield", sport: "NFL", colleges: ["Texas Tech", "Oklahoma"], teams: ["Cleveland Browns", "Carolina Panthers", "Los Angeles Rams", "Tampa Bay Buccaneers"], numbers: [6] },
  { id: "ceedee-lamb", name: "CeeDee Lamb", sport: "NFL", colleges: ["Oklahoma"], teams: ["Dallas Cowboys"], numbers: [88] },
  { id: "marquise-brown", name: "Marquise Brown", sport: "NFL", colleges: ["Oklahoma"], teams: ["Baltimore Ravens", "Arizona Cardinals", "Kansas City Chiefs"], numbers: [5] },

  // ---- Miami (FL) cluster ----
  { id: "kyle-pitts", name: "Kyle Pitts", sport: "NFL", colleges: ["Florida"], teams: ["Atlanta Falcons"], numbers: [8] },

  // ---- Texas cluster ----
  { id: "sam-ehlinger", name: "Sam Ehlinger", sport: "NFL", colleges: ["Texas"], teams: ["Indianapolis Colts", "Denver Broncos"], numbers: [4] },
  { id: "bijan-robinson", name: "Bijan Robinson", sport: "NFL", colleges: ["Texas"], teams: ["Atlanta Falcons"], numbers: [7] },

  // ---- Chiefs / Kansas hub ----
  { id: "patrick-mahomes", name: "Patrick Mahomes", sport: "NFL", colleges: ["Texas Tech"], teams: ["Kansas City Chiefs"], numbers: [15] },
  { id: "travis-kelce", name: "Travis Kelce", sport: "NFL", colleges: ["Cincinnati"], teams: ["Kansas City Chiefs"], numbers: [87] },
  { id: "tyreek-hill", name: "Tyreek Hill", sport: "NFL", colleges: ["West Alabama"], teams: ["Kansas City Chiefs", "Miami Dolphins"], numbers: [10] },
  { id: "chris-jones", name: "Chris Jones", sport: "NFL", colleges: ["Mississippi State"], teams: ["Kansas City Chiefs"], numbers: [95] },

  // ---- Eagles roster connectivity ----
  { id: "aj-brown", name: "A.J. Brown", sport: "NFL", colleges: ["Ole Miss"], teams: ["Tennessee Titans", "Philadelphia Eagles"], numbers: [11] },
  { id: "dallas-goedert", name: "Dallas Goedert", sport: "NFL", colleges: ["South Dakota State"], teams: ["Philadelphia Eagles"], numbers: [88] },
  { id: "saquon-barkley", name: "Saquon Barkley", sport: "NFL", colleges: ["Penn State"], teams: ["New York Giants", "Philadelphia Eagles"], numbers: [26] },
  { id: "haason-reddick", name: "Haason Reddick", sport: "NFL", colleges: ["Temple"], teams: ["Arizona Cardinals", "Carolina Panthers", "Philadelphia Eagles", "New York Jets"], numbers: [43, 7] },

  // ---- Dolphins connectivity ----
  { id: "raheem-mostert", name: "Raheem Mostert", sport: "NFL", colleges: ["Purdue"], teams: ["San Francisco 49ers", "Miami Dolphins", "Las Vegas Raiders"], numbers: [31, 2] },
  { id: "de-von-achane", name: "De'Von Achane", sport: "NFL", colleges: ["Texas A&M"], teams: ["Miami Dolphins"], numbers: [28] },

  // ---- Cowboys connectivity ----
  { id: "dak-prescott", name: "Dak Prescott", sport: "NFL", colleges: ["Mississippi State"], teams: ["Dallas Cowboys"], numbers: [4] },
  { id: "micah-parsons", name: "Micah Parsons", sport: "NFL", colleges: ["Penn State"], teams: ["Dallas Cowboys"], numbers: [11] },
  { id: "trevon-diggs", name: "Trevon Diggs", sport: "NFL", colleges: ["Alabama"], teams: ["Dallas Cowboys"], numbers: [7] },

  // ---- Vikings / cross links ----
  { id: "stefon-diggs", name: "Stefon Diggs", sport: "NFL", colleges: ["Maryland"], teams: ["Minnesota Vikings", "Buffalo Bills", "Houston Texans", "New England Patriots"], numbers: [14] },
  { id: "kirk-cousins", name: "Kirk Cousins", sport: "NFL", colleges: ["Michigan State"], teams: ["Washington Commanders", "Minnesota Vikings", "Atlanta Falcons"], numbers: [8, 18] },

  // ---- Ravens / Steelers rivalry cluster ----
  { id: "lamar-jackson", name: "Lamar Jackson", sport: "NFL", colleges: ["Louisville"], teams: ["Baltimore Ravens"], numbers: [8] },
  { id: "mark-andrews", name: "Mark Andrews", sport: "NFL", colleges: ["Oklahoma"], teams: ["Baltimore Ravens"], numbers: [89] },
  { id: "tj-watt", name: "T.J. Watt", sport: "NFL", colleges: ["Wisconsin"], teams: ["Pittsburgh Steelers"], numbers: [90] },
  { id: "najee-harris", name: "Najee Harris", sport: "NFL", colleges: ["Alabama"], teams: ["Pittsburgh Steelers", "Los Angeles Chargers"], numbers: [22] },

  // ---- Bills cluster ----
  { id: "josh-allen", name: "Josh Allen", sport: "NFL", colleges: ["Reedley College", "Wyoming"], teams: ["Buffalo Bills"], numbers: [17] },
  { id: "james-cook", name: "James Cook", sport: "NFL", colleges: ["Georgia"], teams: ["Buffalo Bills"], numbers: [4] },

  // ---- 49ers cluster ----
  { id: "brock-purdy", name: "Brock Purdy", sport: "NFL", colleges: ["Iowa State"], teams: ["San Francisco 49ers"], numbers: [13] },
  { id: "christian-mccaffrey", name: "Christian McCaffrey", sport: "NFL", colleges: ["Stanford"], teams: ["Carolina Panthers", "San Francisco 49ers"], numbers: [22] },
  { id: "george-kittle", name: "George Kittle", sport: "NFL", colleges: ["Iowa"], teams: ["San Francisco 49ers"], numbers: [85] },
  { id: "nick-bosa", name: "Nick Bosa", sport: "NFL", colleges: ["Ohio State"], teams: ["San Francisco 49ers"], numbers: [97] },
  { id: "trent-williams", name: "Trent Williams", sport: "NFL", colleges: ["Oklahoma"], teams: ["Washington Commanders", "San Francisco 49ers"], numbers: [71] },

  // ---- Bengals / Bears / Lions connectivity ----
  { id: "caleb-williams", name: "Caleb Williams", sport: "NFL", colleges: ["Oklahoma", "USC"], teams: ["Chicago Bears"], numbers: [13] },
  { id: "dj-moore", name: "D.J. Moore", sport: "NFL", colleges: ["Maryland"], teams: ["Carolina Panthers", "Chicago Bears"], numbers: [2] },
  { id: "jared-goff", name: "Jared Goff", sport: "NFL", colleges: ["California"], teams: ["Los Angeles Rams", "Detroit Lions"], numbers: [16] },
  { id: "amon-ra-st-brown", name: "Amon-Ra St. Brown", sport: "NFL", colleges: ["USC"], teams: ["Detroit Lions"], numbers: [14] },
  { id: "jahmyr-gibbs", name: "Jahmyr Gibbs", sport: "NFL", colleges: ["Georgia Tech", "Alabama"], teams: ["Detroit Lions"], numbers: [26] },

  // ---- Seahawks / Jets connectivity ----
  { id: "dk-metcalf", name: "D.K. Metcalf", sport: "NFL", colleges: ["Ole Miss"], teams: ["Seattle Seahawks", "Pittsburgh Steelers"], numbers: [14] },
  { id: "geno-smith", name: "Geno Smith", sport: "NFL", colleges: ["West Virginia"], teams: ["New York Jets", "Seattle Seahawks", "Las Vegas Raiders"], numbers: [7] },
  { id: "sauce-gardner", name: "Sauce Gardner", sport: "NFL", colleges: ["Cincinnati"], teams: ["New York Jets"], numbers: [1] },

  // ---- Packers / Broncos ----
  { id: "jordan-love", name: "Jordan Love", sport: "NFL", colleges: ["Utah State"], teams: ["Green Bay Packers"], numbers: [10] },
  { id: "aaron-rodgers", name: "Aaron Rodgers", sport: "NFL", colleges: ["Butte College", "California"], teams: ["Green Bay Packers", "New York Jets", "Pittsburgh Steelers"], numbers: [12, 8] },
  { id: "davante-adams", name: "Davante Adams", sport: "NFL", colleges: ["Fresno State"], teams: ["Green Bay Packers", "Las Vegas Raiders", "New York Jets", "Los Angeles Rams"], numbers: [17, 11] },
  { id: "russell-wilson", name: "Russell Wilson", sport: "NFL", colleges: ["North Carolina State", "Wisconsin"], teams: ["Seattle Seahawks", "Denver Broncos", "Pittsburgh Steelers", "New York Giants"], numbers: [3] },
  { id: "courtland-sutton", name: "Courtland Sutton", sport: "NFL", colleges: ["SMU"], teams: ["Denver Broncos"], numbers: [14] },

  // ---- Titans / Texans ----
  { id: "cj-stroud", name: "C.J. Stroud", sport: "NFL", colleges: ["Ohio State"], teams: ["Houston Texans"], numbers: [7] },
  { id: "will-anderson-jr", name: "Will Anderson Jr.", sport: "NFL", colleges: ["Alabama"], teams: ["Houston Texans"], numbers: [51] },
  { id: "will-levis", name: "Will Levis", sport: "NFL", colleges: ["Penn State", "Kentucky"], teams: ["Tennessee Titans"], numbers: [8] },

  // ---- Chargers / Raiders ----
  { id: "justin-herbert", name: "Justin Herbert", sport: "NFL", colleges: ["Oregon"], teams: ["Los Angeles Chargers"], numbers: [10] },
  { id: "keenan-allen", name: "Keenan Allen", sport: "NFL", colleges: ["California"], teams: ["Los Angeles Chargers", "Chicago Bears"], numbers: [13] },
  { id: "maxx-crosby", name: "Maxx Crosby", sport: "NFL", colleges: ["Eastern Michigan"], teams: ["Las Vegas Raiders"], numbers: [98] },

  // ---- Patriots / Colts / Jaguars ----
  { id: "drake-maye", name: "Drake Maye", sport: "NFL", colleges: ["North Carolina"], teams: ["New England Patriots"], numbers: [10] },
  { id: "anthony-richardson", name: "Anthony Richardson", sport: "NFL", colleges: ["Florida"], teams: ["Indianapolis Colts"], numbers: [5] },
  { id: "travis-etienne", name: "Travis Etienne Jr.", sport: "NFL", colleges: ["Clemson"], teams: ["Jacksonville Jaguars"], numbers: [1] },

  // ---- Panthers / Bucs / Saints ----
  { id: "bryce-young", name: "Bryce Young", sport: "NFL", colleges: ["Alabama"], teams: ["Carolina Panthers"], numbers: [9] },
  { id: "mike-evans", name: "Mike Evans", sport: "NFL", colleges: ["Texas A&M"], teams: ["Tampa Bay Buccaneers"], numbers: [13] },
  { id: "chris-godwin", name: "Chris Godwin", sport: "NFL", colleges: ["Penn State"], teams: ["Tampa Bay Buccaneers"], numbers: [12, 14] },
  { id: "alvin-kamara", name: "Alvin Kamara", sport: "NFL", colleges: ["Alabama", "Tennessee"], teams: ["New Orleans Saints"], numbers: [41] },

  // ---- Cardinals / Rams ----
  { id: "matthew-stafford", name: "Matthew Stafford", sport: "NFL", colleges: ["Georgia"], teams: ["Detroit Lions", "Los Angeles Rams"], numbers: [9] },
  { id: "puka-nacua", name: "Puka Nacua", sport: "NFL", colleges: ["Washington", "BYU"], teams: ["Los Angeles Rams"], numbers: [17] },
  { id: "cooper-kupp", name: "Cooper Kupp", sport: "NFL", colleges: ["Eastern Washington"], teams: ["Los Angeles Rams", "Seattle Seahawks"], numbers: [10] },

  // ---- Bears/Commanders/QB draft class links ----
  { id: "jayden-daniels", name: "Jayden Daniels", sport: "NFL", colleges: ["Arizona State", "LSU"], teams: ["Washington Commanders"], numbers: [5] },
  { id: "terry-mclaurin", name: "Terry McLaurin", sport: "NFL", colleges: ["Ohio State"], teams: ["Washington Commanders"], numbers: [17] },

  // ---- Legacy / cross-era numbers for extra linking ----
  { id: "tom-brady", name: "Tom Brady", sport: "NFL", colleges: ["Michigan"], teams: ["New England Patriots", "Tampa Bay Buccaneers"], numbers: [12] },
  { id: "peyton-manning", name: "Peyton Manning", sport: "NFL", colleges: ["Tennessee"], teams: ["Indianapolis Colts", "Denver Broncos"], numbers: [18] },
  { id: "brett-favre", name: "Brett Favre", sport: "NFL", colleges: ["Southern Miss"], teams: ["Atlanta Falcons", "Green Bay Packers", "New York Jets", "Minnesota Vikings"], numbers: [4] },
  { id: "jerry-rice", name: "Jerry Rice", sport: "NFL", colleges: ["Mississippi Valley State"], teams: ["San Francisco 49ers", "Oakland Raiders", "Seattle Seahawks"], numbers: [80] },
  { id: "randy-moss", name: "Randy Moss", sport: "NFL", colleges: ["Marshall"], teams: ["Minnesota Vikings", "Oakland Raiders", "New England Patriots", "Tennessee Titans", "San Francisco 49ers"], numbers: [84, 18] },
  { id: "adrian-peterson", name: "Adrian Peterson", sport: "NFL", colleges: ["Oklahoma"], teams: ["Minnesota Vikings", "New Orleans Saints", "Arizona Cardinals", "Washington Commanders", "Detroit Lions", "Seattle Seahawks", "Tennessee Titans"], numbers: [28] },
  { id: "aaron-donald", name: "Aaron Donald", sport: "NFL", colleges: ["Pittsburgh"], teams: ["St. Louis Rams", "Los Angeles Rams"], numbers: [99] },
];

export function getPlayerById(id: string): Player | undefined {
  return players.find((p) => p.id === id);
}

export function findPlayersByName(query: string): Player[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return players.filter((p) => p.name.toLowerCase().includes(q));
}
