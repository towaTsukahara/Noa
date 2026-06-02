import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TimelinePage from './pages/TimelinePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';
import PostCard from './components/post/PostCard';
import ProfileDitailPage from './pages/ProfileDitailPage';
import NavBar from './components/layout/NavBar';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<TimelinePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<ProfileEditPage />} />
        <Route path="/postcard" element={<PostCard />} />
        <Route path="/profileditail" element={<ProfileDitailPage />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;