from flask import Blueprint, jsonify, request
from database import db
from models import User, Post, Comment
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity
import json

bp = Blueprint("main_routes", __name__)

# ✅ Get posts by pagenation


@bp.route("/board/posts", methods=["GET"])
def get_posts():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    if page < 1:
        page = 1

    pagination = Post.query.order_by(Post.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False)

    posts = pagination.items
    total_pages = pagination.pages

    return jsonify({
        "posts": [{
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "date": post.created_at.strftime("%Y-%m-%d %H:%M:%S"),  # 날짜 포맷 변경
            "author": post.author.username  # user_id 대신 username 반환
        }
            for post in posts],
        "total_pages": total_pages,  # 전체 페이지 수
        "current_page": page
    })

# ✅ Get a single post by ID


@bp.route("/board/posts/<int:post_id>", methods=["GET"])
def get_post(post_id):
    post = Post.query.get_or_404(post_id)
    return jsonify({"id": post.id, "title": post.title, "content": post.content, "user_id": post.user_id})

# ✅ Create a new post


@bp.route("/board/posts", methods=["POST"])
@jwt_required()
def create_post():
    current_user = json.loads(get_jwt_identity())  # ✅ JSON 문자열을 dict로 변환
    user_id = current_user["user_id"]

    data = request.json
    title = data.get("title")
    content = data.get("content")

    new_post = Post(title=title, content=content, user_id=user_id)
    
    db.session.add(new_post)
    db.session.commit()
    return jsonify({"message": "Post created!", "id": new_post.id}), 201

# ✅ Update a post


@bp.route("/board/posts/<int:post_id>", methods=["PUT"])
@jwt_required()
def update_post(post_id):
    post = Post.query.get_or_404(post_id)
    current_user = json.loads(get_jwt_identity())
    user_id = current_user["user_id"]

    # 작성자 검증
    if post.user_id != user_id:
        return jsonify({"error": "You can only edit your own posts"}), 403

    data = request.get_json() 
    
    post.title = data.get("title", post.title)
    post.content = data.get("content", post.content)
    db.session.commit()
    return jsonify({"message": "Post updated!"})

# ✅ Delete a post


@bp.route("/board/posts/<int:post_id>", methods=["DELETE"])
@jwt_required()
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)
    current_user = json.loads(get_jwt_identity())
    user_id = current_user["user_id"]
    
    print(f"Post user_id: {post.user_id}, type: {type(post.user_id)}")
    print(f"Current user_id: {user_id}, type: {type(user_id)}")
    
    # 작성자 검증
    if post.user_id != int(user_id):  # JWT에서 받은 user_id를 정수로 변환
        return jsonify({"error": "You can only delete your own posts"}), 403
        
    # 게시글과 관련된 댓글들을 먼저 삭제
    Comment.query.filter_by(post_id=post_id).delete()
    
    # 게시글 삭제
    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Post deleted!"})

# Get all comments for the post


@bp.route("/board/posts/<int:post_id>/comments", methods=["GET"])
def get_comments(post_id):
    comments = Comment.query.filter_by(
        post_id=post_id).order_by(Comment.created_at).all()

    return jsonify([
        {"id": c.id, "content": c.content, "user_id": c.user_id,  "username": c.commentor.username, "created_at": c.created_at.isoformat()}
        for c in comments
    ]) if comments else jsonify([])

# Create a new comment


@bp.route("/board/posts/<int:post_id>/comments", methods=["POST"])
@jwt_required()
def create_comment(post_id):
    current_user = json.loads(get_jwt_identity())
    user_id = current_user["user_id"]

    data = request.json
    content = data.get("content")

    if not content:
        return jsonify({"error": "Missing content"}), 400

    post = Post.query.get(post_id)
    if not post:
        return jsonify({"error": "Post not found"}), 404

    new_comment = Comment(content=content, user_id=user_id, post_id=post_id)
    db.session.add(new_comment)
    db.session.commit()

    return jsonify({"message": "Comment added!", "id": new_comment.id}), 201


# Register routes in Flask
def register_routes(app):
    app.register_blueprint(bp, url_prefix="")  # ✅ Use correct `url_prefix`
