import os
import subprocess

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "..", "frontend")
BACKEND_STATIC_DIR = os.path.join(BASE_DIR, "static")

# 🚀 Railway 배포 환경인지 확인
IS_RAILWAY = "RAILWAY_ENVIRONMENT" in os.environ

def build_react():
    """React 빌드 후 static 폴더에 복사 (로컬에서만 실행)"""
    if IS_RAILWAY:
        print("🚀 배포 환경에서는 React 빌드를 건너뜁니다.")
        return  # Railway에서는 React 빌드 생략

    print("🚀 React 빌드 시작...")
    subprocess.run(["npm", "install"], cwd=FRONTEND_DIR, check=True)
    subprocess.run(["npm", "run", "build"], cwd=FRONTEND_DIR, check=True)

    # 기존 static 폴더 삭제 후 새로운 빌드 결과 복사
    if os.path.exists(BACKEND_STATIC_DIR):
        print("🗑 기존 static 폴더 삭제...")
        subprocess.run(["rm", "-rf", BACKEND_STATIC_DIR], check=True)

    subprocess.run(["mv", os.path.join(FRONTEND_DIR, "dist"), BACKEND_STATIC_DIR], check=True)
    print("✅ React 빌드 완료! Flask에서 최신 버전 서빙.")

def run_flask():
    """Flask 서버 실행"""
    print("🚀 Flask 서버 실행...")
    subprocess.run(["python", "app.py"], cwd=BASE_DIR, check=True)

if __name__ == "__main__":
    build_react()  # 🚀 로컬에서만 실행됨
    run_flask()