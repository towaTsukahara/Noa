import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// 上部バー（検索枠・通知・ログインユーザー表示・ログアウト）
function NavBar() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="header" style={{ gap: 12 }}>
      {/* TODO(F-116): 検索は未実装。入力欄は仮置き */}
      <input type="text" placeholder="検索..." />
      {/* TODO(F-117): 通知ベルは未実装 */}
      <button>🔔</button>

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