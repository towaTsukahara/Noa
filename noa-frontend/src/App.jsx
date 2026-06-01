import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TimelinePage from './pages/TimelinePage';
import LoginPage from './pages/LoginPage';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;