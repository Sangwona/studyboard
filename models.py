from database import db  # 👈 Import db from database.py
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

# 사용자 (User) 테이블
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    posts = db.relationship("Post", backref="author", lazy=True)
    comments = db.relationship("Comment", backref="commentor", lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        print("checking password.......if hashed?");
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.username}>"

# 게시글 (Post) 테이블
class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    comments = db.relationship("Comment", backref="post", lazy=True)

    def __repr__(self):
        return f"<Post {self.title}>"

# 댓글 (Comment) 테이블
class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("post.id"), nullable=False)

    def __repr__(self):
        return f"<Comment {self.content[:30]}>"