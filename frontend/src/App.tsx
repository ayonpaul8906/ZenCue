import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Signup from './pages/signup'
import Login from './pages/login'
import SimplifyScreen from './pages/simplify-screen'
import About from './pages/About'
import Chatbot from './pages/ChatbotPage'



export default function App() {
  return (
    <>
    {/* <VantaBackground /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/screen" element={<SimplifyScreen />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </>
  )
}
