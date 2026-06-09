import { NavLink } from "react-router-dom";
import "./SideBar.css";

// 左サイドバー（ログイン・登録以外の全画面に共通表示）
// Link → NavLink にすることで、現在地のメニューに .active が付く（選択状態の見た目）。
function SideBar({ onCompose }) {
  return (
    <aside className="sidebar">
      <h1>N<span>o</span>a</h1>
      <nav>
        <ul>
          <li>
            <NavLink to="/" end>タイムライン</NavLink>
          </li>
          {/* TODO: 以下は画面未作成（F-116 検索 / F-111 いいね一覧ページ / F-117 通知）。
              作成されたら App.jsx のレイアウト内ルートに追加する */}
          <li>
            <NavLink to="/search">検索</NavLink>
          </li>
          <li>
            <NavLink to="/likes">フォロータグ</NavLink>
          </li>
          <li>
            <NavLink to="/notifications">通知</NavLink>
          </li>
          <li>
            <NavLink to="/profile">プロフィール</NavLink>
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
