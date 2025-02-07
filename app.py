from flask import Flask, render_template
from flask_migrate import Migrate

from database import db, init_db
from models import User, Post, Comment
from dotenv import load_dotenv
from routes import register_routes  # ✅ Don't import `bp` directly
from auth_routes import auth_bp  # ✅ Authentication routes
import os

# ✅ Load environment variables from .env
load_dotenv()

app = Flask(__name__)
# ✅ Load Configuration from config.py
app.config.from_object("config.Config")

# ✅ Init DB
init_db(app)
migrate = Migrate(app, db)  # Flask-Migrate 설정 추가

# ✅ Register Routes
register_routes(app)
app.register_blueprint(auth_bp, url_prefix="/auth")  # Add auth routes

@app.route("/")
def home():
    return "Hello, StudyBoard!"

if __name__ == "__main__":
    # Railway 환경인지 확인
    is_railway = "RAILWAY_ENVIRONMENT" in os.environ  # Railway 환경에서는 이 변수가 존재

    if is_railway:
        port = int(os.environ.get("PORT", 5000))  # Railway에서는 환경 변수 사용, 없으면 5000
        debug = False  # 배포 환경에서는 debug 비활성화
    else:
        port = 5001  # Local에서는 무조건 5001 사용
        debug = True  # Local에서는 debug 활성화

    app.run(host="0.0.0.0", port=port, debug=debug)