import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")  # Optional for security
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")  # JWT Secret Key