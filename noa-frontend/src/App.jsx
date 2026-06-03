import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TimelinePage from './pages/TimelinePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TagPage from './pages/TagPage';
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';
import TagEditPage from './pages/TagEditPage';
import PostCard from './components/post/PostCard';
import ProfileDitailPage from './pages/ProfileDitailPage';
import NavBar from './components/layout/NavBar';


function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<TimelinePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/tags/hobby" element={<TagPage type="hobby" />} />
        <Route path="/tags/skill" element={<TagPage type="skill" />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<ProfileEditPage />} />
        <Route path="/tags/skilledit" element={<TagEditPage type="skill" />} />
        <Route path="/tags/hobbyedit" element={<TagEditPage type="hobby" />} />
        <Route path="/tags/certedit" element={<TagEditPage type="cert" />} />
        <Route path="/postcard" element={<PostCard />} />
        <Route path="/profileditail" element={<ProfileDitailPage />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;