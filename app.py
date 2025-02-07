from flask import Flask, render_template
from database import db, init_db
from models import User, Post, Comment
from routes import register_routes
from dotenv import load_dotenv
import os

# ✅ Load environment variables from .env
load_dotenv()

app = Flask(__name__)

# ✅ Load Configuration from config.py
app.config.from_object("config.Config")
init_db(app)
register_routes(app)

@app.route("/")
def home():
    return "Hello, StudyBoard!"

if __name__ == "__main__":
    app.run(debug=True)