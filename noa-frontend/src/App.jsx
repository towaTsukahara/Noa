import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TimelinePage from './pages/TimelinePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TagPage from './pages/TagPage';
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';
import PostCard from './components/post/PostCard';
import ProfileDitailPage from './pages/ProfileDitailPage';
import NavBar from './components/layout/NavBar';
import PostDetailPage from "./pages/PostDetailPage";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<TimelinePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/tags/hobby" element={<TagPage type="hobby" />} />
        <Route path="/tags/skill" element={<TagPage type="skill" />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<ProfileEditPage />} />
        <Route path="/postcard" element={<PostCard />} />
        <Route path="/profileditail" element={<ProfileDitailPage />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;