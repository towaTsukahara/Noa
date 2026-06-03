import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function NavBar() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav style={{ padding: "12px", borderBottom: "1px solid #ddd", display: "flex", gap: 12, alignItems: "center" }}>
      <Link to="/">タイムライン</Link>
      {loading ? null : user ? (
        <>
          <Link to="/profile">プロフィール</Link>
          <span style={{ marginLeft: "auto" }}>{user.handle}</span>
          <button onClick={handleLogout}>ログアウト</button>
        </>
      ) : (
        <Link to="/login" style={{ marginLeft: "auto" }}>ログイン</Link>
      )}
    </nav>
  );
}

export default NavBar;