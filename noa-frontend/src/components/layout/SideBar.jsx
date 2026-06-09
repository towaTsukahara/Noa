import { Link } from "react-router-dom";
import { useState } from "react";

// 左サイドバー（ログイン・登録以外の全画面に共通表示）
function SideBar({ onCompose }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* 背景（クリックで閉じる） */}
      <button
        className="menu-button"
        onClick={toggleMenu}
      >
        {isOpen ? "×" : "☰"}
      </button>
      {/* 背景 */}
      {isOpen && (
        <div className="overlay" onClick={() => setIsOpen(false)}></div>
      )}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <h1>Noa</h1>
        <nav>
          <ul className="sidebar-menu">
            <li className="active">
              <Link to="/" className="sidebar-button">
                <span className="icon">📈</span>
                タイムライン</Link>
            </li>
            {/* TODO: 以下は画面未作成（F-116 検索 / F-111 いいね一覧ページ / F-117 通知）。
              作成されたら App.jsx のレイアウト内ルートに追加する */}
            <li>
              <Link to="/search">検索</Link>
            </li>
            <li>
              <Link to="/likes">いいね一覧</Link>
            </li>
            <li>
              <Link to="/notifications">
                <span className="icon">🔔</span>
                通知
              </Link>
            </li>
            <li>
              <Link to="/profile">
                <span className="icon">👤</span>
                プロフィール
              </Link>
            </li>
          </ul>
        </nav>
        <button className="compose-button" onClick={onCompose}>
          投稿する
        </button>
      </aside>
    </>
  );
}

export default SideBar;