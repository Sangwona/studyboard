import React, { useState, useEffect } from "react";
import "../../styles/WriteForm.css";
import { useNavigate } from "react-router-dom";

const WriteForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [posts, setPosts] = useState([]); // 기존 게시글 데이터를 관리하는 상태

  // 컴포넌트가 마운트될 때 게시글 데이터를 가져오는 useEffect
  useEffect(() => {
    fetch("/board/posts")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched posts:", data);
        setPosts(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 서버에서 요구하는 JSON 형식에 맞게 데이터 구성하기
    const newPost = {
      title: title,
      content: detail,
      user_id: 1, // 실제 사용자의 아이디로 대체
    };

    fetch("/board/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newPost),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Post created:", data);
        setPosts((prevPosts) => [...prevPosts, data]); // 올바른 상태 업데이트

        alert("작성 완료!");

        // 입력 필드 초기화
        setTitle("");
        setDetail("");

        navigate("/");
      })
      .catch((error) => {
        console.error("Error posting data:", error);
        alert("글 작성 중 오류가 발생했습니다.");
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td className="header">Title</td>
            </tr>
            <tr>
              <td>
                <input
                  type="text"
                  placeholder="제목을 입력하세요"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="header">Comment</td>
            </tr>
            <tr>
              <td>
                <textarea
                  placeholder="내용을 입력하세요"
                  name="detail"
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>
                <input type="submit" value="등록" />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </>
  );
};

export default WriteForm;
