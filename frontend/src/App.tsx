// filepath: d:\Final\frontend\src\App.tsx
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from "./components/ui/ScrollToTop";
import Home from './pages/Home';
import Profile from './pages/Profile';
import Signup from './pages/signup';
import Login from './pages/login';
import SimplifyScreen from './pages/simplify-screen';
import About from './pages/About';
import Chatbot from './pages/ChatbotPage';
import Resource from './pages/NeurodivergentResources';
import Screening from './pages/resouce/DyslexiaScreening';
import Quiz from './pages/resouce/NeurodivergentQuiz';
import Articles from './pages/resouce/ArticlesPage';
import Videos from './pages/resouce/VideosPage';
import Reading from './pages/resouce/Reading_Aids';
import Focus from './pages/resouce/Focus_Enhancers';
import Forums from './pages/resouce/OnlineForums';
import SupportGroups from './pages/resouce/SupportGroups';
import ProtectedRoute from "./components/ProtectedRoute";
import Documents from './pages/documents';

export default function App() {
  return (
    <>
    <ScrollToTop /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/docs" element={<Documents />} />
        <Route
          path="/screen"
          element={
            <ProtectedRoute>
              <SimplifyScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <Chatbot />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <Resource />
            </ProtectedRoute>
          }
        />
        <Route
          path="/screening"
          element={
            <ProtectedRoute>
              <Screening />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/articles"
          element={
            <ProtectedRoute>
              <Articles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/videos"
          element={
            <ProtectedRoute>
              <Videos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reading-aids"
          element={
            <ProtectedRoute>
              <Reading />
            </ProtectedRoute>
          }
        />
        <Route
          path="/focus-enhancers"
          element={
            <ProtectedRoute>
              <Focus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/online-forums"
          element={
            <ProtectedRoute>
              <Forums />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support-groups"
          element={
            <ProtectedRoute>
              <SupportGroups />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}