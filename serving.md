Flask와 React가 한 서버에서 동작하는 원리 (개념 설명)

Flask(백엔드)와 React(프론트엔드)는 완전히 다른 역할을 수행하는 두 개의 서버입니다.
하지만 배포할 때는 React의 정적 파일을 Flask가 서빙하도록 설정하여 하나의 서버에서 동작할 수 있습니다.

1.  Flask와 React는 원래 별개의 서버에서 동작함

개발 중에는 이렇게 동작함:
• React 개발 서버: http://localhost:3000/
• Flask 개발 서버: http://localhost:5000/

🚀 요청 흐름 예제 1. 사용자가 http://localhost:3000/ (React) 접속 2. React가 Flask API (http://localhost:5000/api/data) 요청 3. Flask가 데이터를 응답하면 React가 이를 화면에 표시

    📌 2. 배포할 때 React의 정적 파일을 Flask가 서빙

Flask와 React를 한 서버에서 실행하려면, React가 서버 없이 동작할 수 있어야 함
→ React 프로젝트를 정적 파일로 변환(build)하여 Flask가 제공하면 됨!

✅ React 빌드 과정

```sh
npm run build
```

📌 3. Flask가 React 정적 파일을 서빙하는 방법

배포 시에는 Flask가 React의 빌드된 파일을 정적 파일로 제공하면, 하나의 Flask 서버에서 프론트엔드와 백엔드를 함께 실행할 수 있음.

📌 Flask 서버 (app.py)

```python
from flask import Flask, send_from_directory, jsonify
import os

app = Flask(__name__, static_folder="frontend/build", static_url_path="/")

# ✅ React 정적 파일 서빙
@app.route("/")
def serve_react():
    return send_from_directory(app.static_folder, "index.html")

# ✅ React 정적 파일 서빙 (JS, CSS 등)
@app.route("/static/<path:path>")
def serve_static(path):
    return send_from_directory(os.path.join(app.static_folder, "static"), path)

# ✅ Flask API (백엔드)
@app.route("/api/data", methods=["GET"])
def get_data():
    return jsonify({"message": "Hello from Flask API"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
```

📌 4. Flask가 어떻게 React를 서빙하는가? 1. 사용자가 http://localhost:5000/ 접속
• Flask가 frontend/build/index.html을 반환
• React 앱이 실행됨. 2. React에서 백엔드 API 호출
• React의 JavaScript가 fetch("/api/data") 실행
• Flask가 {"message": "Hello from Flask API"} 응답 3. React가 API 응답을 화면에 표시

🚀 결과:
→ React는 백엔드 없이 정적 파일로 동작하면서, Flask API를 통해 데이터를 받아 동적으로 화면을 갱신

5.  Flask + React 구조 (배포 환경)

배포할 때는 Flask가 하나의 서버 역할을 하면서 React 정적 파일을 서빙하고, API도 제공함.

📌 폴더 구조 예시
/project-root/
├── backend/
│ ├── app.py # Flask 서버
│ ├── database.py
│ ├── models.py
│ ├── routes.py
│ ├── static/ # (Flask가 제공할 정적 파일)
├── frontend/
│ ├── src/ # (React 소스 코드)
│ ├── public/
│ ├── build/ # (React 빌드 파일)
│ ├── package.json
├── Procfile # Railway 배포 설정
├── requirements.txt
├── .env

🚀 결론:
• 개발 환경: React와 Flask가 각각 다른 서버에서 실행 (3000번 포트, 5000번 포트)
• 배포 환경: Flask가 React 빌드 파일을 정적 파일로 서빙하여 하나의 서버에서 실행됨! (5000번 포트)

📌 6. Railway에서 배포할 때

Railway에서는 Flask만 실행하면 됨 (React는 빌드된 정적 파일을 제공하면 됨).

1. React 빌드 실행:

```sh
npm run build
```

2. Flask가 이 파일을 제공하도록 설정 (위 app.py처럼)
