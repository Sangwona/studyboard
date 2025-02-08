import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UserIcon from './components/User/UserIcon'
import PostHeader from './components/Post/PostHeader'
import Post from './components/Post/Post'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Post/>
  )
}

export default App;
