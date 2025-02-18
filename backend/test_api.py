import requests

BASE_URL = "http://127.0.0.1:5000/board"

# 1️⃣ GET all posts
response = requests.get(f"{BASE_URL}/posts")
print("GET /posts:", response.status_code, response.text)  # Debugging
if response.status_code == 200:
    print(response.json())

# 2️⃣ POST a new post
data = {"title": "Python Test", "content": "Testing Flask API", "user_id": 1}
response = requests.post(f"{BASE_URL}/posts", json=data)
print("POST /posts:", response.status_code, response.text)
if response.status_code == 201:
    print(response.json())

# 3️⃣ GET a single post
response = requests.get(f"{BASE_URL}/posts/1")
print("GET /posts/1:", response.status_code, response.text)  # Debugging
if response.status_code == 200:
    print(response.json())
else:
    print("Error: Could not fetch post 1")

# 4️⃣ DELETE a post
response = requests.delete(f"{BASE_URL}/posts/1")
print("DELETE /posts/1:", response.status_code, response.text)
if response.status_code == 200:
    print(response.json())