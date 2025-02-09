import './App.css'
import Post from './components/Post/Post'

//
import Home from './components/Pages/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/post/:post_id" element={<Post />} />
      </Routes>
    </Router>
  );
}

export default App;
