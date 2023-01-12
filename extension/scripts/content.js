// ***********************************
//
// Constant Values and Util functions
//
// ***********************************

const emojis = {
  POSITIVE: "&#128522",
  NEUTRAL: "&#128528",
  NEGATIVE: "&#128577",
};

// Function to store hashed tweets
const hash = (s) =>
  s.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

// *****************************
//
// In-Memory Storage using Map
//
// *****************************

// Using Javascript Map data structure for storage since the number of tweets held in memory at any time is minimum.
// Tweets are added/removed to this Map when they are rendered/removed from the DOM respectively.
const tweetTexts = new Map();

// The Tweet along with analyzed sentiment is stored in-memory.
const addTweetToFeed = (inputEl, sentiment) => {
  tweetText = inputEl.innerText;
  tweetHash = hash(tweetText);
  if (tweetTexts.has(tweetHash) === false) {
    tweetTexts.set(tweetHash, {
      tweet_text: tweetText,
      sentiment: sentiment,
    });
    appendSentiment(inputEl, sentiment);
  }
};

// The tweet is removed from in-memory storage when it is removed from the DOM.
const removeTweetFromFeed = (tweet) => {
  tweetTexts.delete(hash(tweet));
};

// *****************************
//
// External API call methods
//
// *****************************

function analyseTweet(inputEl) {
  // Make API Call to check if english language
  // If English language:
  //    getSentiment()
  //    addTweetToFeed()
  // Else:
  //    doNothing
}

const getSentiment = (inputEl) => {
  // Make API Call to identify mood of the tweet
};

// *******************************************************
//
// UI MutationHandlers - Any time the UI renders/removes
// some element dynamically within the specified selector,
//  this function gets fired.
//
/// ******************************************************

function handleMutations(mutations_list, selector) {}

// ****************************************
//
// MutationObserver creation and definition
//
// ****************************************
const createObserver = (selector) => {
  return new MutationObserver(async function mutate(mutations_list) {
    handleMutations(mutations_list, selector);
  });
};

// An observer is created to observe mutations made to the tweet texts.
const tweetObserver = createObserver('div[data-testid="tweetText"]');

// The observer observes mutations within this root and handles mutations made at
//  the element specified at the selector (div[data-testid="tweetText"]).
const reactRoot = document.querySelector("#react-root");

tweetObserver.observe(document, { subtree: true, childList: true });
