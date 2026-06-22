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
import AppLayout from './components/layout/AppLayout';
import SearchPage from './pages/SearchPage';
import TagDetailPage from './pages/TagDetailPage';
import NotificationPage from './pages/NotificationPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUserDetailPage from './pages/AdminUserDetailPage';
import AdminReportsPage from './pages/AdminReportsPage';

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
          <Route path="/users/:handle" element={<OtherProfilePage />} />
          <Route path="/follow/tags" element={<FollowTagEditPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/tag/:tagId" element={<TagDetailPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/users/:id" element={<AdminUserDetailPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;