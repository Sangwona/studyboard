from database import db  # 👈 Import db from database.py
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import Sequence, text


# 사용자 (User) 테이블
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Text, unique=True, nullable=False)
    username = db.Column(db.String(50), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    posts = db.relationship("Post", backref="author", lazy=True)
    comments = db.relationship("Comment", backref="commentor", lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
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


# roles 테이블
class Role(db.Model):
    __tablename__ = 'roles'

    id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String, nullable=False)
    permissions = db.Column(db.JSON, default={})

    def __repr__(self):
        return f"<Role {self.role_name}>"

#  groups 테이블


class Group(db.Model):
    __tablename__ = 'groups'

    id = db.Column(db.Integer, primary_key=True)
    group_name = db.Column(db.String, unique=True, nullable=False)
    max_members = db.Column(db.Integer, default=100)
    is_public = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.Text)

    def __repr__(self):
        return f"<Group {self.group_name}>"

#  group_members 테이블 (Many-to-Many 관계)


class GroupMember(db.Model):
    __tablename__ = 'group_members'

    group_id = db.Column(db.Integer, db.ForeignKey(
        "groups.id", ondelete="CASCADE"), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(
        "user.id", ondelete="CASCADE"), primary_key=True)
    status = db.Column(db.String)
    role_id = db.Column(db.Integer, db.ForeignKey(
        "roles.id", ondelete="CASCADE"), primary_key=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<GroupMember group={self.group_id} user={self.user_id}>"
