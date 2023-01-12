from flask_restx import Resource
from flask import request
from langdetect import detect


class LangDetect(Resource):
    def post(self):
        result = list()
        data = request.json
        for tweets in data:
            if (tweets["tweet_text"]):
                try:
                    langDetected = detect(tweets["tweet_text"])
                    is_english = langDetected == 'en'
                    result.append(
                        {"tweet_text": tweets["tweet_text"], "is_english": is_english})
                except:
                    result.append(
                        {"tweet_text": tweets["tweet_text"], "is_english": False})
        return result
