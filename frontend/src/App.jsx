import React, { useState } from 'react';
import './App.css';

// 게시글 목록 데이터 예시
const posts = [
  { id: 1, title: '첫 번째 게시글', content: '이것은 첫 번째 게시글입니다.' },
  { id: 2, title: '두 번째 게시글', content: '이것은 두 번째 게시글입니다.' },
  { id: 3, title: '세 번째 게시글', content: '이것은 세 번째 게시글입니다.' },
  { id: 4, title: '네 번째 게시글', content: '이것은 네 번째 게시글입니다.' }
];

function App() {
  const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시글 상태 관리

  // 게시글 클릭 시 상세보기 처리
  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  return (
    <div className="App">
      {/* 네비게이션 바 */}
      <header className="navbar">
        <div className="navbar-logo">
          <h1>Study Boards</h1>
        </div>
        <nav className="navbar-links">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">Leetcode</a></li>
            <li><a href="#contact">Portfolio</a></li>
          </ul>
        </nav>
      </header>

      {/* 게시글 목록 */}
      <main>
        <h2>게시글 목록</h2>
        <div className="post-list">
          {posts.map((post) => (
            <div key={post.id} className="post-card" onClick={() => handlePostClick(post)}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </div>
          ))}
        </div>
      </main>

      {/* 선택된 게시글 상세 보기 */}
      {selectedPost && (
        <div className="post-detail">
          <h2>{selectedPost.title}</h2>
          <p>{selectedPost.content}</p>
          <button onClick={() => setSelectedPost(null)}>닫기</button>
        </div>
      )}

      <footer>
        <p>&copy; 2025 My Board. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;