import { useState, useEffect } from "react";
import "../../styles/WriteForm.css";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const WriteForm = ({ existingPost = null, setIsEditing, setPost }) => {
  const navigate = useNavigate();
  const userId = parseInt(localStorage.getItem("user_id"), 10);
  const [formData, setFormData] = useState({
    title: existingPost?.title || "",
    content: existingPost?.content || "",
    user_id: existingPost?.user_id || userId,
  });

  // Preload form data if editing an existing post
  useEffect(() => {
    if (existingPost) {
      setFormData({
        title: existingPost.title,
        content: existingPost.content,
        user_id: existingPost.user_id,
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission for creating or editing a post
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    const apiEndpoint = existingPost ? `/board/posts/${existingPost.id}` : "/board/posts";
    const method = existingPost ? "PUT" : "POST";

    try {
      const response = await fetch(apiEndpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      if (existingPost) {
        setPost((prev) => ({ ...prev, title: formData.title, content: formData.content }));
        setIsEditing(false);
        navigate(`/board/post/${existingPost.id}`);
      } else {
        navigate("/");
      }

      setFormData({ title: "", content: "", user_id: "" });
    } catch (error) {
      console.error("Error posting data:", error);
      alert("Failed to submit the post. Please try again.");
    }
  };

  return (
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
                name="title"
                placeholder="Type your title"
                value={formData.title}
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr>
            <td className="header">Description</td>
          </tr>
          <tr>
            <td>
              <textarea
                name="content"
                placeholder="Type your description"
                value={formData.content}
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr>
            <td>
              <input type="submit" value={existingPost ? "Edit" : "Submit"} />
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
};

WriteForm.propTypes = {
  existingPost: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    content: PropTypes.string,
    user_id: PropTypes.number,
  }),
  setIsEditing: PropTypes.func,
  setPost: PropTypes.func,
};

export default WriteForm;
