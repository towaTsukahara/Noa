import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./NavBar.css";

// 上部バー（検索枠・通知・ログインユーザー表示・ログアウト）
function NavBar() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="header">
      {/* TODO(F-116): 検索は未実装。入力欄は仮置き */}
      <input type="text" placeholder="検索..." />

      {loading ? null : user ? (
        <>
          <span>{user.handle}</span>
          <button onClick={handleLogout}>ログアウト</button>
        </>
      ) : (
        <Link to="/login">ログイン</Link>
      )}
    </nav>
  );
}

export default NavBar;
