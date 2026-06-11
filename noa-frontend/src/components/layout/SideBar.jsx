import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import "./SideBar.css";

// 左サイドバー（ログイン・登録以外の全画面に共通表示）
function SideBar({ onCompose }) {
  const [unread, setUnread] = useState(0);
  const location = useLocation();
  const { user } = useAuth();

  // 画面遷移のたびに未読数を取り直す
  useEffect(() => {
    api("/me/notifications/unread-count")
      .then((d) => setUnread(d.count))
      .catch(() => setUnread(0));
  }, [location.pathname]);

  return (
    <aside className="sidebar">
      <h1>Noa</h1>
      <nav>
        <ul>
          <li>
            <NavLink to="/" end>
              <span>タイムライン</span>
            </NavLink>
          </li>
          {/* TODO: 検索は未作成（F-116）。作成したらレイアウト内ルートに追加 */}
          <li>
            <NavLink to="/search">
              <span>検索</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/follow">
              <span>フォロー</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/notifications">
              <span>通知</span>
              {unread > 0 && <span className="nav-badge">{unread}</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile">
              <span>プロフィール</span>
            </NavLink>
          </li>

          {user && user.role === "ADMIN" && (
            <li>
              <NavLink to="/admin">
                <span>管理</span>
              </NavLink>
            </li>
          )}
          
        </ul>
      </nav>
      <button className="compose-button" onClick={onCompose}>
        投稿する
      </button>
    </aside>
  );
}

export default SideBar;