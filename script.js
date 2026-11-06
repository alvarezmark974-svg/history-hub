
const facts = [
  "Cleopatra lived closer to the Moon landing than to the building of the Great Pyramid!",
  "The Great Pyramid of Giza is over 4,500 years old.",
  "The first Olympic Games were held in ancient Greece.",
  "Ancient Romans used a form of concrete.",
  "The printing press helped spread books across Europe.",
  "The shortest war in recorded history lasted less than an hour."
];

function newFact() {
  const fact = facts[Math.floor(Math.random() * facts.length)];
  document.getElementById("fact").textContent = fact;
}

const topics = {
  egypt: {
    title: "🏺 Ancient Egypt",
    text: "Ancient Egypt was one of the world's great civilizations. It developed along the Nile River. Egyptians built enormous pyramids, created hieroglyphic writing, and were ruled by powerful pharaohs. The civilization lasted for thousands of years."
  },
  rome: {
    title: "🏛️ The Roman Empire",
    text: "The Roman Empire controlled huge areas around the Mediterranean. Romans built roads, aqueducts, and impressive buildings. Their language, laws, and engineering influenced many societies that came after them."
  },
  ww2: {
    title: "🌍 World War II",
    text: "World War II lasted from 1939 to 1945. It involved countries across the world and changed international politics, technology, and everyday life. It ended in 1945."
  },
  america: {
    title: "🗽 The American Revolution",
    text: "The American Revolution was a struggle between Great Britain and its thirteen American colonies. The colonies declared independence in 1776 and eventually formed the United States."
  }
};

function openTopic(topic) {
  document.getElementById("topicPage").hidden = false;
  document.getElementById("topicTitle").textContent = topics[topic].title;
  document.getElementById("topicText").textContent = topics[topic].text;

  document.getElementById("topicPage").scrollIntoView({
    behavior: "smooth"
  });
}

function showHome() {
  document.getElementById("topicPage").hidden = true;
  document.getElementById("searchResults").textContent = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function searchHistory() {
  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");
  if (!input || !results) return;

  const query = input.value.toLowerCase().replace(/[^a-z0-9\\s]/g, " ").trim();
  results.replaceChildren();

  if (!query) {
    results.textContent = "Type a history topic or question to search.";
    return;
  }

  const searchTerms = {
    egypt: ["egypt", "pyramid", "pyramids", "pharaoh", "pharaohs", "cleopatra", "nile", "hieroglyph"],
    rome: ["rome", "roman", "romans", "empire", "aqueduct", "gladiator"],
    ww2: ["world war ii", "wwii", "ww2", "second world war", "1939", "1945"],
    america: ["america", "american revolution", "independence", "1776", "colonies", "britain"]
  };

  const normalized = query.replace(/\\s+/g, " ");
  const matches = Object.entries(topics).filter(([key, topic]) => {
    const searchable = (key + " " + topic.title + " " + topic.text + " " +
      (searchTerms[key] || []).join(" ")).toLowerCase();
    const words = normalized.split(" ").filter(word =>
      word.length > 1 && !["who", "what", "when", "where", "why", "how", "is", "are",
        "was", "were", "the", "a", "an", "did", "do", "does", "in", "of", "to",
        "for", "and", "built", "tell", "me", "about"].includes(word)
    );
    return words.some(word => searchable.includes(word)) ||
      Object.values(searchTerms).some(terms => terms.some(term =>
        normalized.includes(term) && terms.some(alias => searchable.includes(alias))
      )) && searchable.includes(key);
  });

  if (matches.length === 0) {
    results.textContent = "No matching topic yet. Try Egypt, pyramids, Rome, World War II, or 1776.";
    return;
  }

  const heading = document.createElement("h2");
  heading.textContent = "Search Results";
  results.appendChild(heading);

  matches.forEach(([key, topic]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = topic.title;
    button.addEventListener("click", () => openTopic(key));
    results.appendChild(button);
  });

  results.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

const historySearchInput = document.getElementById("searchInput");
if (historySearchInput) {
  historySearchInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") searchHistory();
  });
}

const questions = [
  {
    question: "Which civilization built the pyramids of Giza?",
    answers: ["Romans", "Ancient Egyptians", "Vikings"],
    correct: 1
  },
  {
    question: "In which year did the American colonies declare independence?",
    answers: ["1492", "1812", "1776"],
    correct: 2
  },
  {
    question: "Which city was the center of the Roman Empire?",
    answers: ["Rome", "Athens", "London"],
    correct: 0
  }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

function showQuestion() {
  const q = questions[currentQuestion];
  document.getElementById("question").textContent = q.question;
  document.getElementById("quizResult").textContent = "";
  document.getElementById("answers").innerHTML = "";
  answered = false;

  q.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.onclick = () => checkAnswer(index);
    document.getElementById("answers").appendChild(button);
  });
}

function checkAnswer(index) {
  if (answered) return;
  answered = true;

  if (index === questions[currentQuestion].correct) {
    score++;
    document.getElementById("quizResult").textContent = "Correct! 🎉";
  } else {
    document.getElementById("quizResult").textContent =
      "Not quite! The correct answer is " +
      questions[currentQuestion].answers[questions[currentQuestion].correct];
  }
}

function nextQuestion() {
  currentQuestion++;

  if (currentQuestion >= questions.length) {
    document.getElementById("question").textContent =
      "Quiz complete! You scored " + score + " out of " + questions.length + "!";

    document.getElementById("answers").innerHTML = "";
    document.getElementById("quizResult").textContent =
      "Great job exploring history!";

    currentQuestion = 0;
    score = 0;
    return;
  }

  showQuestion();
}

showQuestion();

let favorites = JSON.parse(
  localStorage.getItem("historyFavorites") || "[]"
);

function saveFact() {
  const fact = document.getElementById("fact").textContent;

  if (favorites.includes(fact)) {
    alert("You already saved this fact!");
    return;
  }

  favorites.push(fact);

  localStorage.setItem(
    "historyFavorites",
    JSON.stringify(favorites)
  );

  showFavorites();
}

function showFavorites() {
  const list = document.getElementById("favoriteList");
  list.innerHTML = "";

  favorites.forEach((fact, index) => {
    const item = document.createElement("div");
    item.className = "favorite-item";

    const text = document.createElement("p");
    text.textContent = fact;

    const remove = document.createElement("button");
    remove.textContent = "Remove Favorite";

    remove.onclick = () => {
      favorites.splice(index, 1);

      localStorage.setItem(
        "historyFavorites",
        JSON.stringify(favorites)
      );

      showFavorites();
    };

    item.appendChild(text);
    item.appendChild(remove);
    list.appendChild(item);
  });
}

showFavorites();

const encyclopediaArticles = {
  egypt: {
    title: "🏺 The Civilization of Ancient Egypt",
    text: `Ancient Egypt developed along the Nile River in northeastern Africa.

The Nile provided water, fertile farmland, and transportation. These resources helped Egyptian civilization grow.

Egyptian rulers were called pharaohs. Egyptians built enormous pyramids, created hieroglyphic writing, and developed impressive mathematical and engineering skills.

The Great Pyramid of Giza was built as a tomb for Pharaoh Khufu.

Ancient Egyptian civilization lasted for thousands of years and left behind monuments and artifacts that historians still study today.`
  },

  rome: {
    title: "🏛️ The Roman Empire",
    text: `Ancient Rome began as a city in Italy and eventually became one of the largest empires in history.

The Romans built roads, bridges, aqueducts, and enormous buildings.

The Colosseum in Rome hosted public spectacles. Roman engineers developed construction techniques that influenced later civilizations.

Latin, Roman law, and Roman architecture influenced many societies throughout Europe and beyond.

The Western Roman Empire traditionally fell in 476 CE.`
  },

  vikings: {
    title: "⚔️ The Viking Age",
    text: `The Viking Age began around the late eighth century.

Vikings came from Scandinavia, including areas that are now Norway, Sweden, and Denmark.

They were skilled sailors who traveled across Europe and the Atlantic Ocean.

Viking ships were designed to travel through both open water and shallow rivers.

Vikings were traders, explorers, farmers, and warriors. Their history is much more than the battles often shown in movies.`
  },

  greece: {
    title: "🏺 Ancient Greece",
    text: `Ancient Greece was made up of independent city-states, including Athens and Sparta.

The Greeks made important contributions to philosophy, mathematics, theater, art, and politics.

Athens developed an early form of democracy, although only certain residents could participate.

Greek mythology included stories about Zeus, Athena, Poseidon, and many other gods and heroes.

The ancient Olympic Games began in Olympia, Greece.`
  }
};

function readArticle(topic) {
  const article = encyclopediaArticles[topic];

  document.getElementById("articleTitle").textContent =
    article.title;

  document.getElementById("articleText").textContent =
    article.text;

  document.getElementById("articleReader").hidden = false;

  document.getElementById("articleReader").scrollIntoView({
    behavior: "smooth"
  });
}

function closeArticle() {
  document.getElementById("articleReader").hidden = true;
}

const dailyQuestions = [
  {
    question: "Which ancient civilization built the pyramids of Giza?",
    answers: ["Romans", "Egyptians", "Vikings", "Greeks"],
    correct: 1
  },
  {
    question: "Who was the first Roman emperor?",
    answers: ["Julius Caesar", "Nero", "Augustus", "Marcus Aurelius"],
    correct: 2
  },
  {
    question: "In which year did the American colonies declare independence?",
    answers: ["1776", "1492", "1812", "1865"],
    correct: 0
  },
  {
    question: "Where did the ancient Olympic Games begin?",
    answers: ["Rome", "Egypt", "Greece", "China"],
    correct: 2
  },
  {
    question: "Who was the first person to walk on the Moon?",
    answers: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "John Glenn"],
    correct: 1
  }
];

let challengeIndex = 0;
let challengePoints = 0;
let challengeAnswered = false;

function showChallengeQuestion() {
  const q = dailyQuestions[challengeIndex];

  document.getElementById("challengeQuestion").textContent =
    q.question;

  document.getElementById("challengeProgress").textContent =
    (challengeIndex + 1) + " / " + dailyQuestions.length;

  document.getElementById("challengeScore").textContent =
    challengePoints;

  document.getElementById("challengeFeedback").textContent = "";

  document.getElementById("challengeNext").hidden = true;
  document.getElementById("challengeRestart").hidden = true;

  const answers = document.getElementById("challengeAnswers");
  answers.innerHTML = "";

  challengeAnswered = false;

  q.answers.forEach((answer, index) => {
    const button = document.createElement("button");

    button.textContent = answer;

    button.onclick = () => answerChallenge(index);

    answers.appendChild(button);
  });
}

function answerChallenge(index) {
  if (challengeAnswered) return;

  challengeAnswered = true;

  const q = dailyQuestions[challengeIndex];
  const feedback = document.getElementById("challengeFeedback");

  if (index === q.correct) {
    challengePoints += 10;
    feedback.textContent = "Correct! +10 points! 🎉";
  } else {
    feedback.textContent =
      "Not quite! The correct answer is " +
      q.answers[q.correct] + ".";
  }

  document.getElementById("challengeScore").textContent =
    challengePoints;

  document.getElementById("challengeNext").hidden = false;

  if (challengeIndex === dailyQuestions.length - 1) {
    document.getElementById("challengeNext").textContent =
      "See My Results 🏆";
  }
}

function nextChallengeQuestion() {
  challengeIndex++;

  if (challengeIndex >= dailyQuestions.length) {
    finishChallenge();
    return;
  }

  document.getElementById("challengeNext").textContent =
    "Next Question →";

  showChallengeQuestion();
}

function finishChallenge() {
  document.getElementById("challengeQuestion").textContent =
    "Challenge Complete!";

  document.getElementById("challengeAnswers").innerHTML = "";

  document.getElementById("challengeProgress").textContent =
    "5 / 5";

  document.getElementById("challengeFeedback").textContent =
    "You earned " + challengePoints + " points!";

  document.getElementById("challengeNext").hidden = true;

  document.getElementById("challengeRestart").hidden = false;

  const achievement = document.getElementById("achievement");

  if (challengePoints === 50) {
    achievement.textContent = "🏆 Achievement unlocked: History Genius!";
  } else if (challengePoints >= 30) {
    achievement.textContent = "🥇 Achievement unlocked: History Explorer!";
  } else {
    achievement.textContent = "📚 Keep learning, History Explorer!";
  }
}

function restartChallenge() {
  challengeIndex = 0;
  challengePoints = 0;

  document.getElementById("achievement").textContent = "";

  showChallengeQuestion();
}

showChallengeQuestion();
// ACHIEVEMENT SYSTEM

let earnedBadges = [];

try {
  earnedBadges = JSON.parse(
    localStorage.getItem("historyHubBadges") || "[]"
  );
} catch (error) {
  earnedBadges = [];
}

function unlockBadge(badgeName) {
  if (earnedBadges.includes(badgeName)) {
    return;
  }

  earnedBadges.push(badgeName);

  try {
    localStorage.setItem(
      "historyHubBadges",
      JSON.stringify(earnedBadges)
    );
  } catch (error) {
    console.log("Badge saved for this session only.");
  }

  updateBadges();

  document.getElementById("achievement-message").textContent =
    "🎉 Achievement unlocked: " + badgeName + "!";
}

function updateBadges() {
  const badgeNames = [
    "explorer",
    "quiz",
    "fact",
    "daily"
  ];

  badgeNames.forEach(function(name) {
    const badge = document.getElementById("badge-" + name);

    if (earnedBadges.includes(name)) {
      badge.classList.add("unlocked");

      badge.querySelector(".badge-status").textContent =
        "🏆 Unlocked!";
    }
  });
}

// Load saved achievements
updateBadges();
// FIXED WORLD HISTORY MAP

const worldHistoryPlaces = {
  egypt: {
    title: "🇪🇬 Ancient Egypt",
    location: "Northeastern Africa",
    fact: "Ancient Egypt is famous for its pyramids, pharaohs, and hieroglyphics. The Great Pyramid of Giza was built over 4,500 years ago."
  },
  greece: {
    title: "🇬🇷 Ancient Greece",
    location: "Southern Europe",
    fact: "Ancient Greece helped develop democracy, philosophy, and the Olympic Games."
  },
  rome: {
    title: "🇮🇹 Ancient Rome",
    location: "Italy",
    fact: "Ancient Rome built roads, aqueducts, and impressive amphitheaters."
  },
  china: {
    title: "🇨🇳 Ancient China",
    location: "East Asia",
    fact: "Ancient China developed inventions such as paper and printing."
  },
  india: {
    title: "🇮🇳 Ancient India",
    location: "South Asia",
    fact: "The Indus Valley Civilization developed carefully planned cities."
  },
  maya: {
    title: "🇲🇽 Maya Civilization",
    location: "Central America",
    fact: "The Maya developed advanced calendars, mathematics, and writing."
  },
  america: {
    title: "🇺🇸 United States",
    location: "North America",
    fact: "The Declaration of Independence was adopted on July 4, 1776."
  },
  england: {
    title: "🇬🇧 England",
    location: "United Kingdom",
    fact: "The Magna Carta was sealed by King John in 1215."
  }
};

// Listen for clicks on map buttons
document.addEventListener("click", function(event) {
  const button = event.target.closest("[data-history-place]");

  if (!button) return;

  const place = button.dataset.historyPlace;
  const history = worldHistoryPlaces[place];

  if (!history) return;

  const result = document.getElementById("map-result");

  result.innerHTML = "";

  const title = document.createElement("h3");
  title.textContent = history.title;

  const location = document.createElement("p");
  location.textContent = "Location: " + history.location;

  const fact = document.createElement("p");
  fact.textContent = history.fact;

  result.append(title, location, fact);
});
// HISTORICAL EVENT OF THE DAY

const historyEvents = [
  {
    title: "The First Moon Landing",
    date: "July 20, 1969",
    description: "Apollo 11 landed on the Moon, and Neil Armstrong became the first person to walk on its surface.",
    extra: "🌙 This was a major milestone in space exploration."
  },
  {
    title: "The Berlin Wall Opens",
    date: "November 9, 1989",
    description: "East Germany opened its border crossings, allowing people to cross the Berlin Wall.",
    extra: "🌍 This became an important moment in the end of the Cold War."
  },
  {
    title: "The United Nations Begins",
    date: "October 24, 1945",
    description: "The United Nations officially came into existence after its founding charter was ratified.",
    extra: "🕊️ Its goal includes promoting international peace and cooperation."
  },
  {
    title: "The Declaration of Independence",
    date: "July 4, 1776",
    description: "The Second Continental Congress adopted the Declaration of Independence.",
    extra: "🇺🇸 This announced that the thirteen American colonies considered themselves independent from Britain."
  },
  {
    title: "The First Modern Olympic Games",
    date: "April 6, 1896",
    description: "The first modern Olympic Games opened in Athens, Greece.",
    extra: "🏅 Athletes from different countries competed in this international sporting event."
  }
];

function showDailyEvent() {
  const title = document.getElementById("event-title");
  const date = document.getElementById("event-date");
  const description = document.getElementById("event-description");
  const extra = document.getElementById("event-extra");

  // If the section isn't on this page, safely skip it.
  if (!title || !date || !description || !extra || !historyEvents.length) return;

  // Pick an event using the local calendar date.
  const now = new Date();
  const dayNumber = Math.floor(
    (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) -
      Date.UTC(now.getFullYear(), 0, 1)) / 86400000
  );
  const event = historyEvents[((dayNumber % historyEvents.length) + historyEvents.length) % historyEvents.length];

  title.textContent = event.title;
  date.textContent = event.date;
  description.textContent = event.description;
  extra.textContent = event.extra;
}

// Run after the page is ready so the event section exists before updating it.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", showDailyEvent, { once: true });
} else {
  showDailyEvent();
}// HOLIDAY EXPLORER

const holidayInfo = {
  halloween: {
    title: "🎃 Halloween",
    origin: "Halloween developed partly from the ancient Celtic festival of Samhain, which marked the end of the harvest season.",
    traditions: "People dress up in costumes, carve pumpkins, decorate their homes, and go trick-or-treating.",
    fun: "The name Halloween comes from All Hallows' Eve."
  },

  christmas: {
    title: "🎄 Christmas",
    origin: "Christmas is a Christian holiday celebrating the birth of Jesus Christ. Many Christmas customs developed over centuries.",
    traditions: "People decorate trees, exchange gifts, sing carols, and gather with family.",
    fun: "Christmas is celebrated in many different ways around the world."
  },

  thanksgiving: {
    title: "🦃 Thanksgiving",
    origin: "Thanksgiving in the United States developed from harvest celebrations. The 1621 gathering at Plymouth is often remembered in its history.",
    traditions: "Families gather for meals, express gratitude, and enjoy traditional foods.",
    fun: "The modern US Thanksgiving holiday is celebrated on the fourth Thursday of November."
  },

  valentines: {
    title: "💝 Valentine's Day",
    origin: "Valentine's Day is connected to Saint Valentine and traditions that developed in Europe over many centuries.",
    traditions: "People exchange cards, flowers, and kind messages.",
    fun: "February 14 is celebrated as a day of affection and friendship."
  },

  easter: {
    title: "🐰 Easter",
    origin: "Easter is a Christian holiday celebrating the resurrection of Jesus Christ.",
    traditions: "Traditions include church services, egg decorating, and Easter egg hunts.",
    fun: "The date of Easter changes every year."
  },

  newyear: {
    title: "🎆 New Year's Day",
    origin: "January 1 became the beginning of the new year in the Roman calendar under Julius Caesar's calendar reform.",
    traditions: "People celebrate with fireworks, countdowns, parties, and New Year's resolutions.",
    fun: "Different cultures celebrate the new year on different dates."
  },

  diwali: {
    title: "🪔 Diwali",
    origin: "Diwali is a major festival celebrated in Hindu, Jain, Sikh, and some Buddhist traditions. Its stories and meanings vary by community.",
    traditions: "People light lamps, decorate homes, share sweets, and celebrate with family.",
    fun: "Diwali is often called the Festival of Lights."
  },

  eid: {
    title: "🌙 Eid al-Fitr",
    origin: "Eid al-Fitr is an Islamic celebration marking the end of Ramadan, the month of fasting.",
    traditions: "People attend special prayers, share meals, give to charity, and visit loved ones.",
    fun: "Its date follows the Islamic lunar calendar."
  },

  lunar: {
    title: "🧧 Lunar New Year",
    origin: "Lunar New Year is celebrated by many communities across Asia and around the world, with traditions that differ between cultures.",
    traditions: "Celebrations may include family reunions, special foods, lanterns, and gift-giving.",
    fun: "The celebrations often last several days."
  },

  dayofthedead: {
    title: "💀 Día de los Muertos",
    origin: "Día de los Muertos is a Mexican tradition honoring loved ones who have died, combining Indigenous traditions and later influences.",
    traditions: "Families may create ofrendas, decorate with marigolds, share food, and remember loved ones.",
    fun: "It is commonly observed on November 1 and 2."
  },

  passover: {
    title: "🍷 Passover",
    origin: "Passover is a Jewish holiday remembering the Israelites' liberation from slavery in ancient Egypt, as told in the Torah.",
    traditions: "Families gather for a Seder meal and retell the Passover story.",
    fun: "Passover lasts seven days in Israel and traditionally eight days in many Jewish communities outside Israel."
  },

  independence: {
    title: "🎇 US Independence Day",
    origin: "July 4 commemorates the adoption of the Declaration of Independence in 1776.",
    traditions: "People celebrate with fireworks, parades, picnics, and community events.",
    fun: "The Declaration announced that the thirteen colonies considered themselves independent from Britain."
  }
};

document.addEventListener("click", function(event) {
  const button = event.target.closest("[data-holiday]");

  if (!button) return;

  const holiday = holidayInfo[button.dataset.holiday];

  if (!holiday) return;

  const details = document.getElementById("holiday-details");

  details.replaceChildren();

  const title = document.createElement("h3");
  title.textContent = holiday.title;

  const origin = document.createElement("p");
  origin.textContent = "📖 HISTORY: " + holiday.origin;

  const traditions = document.createElement("p");
  traditions.textContent = "🎉 TRADITIONS: " + holiday.traditions;

  const fun = document.createElement("p");
  fun.textContent = "⭐ FUN FACT: " + holiday.fun;

  details.append(title, origin, traditions, fun);

  details.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
});// HOLIDAY COUNTDOWN CALENDAR

function getDaysUntil(month, day) {
  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  let target = new Date(now.getFullYear(), month - 1, day);

  if (target < today) {
    target = new Date(now.getFullYear() + 1, month - 1, day);
  }

  return Math.round((target - today) / 86400000);
}

function getThanksgivingDate(year) {
  const novemberFirst = new Date(year, 10, 1);
  const firstThursday = 1 + ((4 - novemberFirst.getDay() + 7) % 7);

  return new Date(year, 10, firstThursday + 21);
}

function getDaysUntilThanksgiving() {
  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  let thanksgiving = getThanksgivingDate(now.getFullYear());

  if (thanksgiving < today) {
    thanksgiving = getThanksgivingDate(now.getFullYear() + 1);
  }

  return Math.round((thanksgiving - today) / 86400000);
}

function countdownText(days) {
  if (days === 0) return "🎉 Today!";
  if (days === 1) return "Tomorrow!";
  return days + " days to go!";
}

function updateHolidayCountdowns() {
  document.getElementById("halloween-countdown").textContent =
    countdownText(getDaysUntil(10, 31));

  document.getElementById("thanksgiving-countdown").textContent =
    countdownText(getDaysUntilThanksgiving());

  document.getElementById("christmas-countdown").textContent =
    countdownText(getDaysUntil(12, 25));

  document.getElementById("newyear-countdown").textContent =
    countdownText(getDaysUntil(1, 1));

  document.getElementById("valentines-countdown").textContent =
    countdownText(getDaysUntil(2, 14));

  document.getElementById("independence-countdown").textContent =
    countdownText(getDaysUntil(7, 4));
}

updateHolidayCountdowns();// HISTORICAL MYSTERY GAME

const historicalMysteries = [
  {
    title: "Mystery #1: The Lost City",
    story: "An ancient civilization built an incredible city high in the Andes Mountains. It became widely known to the outside world in 1911.",
    clue: "This famous city is located in modern-day Peru.",
    answers: ["Rome", "Machu Picchu", "Babylon"],
    correct: "Machu Picchu",
    explanation: "Correct! Machu Picchu was built by the Inca civilization."
  },
  {
    title: "Mystery #2: The Great Pyramid",
    story: "A massive ancient structure was built as a tomb for an Egyptian pharaoh.",
    clue: "It stands at Giza and is the only surviving Wonder of the Ancient World.",
    answers: ["Great Pyramid of Giza", "Colosseum", "Parthenon"],
    correct: "Great Pyramid of Giza",
    explanation: "Correct! The Great Pyramid was built for Pharaoh Khufu."
  },
  {
    title: "Mystery #3: The Ancient Olympics",
    story: "Athletes traveled from across the Greek world to compete in sporting events.",
    clue: "These games began in ancient Greece at a place called Olympia.",
    answers: ["Roman Games", "Ancient Olympic Games", "Gladiator Trials"],
    correct: "Ancient Olympic Games",
    explanation: "Correct! The ancient Olympic Games were held at Olympia."
  },
  {
    title: "Mystery #4: The First Moon Landing",
    story: "In 1969, astronauts made history by reaching the Moon.",
    clue: "Neil Armstrong and Buzz Aldrin were part of this famous mission.",
    answers: ["Apollo 11", "Apollo 13", "Gemini 4"],
    correct: "Apollo 11",
    explanation: "Correct! Apollo 11 landed on the Moon in July 1969."
  }
];

let mysteryIndex = 0;
let mysteryPoints = 0;
let mysteryAnswered = false;

function showMystery() {
  const mystery = historicalMysteries[mysteryIndex];

  document.getElementById("mystery-title").textContent = mystery.title;
  document.getElementById("mystery-story").textContent = mystery.story;
  document.getElementById("mystery-clue").textContent = mystery.clue;
  document.getElementById("mystery-feedback").textContent = "Choose your answer!";
  document.getElementById("mystery-score").textContent =
    "⭐ Score: " + mysteryPoints;

  const answersBox = document.getElementById("mystery-answers");
  answersBox.innerHTML = "";

  mystery.answers.forEach(function(answer) {
    const button = document.createElement("button");
    button.className = "mystery-answer";
    button.textContent = answer;
    button.dataset.answer = answer;

    button.addEventListener("click", function() {
      checkMysteryAnswer(answer);
    });

    answersBox.appendChild(button);
  });

  document.getElementById("next-mystery").disabled = true;
  mysteryAnswered = false;
}

function checkMysteryAnswer(answer) {
  if (mysteryAnswered) return;

  mysteryAnswered = true;

  const mystery = historicalMysteries[mysteryIndex];
  const feedback = document.getElementById("mystery-feedback");

  if (answer === mystery.correct) {
    mysteryPoints += 10;
    feedback.textContent = "🎉 " + mystery.explanation;
  } else {
    feedback.textContent =
      "Not quite! The answer was " + mystery.correct + ". " +
      mystery.explanation;
  }

  document.getElementById("mystery-score").textContent =
    "⭐ Score: " + mysteryPoints;

  document.querySelectorAll(".mystery-answer").forEach(function(button) {
    button.disabled = true;
  });

  const nextButton = document.getElementById("next-mystery");
  nextButton.disabled = false;

  if (mysteryIndex === historicalMysteries.length - 1) {
    nextButton.textContent = "See Final Score 🏆";
  }
}

function nextMystery() {
  if (!mysteryAnswered) return;

  if (mysteryIndex < historicalMysteries.length - 1) {
    mysteryIndex++;
    showMystery();
  } else {
    document.getElementById("mystery-title").textContent =
      "🏆 Mystery Game Complete!";
    document.getElementById("mystery-story").textContent =
      "You solved all the historical mysteries!";
    document.getElementById("mystery-clue").textContent =
      "Your final score is " + mysteryPoints + " out of 40 points!";
    document.getElementById("mystery-answers").innerHTML = "";
    document.getElementById("mystery-feedback").textContent =
      "Amazing detective work!";
    document.getElementById("next-mystery").textContent = "Play Again 🔄";
    document.getElementById("next-mystery").disabled = false;
    document.getElementById("next-mystery").onclick = restartMystery;
  }
}

function restartMystery() {
  mysteryIndex = 0;
  mysteryPoints = 0;
  mysteryAnswered = false;

  document.getElementById("next-mystery").textContent = "Next Mystery ➡️";
  document.getElementById("next-mystery").onclick = nextMystery;

  showMystery();
}

document.getElementById("next-mystery").onclick = nextMystery;

showMystery();// HISTORY HUB LEADERBOARD

let leaderboardScores = [];

try {
  leaderboardScores = JSON.parse(
    localStorage.getItem("historyHubLeaderboard")
  ) || [];
} catch (error) {
  leaderboardScores = [];
}

function displayLeaderboard() {
  const list = document.getElementById("leaderboard-list");

  leaderboardScores.sort(function(a, b) {
    return b.score - a.score;
  });

  list.innerHTML = "";

  if (leaderboardScores.length === 0) {
    list.textContent = "No players yet. Be the first!";
    return;
  }

  leaderboardScores.forEach(function(player, index) {
    const row = document.createElement("div");
    row.className = "leaderboard-row";

    const rank = document.createElement("span");
    rank.className = "leaderboard-rank";
    rank.textContent = ["🥇", "🥈", "🥉"][index] || (index + 1) + ".";

    const name = document.createElement("span");
    name.textContent = player.name;

    const score = document.createElement("strong");
    score.textContent = player.score + " points";

    row.append(rank, name, score);
    list.appendChild(row);
  });
}

document.getElementById("save-score").addEventListener("click", function() {
  const nameInput = document.getElementById("player-name");
  const message = document.getElementById("leaderboard-message");

  const name = nameInput.value.trim();

  if (!name) {
    message.textContent = "Please enter a player name first!";
    return;
  }

  // Use the current mystery-game score.
  const score = typeof mysteryPoints === "number" ? mysteryPoints : 0;

  const existingPlayer = leaderboardScores.find(function(player) {
    return player.name.toLowerCase() === name.toLowerCase();
  });

  if (existingPlayer) {
    existingPlayer.score = Math.max(existingPlayer.score, score);
  } else {
    leaderboardScores.push({
      name: name,
      score: score
    });
  }

  try {
    localStorage.setItem(
      "historyHubLeaderboard",
      JSON.stringify(leaderboardScores)
    );

    message.textContent = "🏆 Your score has been saved!";
  } catch (error) {
    message.textContent = "Your browser couldn't save the score.";
  }

  nameInput.value = "";
  displayLeaderboard();
});

displayLeaderboard();
// HISTORY HUB FEATURED DISCOVERIES

const featuredDiscoveries = document.querySelectorAll(".featured-ad");

featuredDiscoveries.forEach(function(card) {
  const label = document.createElement("span");

  label.textContent = "⭐ FEATURED";
  label.style.display = "inline-block";
  label.style.fontSize = "12px";
  label.style.color = "#ffd700";
  label.style.marginBottom = "12px";
  label.style.fontWeight = "bold";

  card.insertBefore(label, card.firstChild);
});


// EXTRA HISTORY MINI GAMES
const yearRounds = [
  { question: "In what year did the first Moon landing happen?", answer: "1969", choices: ["1492", "1776", "1969"] },
  { question: "In what year was the Declaration of Independence adopted?", answer: "1776", choices: ["1066", "1776", "1865"] },
  { question: "In what year did World War II end?", answer: "1945", choices: ["1918", "1939", "1945"] },
  { question: "In what year did the Berlin Wall fall?", answer: "1989", choices: ["1961", "1989", "2001"] },
  { question: "In what year did the ancient Olympic Games begin (traditionally)?", answer: "776 BC", choices: ["776 BC", "44 BC", "500 AD"] }
];
const truthRounds = [
  { question: "The Great Wall of China was built over many centuries.", answer: true, fact: "Different sections were built and rebuilt over many centuries." },
  { question: "Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid.", answer: true, fact: "Cleopatra lived around 2,500 years after the Great Pyramid was built." },
  { question: "The Roman Empire had cars.", answer: false, fact: "Romans travelled by foot, horses, carts, and ships—not cars." },
  { question: "The first modern Olympic Games were held in 1896.", answer: true, fact: "The first modern games took place in Athens, Greece." },
  { question: "The dinosaurs lived at the same time as ancient Egyptian pharaohs.", answer: false, fact: "Non-avian dinosaurs became extinct millions of years before ancient Egypt." }
];
const whoRounds = [
  { question: "I was an Egyptian queen known for my connection with Julius Caesar and Mark Antony. Who am I?", answer: "Cleopatra", choices: ["Cleopatra", "Joan of Arc", "Queen Victoria"] },
  { question: "I led a nonviolent movement for India's independence. Who am I?", answer: "Mahatma Gandhi", choices: ["Nelson Mandela", "Mahatma Gandhi", "Winston Churchill"] },
  { question: "I was the first person to walk on the Moon. Who am I?", answer: "Neil Armstrong", choices: ["Yuri Gagarin", "Neil Armstrong", "Buzz Aldrin"] },
  { question: "I was a French military leader who became emperor in 1804. Who am I?", answer: "Napoleon Bonaparte", choices: ["Napoleon Bonaparte", "Julius Caesar", "Alexander the Great"] },
  { question: "I was a famous nurse during the Crimean War, known as the Lady with the Lamp. Who am I?", answer: "Florence Nightingale", choices: ["Florence Nightingale", "Amelia Earhart", "Harriet Tubman"] }
];
let yearIndex = 0, truthIndex = 0, whoIndex = 0;
let yearPoints = 0, truthPoints = 0, whoPoints = 0;
let yearAnswered = false, truthAnswered = false, whoAnswered = false;

function showYearRound() {
  const round = yearRounds[yearIndex % yearRounds.length];
  document.getElementById("year-question").textContent = round.question;
  const area = document.getElementById("year-answers");
  area.replaceChildren();
  round.choices.forEach(choice => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = choice;
    button.addEventListener("click", () => {
      if (yearAnswered) return;
      yearAnswered = true;
      const correct = choice === round.answer;
      if (correct) yearPoints++;
      document.getElementById("year-feedback").textContent = correct ? "🎉 Correct! Great job." : "Not quite! The answer is " + round.answer + ".";
      document.getElementById("year-score").textContent = "Score: " + yearPoints;
      document.getElementById("year-next").hidden = false;
      area.querySelectorAll("button").forEach(b => b.disabled = true);
    });
    area.appendChild(button);
  });
  yearAnswered = false;
  document.getElementById("year-feedback").textContent = "Choose the correct year.";
  document.getElementById("year-next").hidden = true;
}
function showTruthRound() {
  const round = truthRounds[truthIndex % truthRounds.length];
  document.getElementById("truth-question").textContent = round.question;
  document.getElementById("truth-feedback").textContent = "Pick an answer!";
  document.getElementById("truth-next").hidden = true;
  document.querySelectorAll("[data-truth]").forEach(button => {
    button.disabled = false;
    button.onclick = () => {
      if (truthAnswered) return;
      truthAnswered = true;
      const correct = button.dataset.truth === String(round.answer);
      if (correct) truthPoints++;
      document.getElementById("truth-feedback").textContent = (correct ? "🎉 Correct! " : "Not quite. ") + round.fact;
      document.getElementById("truth-score").textContent = "Score: " + truthPoints;
      document.getElementById("truth-next").hidden = false;
      document.querySelectorAll("[data-truth]").forEach(b => b.disabled = true);
    };
  });
  truthAnswered = false;
}
function showWhoRound() {
  const round = whoRounds[whoIndex % whoRounds.length];
  document.getElementById("who-question").textContent = round.question;
  const area = document.getElementById("who-answers");
  area.replaceChildren();
  round.choices.forEach(choice => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = choice;
    button.addEventListener("click", () => {
      if (whoAnswered) return;
      whoAnswered = true;
      const correct = choice === round.answer;
      if (correct) whoPoints++;
      document.getElementById("who-feedback").textContent = correct ? "🎉 That's right!" : "Good try! The answer is " + round.answer + ".";
      document.getElementById("who-score").textContent = "Score: " + whoPoints;
      document.getElementById("who-next").hidden = false;
      area.querySelectorAll("button").forEach(b => b.disabled = true);
    });
    area.appendChild(button);
  });
  whoAnswered = false;
  document.getElementById("who-feedback").textContent = "Who is it?";
  document.getElementById("who-next").hidden = true;
}
document.getElementById("year-next").addEventListener("click", () => { yearIndex++; showYearRound(); });
document.getElementById("truth-next").addEventListener("click", () => { truthIndex++; showTruthRound(); });
document.getElementById("who-next").addEventListener("click", () => { whoIndex++; showWhoRound(); });
showYearRound();
showTruthRound();
showWhoRound();


/* DAILY HISTORY REFRESHERS */
const historyRefreshers = [
{title:"The Great Pyramid",text:"The Great Pyramid of Giza was built for Pharaoh Khufu around 4,500 years ago.",question:"Which pharaoh was the Great Pyramid built for?",answer:"Pharaoh Khufu."},
{title:"Ancient Olympic Games",text:"The ancient Olympic Games were held at Olympia in Greece and were connected with religious festivals.",question:"Where were the ancient Olympic Games held?",answer:"Olympia, Greece."},
{title:"The Roman Empire",text:"Augustus became the first Roman emperor in 27 BCE, after years of political conflict.",question:"Who is traditionally considered the first Roman emperor?",answer:"Augustus."},
{title:"American Independence",text:"The Declaration of Independence was adopted by the American colonies on July 4, 1776.",question:"What year was the Declaration of Independence adopted?",answer:"1776."},
{title:"The Moon Landing",text:"Apollo 11 landed on the Moon in July 1969. Neil Armstrong and Buzz Aldrin walked on its surface.",question:"What mission first landed people on the Moon?",answer:"Apollo 11."},
{title:"The Printing Press",text:"Johannes Gutenberg's movable-type printing press helped books spread more widely in Europe during the 15th century.",question:"What invention helped books spread more widely in Europe?",answer:"The movable-type printing press."},
{title:"The Viking Age",text:"Viking communities came from Scandinavia. They were sailors, traders, craftspeople, farmers, and explorers.",question:"From which region did Vikings come?",answer:"Scandinavia."},
{title:"Ancient Greece",text:"Ancient Greece consisted of city-states such as Athens and Sparta, each with its own government and customs.",question:"Name one famous ancient Greek city-state.",answer:"Athens or Sparta."},
{title:"The Nile River",text:"The Nile provided water, fertile soil, and transportation that supported ancient Egyptian civilization.",question:"Which river helped ancient Egyptian civilization thrive?",answer:"The Nile River."},
{title:"World War II",text:"World War II lasted from 1939 to 1945 and involved countries across the world.",question:"What years did World War II last?",answer:"1939–1945."},
{title:"The Great Wall",text:"Different sections of the Great Wall of China were built and connected over many centuries.",question:"In which country is the Great Wall?",answer:"China."},
{title:"The Maya",text:"Maya civilization developed in parts of Mesoamerica and made important advances in writing, mathematics, and astronomy.",question:"Name one area where the Maya made important advances.",answer:"Writing, mathematics, or astronomy."}
];
let refresherIndex = 0;
function getRefresherDay() {
  const now = new Date();
  return now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0")+"-"+String(now.getDate()).padStart(2,"0");
}
function renderRefresher(index) {
  const item = historyRefreshers[index];
  document.getElementById("refresherTitle").textContent = item.title;
  document.getElementById("refresherText").textContent = item.text;
  document.getElementById("refresherQuestion").textContent = "🧠 Memory check: "+item.question;
  document.getElementById("refresherAnswer").textContent = "Answer: "+item.answer;
  document.getElementById("refresherQuestion").hidden = true;
  document.getElementById("refresherAnswer").hidden = true;
  document.getElementById("refresherReveal").hidden = false;
}
function revealRefresher() {
  document.getElementById("refresherQuestion").hidden = false;
  document.getElementById("refresherAnswer").hidden = false;
  document.getElementById("refresherReveal").hidden = true;
}
function showAnotherRefresher() {
  refresherIndex = (refresherIndex + 1) % historyRefreshers.length;
  renderRefresher(refresherIndex);
}
function initDailyRefresher() {
  const today = getRefresherDay();
  const dateLabel = document.getElementById("refresherDate");
  if (dateLabel) dateLabel.textContent = "DAILY REFRESHER • "+new Date().toLocaleDateString(undefined,{month:"long",day:"numeric",year:"numeric"});
  const dayNumber = Math.floor(new Date(today+"T00:00:00").getTime()/86400000);
  refresherIndex = ((dayNumber % historyRefreshers.length)+historyRefreshers.length)%historyRefreshers.length;
  renderRefresher(refresherIndex);
}
initDailyRefresher();
