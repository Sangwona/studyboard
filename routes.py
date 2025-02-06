from flask import Blueprint, jsonify, request
from database import db
from models import User, Post, Comment

bp = Blueprint("main", __name__)

# ✅ Get all posts
@bp.route("/board/posts", methods=["GET"])
def get_posts():
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return jsonify([{"id": p.id, "title": p.title, "content": p.content, "user_id": p.user_id} for p in posts])

# ✅ Get a single post by ID
@bp.route("/board/posts/<int:post_id>", methods=["GET"])
def get_post(post_id):
    post = Post.query.get_or_404(post_id)
    return jsonify({"id": post.id, "title": post.title, "content": post.content, "user_id": post.user_id})

# ✅ Create a new post
@bp.route("/board/posts", methods=["POST"])
def create_post():
    data = request.get_json()
    new_post = Post(title=data["title"], content=data["content"], user_id=data["user_id"])
    db.session.add(new_post)
    db.session.commit()
    return jsonify({"message": "Post created!", "id": new_post.id}), 201

# ✅ Update a post
@bp.route("/board/posts/<int:post_id>", methods=["PUT"])
def update_post(post_id):
    post = Post.query.get_or_404(post_id)
    data = request.get_json()
    post.title = data.get("title", post.title)
    post.content = data.get("content", post.content)
    db.session.commit()
    return jsonify({"message": "Post updated!"})

# ✅ Delete a post
@bp.route("/board/posts/<int:post_id>", methods=["DELETE"])
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)
    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Post deleted!"})

# Register routes in Flask
def register_routes(app):
    app.register_blueprint(bp)