from flask import Flask
from flask_cors import CORS
from flask_restx import Api
from apis.hello import HelloWorld
from apis.langDetect import LangDetect
from apis.sentimentScore import SentimentScore

app = Flask(__name__)
cors = CORS(app, resource={
    r"/*": {
        "origins": "*"
    }
})

api = Api(app, version='1.0')
api.add_resource(LangDetect, '/api/language-detection')
api.add_resource(HelloWorld, '/hello')


if __name__ == '__main__':
    app.run(debug=True)
