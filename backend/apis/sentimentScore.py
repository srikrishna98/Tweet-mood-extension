from flask_restx import Resource
from flask import request

KEY_MAP_DICT = {'pos': 'positive', 'neg': 'negative', 'neu': 'neutral'}


class SentimentScore(Resource):

    def post(self):
        result = list()
        return result
