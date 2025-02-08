# How to Start

## 프로젝트 셋업 가이드

### 1. 파일 받기 (프로젝트 세팅)

프로젝트 폴더를 설정하기 위한 명령어입니다.

```sh
[명령어를 넣어주세요.]
```

### 2. 가상환경 세팅

가상환경을 설정하여 프로젝트에 필요한 패키지를 관리합니다.

```sh
python -m venv venv  # 가상환경 생성
source venv/bin/activate  # 가상환경 실행 (Windows는 venv\Scripts\activate)
```

### 3. 파이썬 패키지 설치

프로젝트에 필요한 라이브러리를 설치합니다.

```sh
pip install -r requirements.txt
```

### 4. 서버 실행

프로젝트가 정상적으로 실행되는지 확인합니다.

```sh
python app.py
```

### 5. 서버 접속

웹 브라우저에서 서버가 정상적으로 작동하는지 확인합니다.

```
http://localhost:5000
```

### 6. Git Branch 생성

각자 자신의 작업을 위한 브랜치를 생성한 후 작업을 진행합니다.

```sh
git checkout -b [your-branch-name] # branch 이름은 여러분의 이름이나 닉네임으로 해주세요.
```

### main 최신화 후 내 브랜치 최신화

```sh
git checkout main
git pull --rebase origin main
git checkout sangwon # sangwon 대신 자신이 사용하고 있는 브랜치 이름을 넣어주시면 됩니다!
git rebase main
```
