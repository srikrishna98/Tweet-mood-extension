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

const hostedURL = "https://www.srikrishna.me/";
const langDetectURL = "api/language-detection";
const sentimentURL = "api/sentiment-score";

// Function to store hashed tweets
const hash = (s) =>
  s.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

// *****************************
//
// DOM Manipulation
//
// *****************************

// TODO - Appends the detected mood next to the time element of the tweet.
const appendSentiment = (inputEl, sentiment) => {};

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
  // Regex to replace newline spaces with spaces.
  tweetText = inputEl.innerText.replace(/\s+/g, " ").trim();

  // URL pointing to the python backend hosted in AWS EC2 instance with domain name www.srikrishna.me
  const baseUrl = hostedURL + langDetectURL;

  const urlParams = [
    {
      tweet_text: tweetText,
    },
  ];

  fetch(baseUrl, {
    method: "POST",
    body: JSON.stringify(urlParams),
    headers: new Headers({ "Content-Type": "application/json" }),
  })
    .then((response) => response.json())
    .then((json) => {
      // The sentiment has to be found only for tweets in the english language.
      if (json[0]["is_english"] === true) {
        getSentiment(inputEl);
      }
    });
}

const getSentiment = (inputEl) => {
  // Regex to replace newline spaces with spaces.
  tweetText = inputEl.innerText.replace(/\s+/g, " ").trim();

  // URL pointing to the python backend hosted in AWS EC2 instance with domain name www.srikrishna.me
  const baseUrl = hostedURL + sentimentURL;

  const urlParams = [
    {
      tweet_text: tweetText,
    },
  ];

  fetch(baseUrl, {
    method: "POST",
    body: JSON.stringify(urlParams),
    headers: new Headers({ "Content-Type": "application/json" }),
  })
    .then((resp) => resp.json())
    .then((json) => {
      // This tweet along with the analyzed sentiment has to be stored in-memory.
      addTweetToFeed(inputEl, json[0]["detected_mood"]);
    });
};

// *******************************************************
//
// UI MutationHandlers - Any time the UI renders/removes
// some element dynamically within the specified selector,
//  this function gets fired.
//
/// ******************************************************

function handleMutations(mutations_list, selector) {
  mutations_list.forEach((mutation) => {
    const addedNodes = mutation.addedNodes;

    //  New nodes are being added in the mutation
    addedNodes.forEach((added_node) => {
      if (added_node.querySelector) {
        const inputEl = added_node.querySelector(selector);
        if (!!inputEl) {
          // Check to see if the tweet has any text - handles the case where tweet
          //  has only images/gifs/videos and no text to analyse.
          if ((inputEl.innerText.trim()?.length || 0) > 0 === true) {
            // Analyse the tweet only if it has not been already analysed.
            if (tweetTexts.has(hash(inputEl.innerText)) !== true) {
              analyseTweet(inputEl);
            }
          }
        }
      }
    });

    // Existing nodes are being removed in the mutation
    const removedNodes = mutation.removedNodes;
    removedNodes.forEach((removed_node) => {
      if (removed_node.querySelector) {
        const inputEl = removed_node.querySelector(selector);
        if (!!inputEl) {
          // Remove the tweet from in-memory storage when it is removed from the DOM.
          removeTweetFromFeed(inputEl.innerText.replace(/\s+/g, " ").trim());
        }
      }
    });
  });
}

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
