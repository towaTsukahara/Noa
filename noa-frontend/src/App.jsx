import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TimelinePage from './pages/TimelinePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import TagPage from './pages/TagPage';
import ProfilePage from './pages/ProfilePage';
import FollowPage from './pages/FollowPage';
import FollowTagEditPage from './pages/FollowTagEditPage';
import ProfileEditPage from './pages/ProfileEditPage';
import TagEditPage from './pages/TagEditPage';
import PostComposePage from './components/post/PostComposeModal';
import OtherProfilePage from './pages/OtherProfilePage';
import NavBar from './components/layout/NavBar';
import PostDetailPage from './pages/PostDetailPage';

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
        <Route path="/follow" element={<FollowPage />} />
        <Route path="/follow/skilltags" element={<FollowTagEditPage type="skill"/>} />
        <Route path="/follow/hobbytags" element={<FollowTagEditPage type="hobby"/>} />
        <Route path="/follow/certtags" element={<FollowTagEditPage type="cert"/>} />
        <Route path="/profile/edit" element={<ProfileEditPage />} />
        <Route path="/tags/skilledit" element={<TagEditPage type="skill" />} />
        <Route path="/tags/hobbyedit" element={<TagEditPage type="hobby" />} />
        <Route path="/tags/certedit" element={<TagEditPage type="cert" />} />
        <Route path="/post/new" element={<PostComposePage />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
        <Route path="/other-profile" element={<OtherProfilePage />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
