from flask import Flask
from flask_cors import CORS
from routes.form_route import form_bp
from routes.chatbot_route import chatbot_bp


app = Flask(__name__)
CORS(app)
app.register_blueprint(chatbot_bp)
app.register_blueprint(form_bp)

if __name__ == '__main__':
    app.run(debug=True)