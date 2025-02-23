import './App.css'
import Post from './components/Post/Post'
import WriteForm from './components/Pages/WriteForm'
import Home from './components/Pages/Home'
import Login from './components/Pages/Login'
import SignUp from './components/Pages/SignUp'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:post_id" element={<Post />} />
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/signup" element={<SignUp></SignUp>}></Route>
        <Route path="/writeform" element={<WriteForm />} />
      </Routes>
    </Router>
  );
}

export default App;
