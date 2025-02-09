import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UserIcon from './components/User/UserIcon'
import PostHeader from './components/Post/PostHeader'
import Post from './components/Post/Post'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/post/:post_id" element={<Post />}></Route>
      </Routes>
    </Router>
  )
}

export default App;
