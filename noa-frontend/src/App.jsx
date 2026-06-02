import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TimelinePage from './pages/TimelinePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
        <Link to="/" style={{ marginRight: 12 }}>タイムライン</Link>
        <Link to="/login">ログイン</Link>
      </nav>
      <Routes>
        <Route path="/" element={<TimelinePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<ProfileEditPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;