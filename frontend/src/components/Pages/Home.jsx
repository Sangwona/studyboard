import React, { useState, useEffect } from 'react'; // Add useState and useEffect import
import { Link } from 'react-router-dom';
import '../../styles/Home.css';
import NavBar from "../NavBarFooter/NavBar";
import Footer from "../NavBarFooter/Footer";


function Home() {

  const [posts, setPosts] = useState([]); // 초기값 빈 배열

  useEffect(() => {
    // API에서 데이터 받아오기
    fetch('https://studyboard-production.up.railway.app/board/posts')
      .then((response) => response.json()) // JSON 형태로 응답 받기
      .then((data) => {
        console.log(data);
        setPosts(data); // 받아온 데이터를 posts 배열에 저장
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []); // 빈 배열을 두 번째 인자로 주어 처음 한 번만 실행되도록 함    

  return (
    <div className="Home">
      <NavBar />

      <main>
        <h2>게시글 목록</h2>
        <div className="post-list">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <Link to={`/post/${post.id}`}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
              </Link>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;