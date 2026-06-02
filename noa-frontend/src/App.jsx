import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TimelinePage from './pages/TimelinePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TagPage from './pages/TagPage';

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
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/tags/hobby" element={<TagPage type="hobby" />} />
        <Route path="/tags/skill" element={<TagPage type="skill" />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;