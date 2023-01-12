from flask_restx import Resource
from flask import request
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

KEY_MAP_DICT = {'pos': 'positive', 'neg': 'negative', 'neu': 'neutral'}


class SentimentScore(Resource):
    def getMood(self, pos, neg, neu):
        if pos > neg and pos > neu:
            return "POSITIVE"
        elif neg > pos and neg > neu:
            return "NEGATIVE"
        elif neu > pos and neu > neg:
            return "NEUTRAL"

    def formatResponse(self, tweet, pos, neg, neu):
        respose = dict()
        respose["tweet_text"] = tweet
        respose["sentiment_score"] = dict()
        respose['sentiment_score']['positive'] = pos
        respose['sentiment_score']['negative'] = neg
        respose['sentiment_score']['neutral'] = neu
        respose['detected_mood'] = self.getMood(pos, neg, neu)

        return respose

    def post(self):
        SIA = SentimentIntensityAnalyzer()

        result = list()
        data = request.json
        for tweets in data:
            tweet = tweets['tweet_text']
            raw_polarity_scores = SIA.polarity_scores(tweet)
            positive = raw_polarity_scores['pos']
            negative = raw_polarity_scores['neg']
            neutral = raw_polarity_scores['neu']
            result.append(self.formatResponse(
                tweet, positive, negative, neutral))
        return result
