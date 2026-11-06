
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

  const query = input.value.trim().toLowerCase();
  results.replaceChildren();

  if (!query) {
    const message = document.createElement("p");
    message.textContent = "Type a history topic, person, place, or event to search.";
    results.appendChild(message);
    input.focus();
    return;
  }

  const normalize = value => String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const stopWords = new Set([
    "who","what","when","where","why","how","is","are","was","were","the","a","an",
    "did","do","does","in","of","to","for","and","or","built","tell","me","about",
    "can","you","which","this","that","from","with","on","by","it","its","i","history"
  ]);
  const terms = normalize(query).split(" ").filter(word => word.length > 1 && !stopWords.has(word));
  const entries = [];

  // Main topic cards
  if (typeof topics !== "undefined") {
    Object.entries(topics).forEach(([key, item]) => {
      entries.push({
        title: item.title || key,
        text: item.text || "",
        action: () => openTopic(key),
        label: "History topic"
      });
    });
  }

  // Encyclopedia articles, including the longer articles
  if (typeof encyclopediaArticles !== "undefined") {
    Object.entries(encyclopediaArticles).forEach(([key, item]) => {
      entries.push({
        title: item.title || key,
        text: item.text || "",
        action: () => readArticle(key),
        label: "Encyclopedia article"
      });
    });
  }

  // Historical Event of the Day entries
  if (typeof historyEvents !== "undefined") {
    historyEvents.forEach(item => entries.push({
      title: item.title,
      text: [item.date, item.description, item.extra].join(" "),
      action: () => document.getElementById("event-of-day")?.scrollIntoView({behavior:"smooth"}),
      label: "Historical event"
    }));
  }

  // Daily refreshers
  if (typeof historyRefreshers !== "undefined") {
    historyRefreshers.forEach(item => entries.push({
      title: item.title,
      text: [item.text, item.question, item.answer].join(" "),
      action: () => document.getElementById("daily-refreshers")?.scrollIntoView({behavior:"smooth"}),
      label: "Daily refresher"
    }));
  }

  // Timeline entries already shown on the page
  document.querySelectorAll(".timeline-item").forEach(item => {
    const title = item.querySelector("h3")?.textContent || "History timeline";
    entries.push({
      title,
      text: item.textContent,
      action: () => item.scrollIntoView({behavior:"smooth", block:"center"}),
      label: "Timeline"
    });
  });

  const scored = entries.map(item => {
    const title = normalize(item.title);
    const text = normalize(item.text);
    const full = title + " " + text;
    let score = 0;
    if (full.includes(normalize(query))) score += 8;
    terms.forEach(term => {
      if (title.includes(term)) score += 4;
      else if (text.includes(term)) score += 1;
    });
    return {...item, score};
  }).filter(item => item.score > 0)
    .sort((a,b) => b.score - a.score)
    .slice(0, 12);

  const heading = document.createElement("h2");
  heading.textContent = "Search Results";
  results.appendChild(heading);

  if (!scored.length) {
    const message = document.createElement("p");
    message.textContent = "No results found. Try a person, place, civilization, or event—like Cleopatra, Egypt, Rome, Vikings, pyramids, or the Moon landing.";
    results.appendChild(message);
    results.scrollIntoView({behavior:"smooth", block:"nearest"});
    return;
  }

  const summary = document.createElement("p");
  summary.textContent = "Found " + scored.length + " result" + (scored.length === 1 ? "" : "s") + " for “" + query + "”.";
  results.appendChild(summary);

  const list = document.createElement("div");
  list.className = "search-result-list";
  scored.forEach(item => {
    const card = document.createElement("article");
    card.className = "search-result-card";
    const category = document.createElement("span");
    category.className = "search-result-label";
    category.textContent = item.label;
    const title = document.createElement("h3");
    title.textContent = item.title;
    const snippet = document.createElement("p");
    const plainText = String(item.text || "").replace(/\s+/g, " ").trim();
    snippet.textContent = plainText.length > 190 ? plainText.slice(0,187) + "..." : plainText;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Open result →";
    button.addEventListener("click", item.action);
    card.append(category,title,snippet,button);
    list.appendChild(card);
  });
  results.appendChild(list);
  results.scrollIntoView({behavior:"smooth", block:"nearest"});
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


  medieval: {
    title: "🏰 Medieval Europe: Castles, Communities, and Change",
    text: `The period often called the Middle Ages in Europe lasted roughly from the fifth century to the fifteenth century. It was not one unchanging era: kingdoms rose and fell, cities expanded, and trade connected distant communities.

Many people lived in villages and worked in farming. Towns were also home to merchants, craftspeople, and markets. Castles could serve as homes, administrative centers, and defensive strongholds, while monasteries preserved books and supported learning.

The medieval world was connected to regions far beyond Europe. Goods, knowledge, and ideas traveled through trade networks across Africa, Asia, and the Mediterranean. The Silk Road was one famous network, not a single road.

The Middle Ages also saw the growth of universities, new styles of architecture, and major changes in agriculture and commerce. Studying the period helps explain how modern countries, languages, and institutions developed.`
  },
  china: {
    title: "🧧 Imperial China: Dynasties and Inventions",
    text: `Chinese history spans thousands of years and includes many dynasties, each with its own achievements and challenges. The Qin dynasty unified much of China in 221 BCE, while later dynasties developed government systems, cities, art, and trade.

China made influential contributions to technology and culture. Paper, printing, the compass, and gunpowder were developed in China over different periods and later spread through trade and cultural exchange.

The Silk Road connected China with Central Asia, the Middle East, and regions farther west. Traders carried silk and other goods, while travelers also exchanged ideas, religious traditions, and technologies.

China's history is too broad to fit into one story. Its many regions, languages, inventions, and traditions shaped East Asia and influenced the wider world.`
  },
  renaissance: {
    title: "🎨 The Renaissance: A Revival of Art and Ideas",
    text: `The Renaissance was a period of cultural and intellectual change that began in parts of Italy around the fourteenth century and spread through Europe over time. The word Renaissance means “rebirth,” reflecting renewed interest in ancient Greek and Roman art, writing, and learning.

Artists studied anatomy, perspective, light, and the natural world to create more lifelike works. Leonardo da Vinci explored art and science, while Michelangelo created celebrated sculptures and paintings. Many other artists, writers, and thinkers also contributed.

The Renaissance was not only about art. Scholars studied history, mathematics, literature, and science. The spread of printing helped books and ideas reach more readers.

The period encouraged new ways of looking at human creativity and knowledge, although changes happened unevenly across different places and communities.`
  },
  industrial: {
    title: "🏭 The Industrial Revolution: A World Transformed",
    text: `The Industrial Revolution began in Britain in the eighteenth century and gradually spread to other parts of the world. New machines and power sources changed how goods were made.

Factories increasingly produced items that had once been made by hand in small workshops or homes. Steam engines powered machinery and transportation, including trains and ships. These changes helped cities and industries grow rapidly.

Industrialization created new jobs and made many products more widely available, but it also brought difficult conditions. Workers often faced long hours, dangerous workplaces, and crowded urban housing. Over time, labor movements and reforms pushed for improvements.

The Industrial Revolution reshaped transportation, communication, economies, and everyday life. Its effects continue to influence the modern world.`
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

/* HISTORY TRIVIA ARENA */
const triviaQuestions = [
 {category:"Ancient Egypt",q:"Which river was central to ancient Egyptian life?",options:["Amazon","Nile","Danube","Yellow River"],answer:1,why:"The Nile provided water, fertile soil, and transportation."},
 {category:"Ancient Greece",q:"Where were the ancient Olympic Games held?",options:["Athens","Sparta","Olympia","Corinth"],answer:2,why:"The games were held at Olympia in Greece."},
 {category:"Ancient Rome",q:"What language was widely used in the Roman Empire in the west?",options:["Latin","Maya","Sanskrit","Old Norse"],answer:0,why:"Latin was the language of Roman administration and culture in the western empire."},
 {category:"Exploration",q:"Which ship carried Charles Darwin on his famous voyage?",options:["Mayflower","HMS Beagle","Santa Maria","Endeavour"],answer:1,why:"Darwin traveled aboard HMS Beagle during its voyage in the 1830s."},
 {category:"American History",q:"In what year was the Declaration of Independence adopted?",options:["1492","1620","1776","1865"],answer:2,why:"The Second Continental Congress adopted it on July 4, 1776."},
 {category:"Space History",q:"What was the name of the mission that first landed people on the Moon?",options:["Apollo 8","Apollo 11","Gemini 4","Voyager 1"],answer:1,why:"Apollo 11 landed on the Moon in July 1969."},
 {category:"World History",q:"The Silk Road was best described as what?",options:["One paved highway","A network of trade routes","A Roman aqueduct","A Viking ship"],answer:1,why:"It was a network of routes linking regions across Asia and beyond."},
 {category:"Inventions",q:"Which invention helped books spread more widely in Europe?",options:["Movable-type printing press","Steam locomotive","Telephone","Radio"],answer:0,why:"Printing made it easier to produce multiple copies of books."},
 {category:"Medieval History",q:"What was a common purpose of a medieval castle?",options:["Only a marketplace","Residence and defense","A modern factory","A space observatory"],answer:1,why:"Castles could serve as residences, administrative centers, and defensive structures."},
 {category:"Renaissance",q:"Which artist painted the Mona Lisa?",options:["Raphael","Leonardo da Vinci","Donatello","Vincent van Gogh"],answer:1,why:"Leonardo da Vinci painted the Mona Lisa."}
];
let triviaIndex=0, triviaPoints=0, triviaAnswered=false;
function renderTrivia(){
 const qEl=document.getElementById("trivia-question"), optionsEl=document.getElementById("trivia-options");
 if(!qEl||!optionsEl)return;
 const q=triviaQuestions[triviaIndex];
 document.getElementById("trivia-category").textContent=q.category;
 document.getElementById("trivia-progress").textContent="Question "+(triviaIndex+1)+" / "+triviaQuestions.length;
 qEl.textContent=q.q; optionsEl.replaceChildren();
 document.getElementById("trivia-feedback").textContent="Choose your answer!";
 document.getElementById("trivia-score").textContent=triviaPoints;
 document.getElementById("trivia-next").hidden=true;document.getElementById("trivia-restart").hidden=true;
 triviaAnswered=false;
 q.options.forEach((option,index)=>{
  const btn=document.createElement("button");btn.type="button";btn.textContent=option;
  btn.addEventListener("click",()=>{
   if(triviaAnswered)return;triviaAnswered=true;
   const correct=index===q.answer;if(correct)triviaPoints++;
   document.getElementById("trivia-feedback").textContent=(correct?"🎉 Correct! ":"Good try! ")+q.why+(correct?"":" Correct answer: "+q.options[q.answer]+".");
   document.getElementById("trivia-score").textContent=triviaPoints;
   optionsEl.querySelectorAll("button").forEach(b=>b.disabled=true);
   if(triviaIndex===triviaQuestions.length-1){document.getElementById("trivia-next").hidden=true;document.getElementById("trivia-restart").hidden=false;document.getElementById("trivia-feedback").textContent+=" Final score: "+triviaPoints+" / "+triviaQuestions.length+"!";}
   else document.getElementById("trivia-next").hidden=false;
  });optionsEl.appendChild(btn);
 });
}
function nextTrivia(){triviaIndex++;renderTrivia();}
function restartTrivia(){triviaIndex=0;triviaPoints=0;renderTrivia();}
document.getElementById("trivia-next")?.addEventListener("click",nextTrivia);
document.getElementById("trivia-restart")?.addEventListener("click",restartTrivia);
renderTrivia();



// HISTORY TIME MACHINE
const timeMachineEvents = [
  {year:-3000,title:"The First Dynasties of Egypt",emoji:"🏺",text:"Around this time, ancient Egypt was becoming a unified kingdom along the Nile. Early rulers helped establish traditions that would shape Egyptian civilization for thousands of years."},
  {year:-2560,title:"The Great Pyramid Takes Shape",emoji:"🔺",text:"The Great Pyramid of Giza was built as a royal tomb for Pharaoh Khufu. It became the only surviving wonder of the ancient world's original Seven Wonders."},
  {year:-776,title:"The Ancient Olympic Games",emoji:"🏅",text:"The first recorded ancient Olympic Games were held at Olympia in Greece. Athletic contests honored Zeus and brought competitors together from Greek communities."},
  {year:-44,title:"The Assassination of Julius Caesar",emoji:"🏛️",text:"Julius Caesar was killed in Rome in 44 BCE. The event led to further conflict and helped bring an end to the Roman Republic."},
  {year:79,title:"Mount Vesuvius Erupts",emoji:"🌋",text:"Mount Vesuvius erupted and buried Pompeii and nearby Roman towns under volcanic material. Archaeological discoveries later revealed details of everyday Roman life."},
  {year:476,title:"The Western Roman Empire Falls",emoji:"🛡️",text:"In 476 CE, the last western Roman emperor was removed from power. The eastern Roman Empire continued for many centuries."},
  {year:1066,title:"The Norman Conquest of England",emoji:"🏰",text:"William, Duke of Normandy, defeated the English army at the Battle of Hastings and became king. The conquest changed England's language, government, and culture."},
  {year:1215,title:"The Magna Carta",emoji:"📜",text:"King John of England agreed to the Magna Carta. It set out limits on royal authority and became an important symbol in the history of law."},
  {year:1492,title:"A Voyage Across the Atlantic",emoji:"⛵",text:"Christopher Columbus's expedition reached the Caribbean in 1492. The voyage began a period of sustained contact, conquest, exchange, and enormous change between Europe and the Americas."},
  {year:1776,title:"The Declaration of Independence",emoji:"🗽",text:"On July 4, 1776, the Second Continental Congress adopted the Declaration of Independence, announcing that the thirteen colonies regarded themselves as independent states."},
  {year:1865,title:"The American Civil War Ends",emoji:"🕊️",text:"The Confederacy's defeat brought the American Civil War to a close in 1865. The nation faced the difficult work of ending slavery and rebuilding."},
  {year:1969,title:"Humans Walk on the Moon",emoji:"🌕",text:"Apollo 11 astronauts landed on the Moon in July 1969. Neil Armstrong and Buzz Aldrin walked on its surface while Michael Collins orbited above."},
  {year:1989,title:"The Berlin Wall Opens",emoji:"🧱",text:"In November 1989, border crossings in Berlin opened after weeks of peaceful demonstrations and political change. The wall had divided the city for decades."},
  {year:2000,title:"A New Millennium Begins",emoji:"🎆",text:"The year 2000 was widely celebrated as the start of a new millennium, even though the third millennium technically began on January 1, 2001."}
];
function setTimeYear(year){
  const input=document.getElementById("time-year");
  if(input){input.value=year;travelThroughTime();}
}
function travelThroughTime(){
  const input=document.getElementById("time-year");
  const result=document.getElementById("time-machine-result");
  if(!input||!result)return;
  const year=Number(input.value);
  if(input.value.trim()===""||!Number.isInteger(year)||year < -3000||year > 2026){
    result.innerHTML="<span class='time-machine-label'>TIME TRAVEL ERROR</span><h3>🌀 That year is outside our time range</h3><p>Choose a whole year between 3000 BCE and 2026 CE.</p>";
    return;
  }
  const event=timeMachineEvents.reduce((best,item)=>Math.abs(item.year-year)<Math.abs(best.year-year)?item:best,timeMachineEvents[0]);
  const formatYear=value=>value<0?Math.abs(value)+" BCE":value+" CE";
  const distance=Math.abs(event.year-year);
  result.innerHTML="";
  const label=document.createElement("span");label.className="time-machine-label";label.textContent="🚀 ARRIVED AT "+formatYear(event.year);
  const heading=document.createElement("h3");heading.textContent=event.emoji+" "+event.title;
  const date=document.createElement("p");date.className="time-machine-date";date.textContent="Closest featured event to "+formatYear(year)+(distance?" · "+distance+" year"+(distance===1?"":"s")+" away":"");
  const description=document.createElement("p");description.textContent=event.text;
  result.append(label,heading,date,description);
}


// HISTORY FLASHCARDS
const historyFlashcards = [
  {q:"Who was the first Roman emperor?",a:"Augustus, who became emperor in 27 BCE."},
  {q:"Which river was essential to ancient Egyptian civilization?",a:"The Nile River provided water, fertile soil, and transportation."},
  {q:"What city hosted the ancient Olympic Games?",a:"Olympia, in ancient Greece."},
  {q:"Who wrote the Magna Carta into law by agreeing to it in 1215?",a:"King John of England agreed to the Magna Carta."},
  {q:"What year did the first people land on the Moon?",a:"1969, during NASA's Apollo 11 mission."},
  {q:"What was the Silk Road?",a:"A network of trade routes connecting regions of Asia, Europe, and Africa."},
  {q:"Which civilization built Machu Picchu?",a:"The Inca civilization, in the Andes of modern-day Peru."},
  {q:"What invention helped books spread more widely in Europe?",a:"The movable-type printing press associated with Johannes Gutenberg."},
  {q:"What year did the Berlin Wall open?",a:"1989, after peaceful demonstrations and political changes."},
  {q:"Which ancient Greek city-state is often associated with the beginnings of democracy?",a:"Athens."},
  {q:"What was the name of the ship Charles Darwin sailed on during his famous voyage?",a:"HMS Beagle."},
  {q:"In what year was the Declaration of Independence adopted?",a:"1776."}
];
let flashcardIndex = 0;
let flashcardOrder = historyFlashcards.map((_, index) => index);
function renderFlashcard() {
  const question = document.getElementById("flashcard-question");
  const answer = document.getElementById("flashcard-answer");
  const count = document.getElementById("flashcard-count");
  if (!question || !answer || !count) return;
  const card = historyFlashcards[flashcardOrder[flashcardIndex]];
  question.textContent = card.q;
  answer.textContent = card.a;
  answer.hidden = true;
  count.textContent = "CARD " + (flashcardIndex + 1) + " OF " + historyFlashcards.length;
  document.getElementById("flashcard-reveal").textContent = "Reveal Answer";
}
document.getElementById("flashcard-reveal")?.addEventListener("click", () => {
  const answer = document.getElementById("flashcard-answer");
  if (!answer) return;
  answer.hidden = !answer.hidden;
  document.getElementById("flashcard-reveal").textContent = answer.hidden ? "Reveal Answer" : "Hide Answer";
});
document.getElementById("flashcard-next")?.addEventListener("click", () => {
  flashcardIndex = (flashcardIndex + 1) % flashcardOrder.length;
  renderFlashcard();
});
document.getElementById("flashcard-shuffle")?.addEventListener("click", () => {
  for (let i = flashcardOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flashcardOrder[i], flashcardOrder[j]] = [flashcardOrder[j], flashcardOrder[i]];
  }
  flashcardIndex = 0;
  renderFlashcard();
});
renderFlashcard();

// PERSONAL TIMELINE BUILDER
const timelineStorageKey = "historyHubCustomTimeline";
let customTimelineEvents = [];
try {
  const savedTimeline = JSON.parse(localStorage.getItem(timelineStorageKey) || "[]");
  if (Array.isArray(savedTimeline)) customTimelineEvents = savedTimeline.filter(item =>
    item && Number.isInteger(item.year) && typeof item.title === "string" &&
    typeof item.description === "string"
  );
} catch (error) {
  customTimelineEvents = [];
}
function formatCustomTimelineYear(year) {
  return year < 0 ? Math.abs(year) + " BCE" : year + " CE";
}
function renderCustomTimeline() {
  const list = document.getElementById("custom-timeline-list");
  if (!list) return;
  list.replaceChildren();
  if (!customTimelineEvents.length) {
    const empty = document.createElement("p");
    empty.textContent = "Your timeline is ready for its first event!";
    list.appendChild(empty);
    return;
  }
  [...customTimelineEvents].sort((a,b) => a.year - b.year).forEach((item,index) => {
    const entry = document.createElement("article");
    entry.className = "custom-timeline-entry";
    const year = document.createElement("span");
    year.className = "custom-year";
    year.textContent = formatCustomTimelineYear(item.year);
    const title = document.createElement("h3");
    title.textContent = item.title;
    const description = document.createElement("p");
    description.textContent = item.description;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", "Remove " + item.title);
    remove.addEventListener("click", () => {
      customTimelineEvents.splice(index, 1);
      saveCustomTimeline();
    });
    entry.append(year,title,description,remove);
    list.appendChild(entry);
  });
}
function saveCustomTimeline() {
  try {
    localStorage.setItem(timelineStorageKey, JSON.stringify(customTimelineEvents));
    document.getElementById("timeline-message").textContent = "Saved in this browser!";
  } catch (error) {
    document.getElementById("timeline-message").textContent = "Your browser could not save this timeline.";
  }
  renderCustomTimeline();
}
document.getElementById("timeline-form")?.addEventListener("submit", event => {
  event.preventDefault();
  const year = Number(document.getElementById("timeline-year").value);
  const title = document.getElementById("timeline-title").value.trim();
  const description = document.getElementById("timeline-description").value.trim();
  if (!Number.isInteger(year) || year < -10000 || year > 2026 || !title || !description) {
    document.getElementById("timeline-message").textContent = "Please enter a valid year, title, and description.";
    return;
  }
  customTimelineEvents.push({year,title,description});
  saveCustomTimeline();
  event.target.reset();
});
document.getElementById("timeline-clear")?.addEventListener("click", () => {
  if (!customTimelineEvents.length) return;
  customTimelineEvents = [];
  saveCustomTimeline();
  document.getElementById("timeline-message").textContent = "Your timeline has been cleared.";
});
renderCustomTimeline();
