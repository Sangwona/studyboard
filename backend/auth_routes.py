from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from database import db
from models import User
from werkzeug.security import generate_password_hash, check_password_hash
import json
from datetime import timedelta
from flask_jwt_extended import decode_token
import datetime

auth_bp = Blueprint("auth_routes", __name__)  # ✅ Change to unique name

@auth_bp.route("/check-user", methods=["POST"])
def check_user():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    email = data.get("email")
    username = data.get("username")

    if not email and not username:
        return jsonify({"error": "No userID or username provided"}), 400

    # *** IMPORTANT ***
    # 추후에 User model에 email이 추가 되면 "user_id"를 "email"로 변경 예정!!!
    # (현재 frontend fetch에서도 input field의 email을 넘기고 있음!)
    if email:
        existing_user_by_email = User.query.filter_by(user_id=email).first()
        if existing_user_by_email:
            return jsonify({"exists": True, "field": "email"}), 200

    if username:
        existing_user_by_username = User.query.filter_by(username=username).first()
        if existing_user_by_username:
            return jsonify({"exists": True, "field": "username"}), 200

    return jsonify({"exists": False}), 200

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"error": "User already exists"}), 409

    new_user = User(username=username)
    new_user.password_hash = generate_password_hash(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created!", "id": new_user.id}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid credentials"}), 401

    # ✅ JWT 토큰 생성 (identity에 객체 저장)
    access_token = create_access_token(identity=json.dumps({"user_id": str(user.id), "username": user.username}),
                                       expires_delta=timedelta(days=1))

    return jsonify({
        "message": "Login successful!",
        "user_id": user.id,
        "access_token": access_token  # 프론트엔드 이 토큰을 받아서 저장해야 함.
    }), 200

    # 보호된 API 엔드포인트 (로그인한 사용자만 접근 가능)

@auth_bp.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = json.loads(get_jwt_identity())  # ✅ JSON 문자열을 다시 객체로 변환
    user_id = current_user["user_id"]
    username = current_user["username"]

    return jsonify({
        "message": "Access granted",
        "user_id": user_id,
        "username": username
    }), 200
