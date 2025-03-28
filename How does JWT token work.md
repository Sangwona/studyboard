# 🛠 JWT 기반 인증 프로세스 정리

## 📌 1. 전체적인 JWT 인증 흐름

1. **사용자가 로그인 요청 (`POST /auth/login`)**

   - 백엔드는 로그인 정보를 검증하고 JWT 토큰을 발급.
   - 클라이언트(프론트엔드)는 JWT 토큰을 `localStorage` 또는 `sessionStorage`에 저장.

2. **로그인된 사용자는 API 요청 시 `Authorization: Bearer <TOKEN>` 헤더 포함**

   - 예: `POST /board/posts` (게시물 작성)
   - 백엔드는 `@jwt_required()`를 통해 토큰을 검증하고, 사용자 정보를 `get_jwt_identity()`로 가져옴.

3. **JWT를 이용하여 사용자의 소유권 확인**

   - 예: `PUT /board/posts/<id>` (게시물 수정)
   - `get_jwt_identity()`를 이용하여 게시물의 작성자와 현재 사용자가 동일한지 확인.

4. **로그아웃 시 프론트엔드에서 JWT 토큰 삭제**
   - `localStorage.removeItem("jwt_token")`
   - JWT는 서버에서 세션을 관리하지 않으므로, 클라이언트에서 토큰을 삭제해야 함.

---

## 📌 2. Flask 백엔드 프로세스

### 1️⃣ JWT 기반 로그인 (`POST /auth/login`)

- 로그인 요청이 들어오면, 백엔드는 사용자의 아이디와 비밀번호를 검증.
- 검증이 성공하면, `access_token`을 생성하여 클라이언트에 반환.
- `access_token`에는 `user_id`와 `username` 정보를 포함.

### 2️⃣ JWT를 사용한 게시판 API

- 게시물 및 댓글을 작성할 때, 요청 헤더에 `Authorization: Bearer <TOKEN>`을 포함해야 함.
- `@jwt_required()`를 사용하여 로그인된 사용자만 해당 기능을 이용할 수 있도록 제한.

### 3️⃣ 게시물 및 댓글 작성

- `POST /board/posts`: 로그인된 사용자만 게시물 작성 가능.
- `POST /board/posts/<id>/comments`: 로그인된 사용자만 댓글 작성 가능.
- `@jwt_required()`를 통해 JWT 토큰을 검증하고, `get_jwt_identity()`를 사용하여 사용자 정보 조회.

### 4️⃣ 게시물 수정 및 삭제 (소유자 검증)

- `PUT /board/posts/<id>`: 게시물 작성자만 수정 가능.
- `DELETE /board/posts/<id>`: 게시물 작성자만 삭제 가능.
- `get_jwt_identity()`를 사용하여 현재 사용자와 게시물 작성자가 일치하는지 검증.

---

## 📌 3. 프론트엔드에서 JWT 인증 적용

### 1️⃣ 로그인 요청 및 JWT 저장

- `POST /auth/login` 요청을 보내고, 반환된 `access_token`을 `localStorage`에 저장.
- 이후 모든 API 요청 시 `Authorization: Bearer <TOKEN>` 헤더를 포함해야 함.

### 2️⃣ 게시물 작성 요청 (JWT 포함)

- `POST /board/posts` 요청을 보낼 때 JWT 토큰을 헤더에 포함.
- 토큰이 없거나 유효하지 않으면 `401 Unauthorized` 응답을 받음.

### 3️⃣ 보호된 API 접근 (로그인 필요)

- `GET /auth/protected` 요청 시 JWT가 없으면 `401 Unauthorized` 응답.
- `Authorization` 헤더에 `Bearer <TOKEN>`을 포함하여 요청.

### 4️⃣ 로그아웃 (JWT 삭제)

- `localStorage.removeItem("jwt_token")`을 실행하여 클라이언트에서 JWT 삭제.

---

## 📌 4. JWT 인증 흐름 요약

| 단계                 | 백엔드 (Flask)                          | 프론트엔드 (React, JS)                             |
| -------------------- | --------------------------------------- | -------------------------------------------------- |
| **로그인**           | `/auth/login`에서 `access_token` 발급   | `localStorage.setItem("jwt_token")` 저장           |
| **게시물 작성**      | `@jwt_required()`로 JWT 검증 후 DB 저장 | `Authorization: Bearer <TOKEN>` 헤더 포함하여 요청 |
| **게시물 수정/삭제** | 소유자만 가능하도록 검증                | 해당 `user_id`가 동일한지 확인 후 요청             |
| **보호된 API 접근**  | `@jwt_required()` 적용                  | JWT 없이 요청 시 `401 Unauthorized` 반환           |
| **로그아웃**         | 서버에서 별도 처리 없음                 | `localStorage.removeItem("jwt_token")` 실행        |

---

## 📌 5. 테스트 시나리오

### 1️⃣ 회원가입 (`POST /auth/signup`)

- 새로운 사용자를 생성하고, 중복된 아이디로 가입하려 하면 `409 Conflict` 응답.

### 2️⃣ 로그인 (`POST /auth/login`)

- 올바른 아이디/비밀번호로 로그인하면 `access_token` 반환.
- 잘못된 비밀번호 입력 시 `401 Unauthorized` 응답.

### 3️⃣ 게시물 작성 (`POST /board/posts`)

- JWT 토큰이 없으면 `401 Unauthorized` 응답.
- 정상적인 요청 시 게시물이 생성되고 `201 Created` 응답.

### 4️⃣ 게시물 수정 (`PUT /board/posts/<id>`)

- 작성자가 아닌 사용자가 수정하려 하면 `403 Forbidden` 응답.
- 작성자가 수정할 경우 `200 OK` 응답.

### 5️⃣ 게시물 삭제 (`DELETE /board/posts/<id>`)

- 작성자가 아닌 사용자가 삭제하려 하면 `403 Forbidden` 응답.
- 작성자가 삭제할 경우 `200 OK` 응답.

---

## 📌 6. 결론

- **JWT를 이용한 인증 시스템을 적용하여 로그인된 사용자만 특정 작업을 수행할 수 있도록 구현.**
- **게시물과 댓글 작성, 수정, 삭제 권한을 소유자에게만 부여하여 보안 강화.**
- **JWT 기반 인증이므로, 서버에서 세션을 관리하지 않고 클라이언트가 토큰을 저장하고 사용.**
