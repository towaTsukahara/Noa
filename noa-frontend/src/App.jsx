import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TimelinePage from './pages/TimelinePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import TagPage from './pages/TagPage';
import ProfilePage from './pages/ProfilePage';
import FollowPage from './pages/FollowPage';
import FollowTagEditPage from './pages/FollowTagEditPage';
import ProfileEditPage from './pages/ProfileEditPage';
import TagEditPage from './pages/TagEditPage';
import OtherProfilePage from './pages/OtherProfilePage';
import PostDetailPage from './pages/PostDetailPage';
import AppLayout from './components/layout/AppLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== 認証系：共通レイアウトなし（全画面表示） ===== */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ===== それ以外：共通レイアウト（左サイドバー＋上部バー）の中 ===== */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<TimelinePage />} />
          <Route path="/tags/hobby" element={<TagPage type="hobby" />} />
          <Route path="/tags/skill" element={<TagPage type="skill" />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/follow" element={<FollowPage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
          <Route path="/tags/skilledit" element={<TagEditPage type="skill" />} />
          <Route path="/tags/hobbyedit" element={<TagEditPage type="hobby" />} />
          <Route path="/tags/certedit" element={<TagEditPage type="cert" />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/users/:handle" element={<OtherProfilePage />} />
          <Route path="/follow/tags" element={<FollowTagEditPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;