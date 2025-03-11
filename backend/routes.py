from flask import Blueprint, jsonify, request
from database import db
from models import User, Post, Comment
from werkzeug.security import generate_password_hash, check_password_hash

bp = Blueprint("main_routes", __name__)

# ✅ Get all posts


# @bp.route("/board/posts", methods=["GET"])
# def get_posts():
#     posts = Post.query.order_by(Post.created_at.desc()).all()
#     return jsonify([
#         {
#             "id": post.id,
#             "title": post.title,
#             "content": post.content,
#             "date": post.created_at.strftime("%Y-%m-%d %H:%M:%S"),  # 날짜 포맷 변경
#             "author": post.author.username  # user_id 대신 username 반환
#         }
#         for post in posts
#     ])

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

    print(page)
    return jsonify({
        "posts": [{
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "date": post.created_at.strftime("%Y-%m-%d %H:%M:%S"),  # 날짜 포맷 변경
            "author": post.author.username  # user_id 대신 username 반환
        }
            for post in posts],
        # "total_count": total_posts,
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
def create_post():
    data = request.get_json()
    new_post = Post(title=data["title"],
                    content=data["content"], user_id=data["user_id"])
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

# Get all comments for the post


@bp.route("/board/posts/<int:post_id>/comments", methods=["GET"])
def get_comments(post_id):
    comments = Comment.query.filter_by(
        post_id=post_id).order_by(Comment.created_at).all()

    return jsonify([
        {"id": c.id, "content": c.content, "user_id": c.user_id,
            "created_at": c.created_at.isoformat()}
        for c in comments
    ]) if comments else jsonify([])

# Create a new comment


@bp.route("/board/posts/<int:post_id>/comments", methods=["POST"])
def create_comment(post_id):
    data = request.get_json()

    # if "content" not in data or "user_id" not in data:
    #     return jsonify({"error": "Missing conetent or user_id"}), 400

    new_comment = Comment(
        content=data["content"],
        user_id=data["user_id"],
        post_id=post_id
    )
    db.session.add(new_comment)
    db.session.commit()

    return jsonify({"message": "Comment added!", "id": new_comment.id}), 201


# Register routes in Flask
def register_routes(app):
    app.register_blueprint(bp, url_prefix="")  # ✅ Use correct `url_prefix`
