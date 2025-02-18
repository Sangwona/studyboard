from flask import Flask, render_template, send_from_directory
from flask_migrate import Migrate
from flask_cors import CORS

from database import db, init_db
from models import User, Post, Comment
from dotenv import load_dotenv
from routes import register_routes  # ✅ Don't import `bp` directly
from auth_routes import auth_bp  # ✅ Authentication routes
import os

# ✅ Load environment variables from .env
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# ✅ Vite의 `dist/` 폴더 서빙하도록 변경
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # 현재 `app.py`가 있는 디렉토리
FRONTEND_BUILD_DIR = os.path.join(BASE_DIR, "..", "frontend", "dist")

app = Flask(__name__, static_folder=FRONTEND_BUILD_DIR, static_url_path="")


CORS(app)  # 🔥 모든 요청 허용 (배포 시 특정 도메인만 허용하도록 설정하는 것이 안전함)

# ✅ Load Configuration from config.py
app.config.from_object("config.Config")

# ✅ Init DB
init_db(app)
migrate = Migrate(app, db)  # Flask-Migrate 설정 추가

# ✅ Register Routes
register_routes(app)
app.register_blueprint(auth_bp, url_prefix="/auth")  # Add auth routes

# ✅ React 정적 파일 서빙 (루트 경로에서 index.html 반환)
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    # Railway 환경인지 확인
    is_railway = "RAILWAY_ENVIRONMENT" in os.environ  # Railway 환경에서는 이 변수가 존재
    port = int(os.environ.get("PORT", 5000))  # Railway에서는 환경 변수 사용, 없으면 5000
    if is_railway:    
        debug = False  # 배포 환경에서는 debug 비활성화
    else:
        debug = True  # Local에서는 debug 활성화

    app.run(host="0.0.0.0", port=port, debug=debug)