import { Link } from "react-router-dom";

// 左サイドバー（ログイン・登録以外の全画面に共通表示）
function SideBar({ onCompose }) {
  return (
    <aside className="sidebar">
      <h1>Noa</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">タイムライン</Link>
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
            <Link to="/notifications">通知</Link>
          </li>
          <li>
            <Link to="/profile">プロフィール</Link>
          </li>
        </ul>
      </nav>
      <button className="compose-button" onClick={onCompose}>
        投稿する
      </button>
    </aside>
  );
}

export default SideBar;