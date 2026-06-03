import { useState } from "react";
import "./TimelinePage.css";
import PostComposeModal from "../components/post/PostComposeModal";

const posts = [
  // ... 既存のモックデータはそのまま ...
];

function TimelinePage() {
  const [showCompose, setShowCompose] = useState(false);

  return (
    <div className="layout">
      {/* サイドバー */}
      <aside className="sidebar">
        <h1>Noa</h1>
        <nav>
          <ul>
            <li>タイムライン</li>
            <li>検索</li>
            <li>いいね一覧</li>
            <li>通知</li>
            <li>プロフィール</li>
          </ul>
        </nav>

        {/* 投稿ボタン */}
        <button className="compose-button" onClick={() => setShowCompose(true)}>
          投稿する
        </button>
      </aside>

      {/* メイン */}
      <div className="main">
        <header className="header">
          <input type="text" placeholder="検索..." />
          <button>🔔</button>
          <button>👤</button>
        </header>

        <section className="timeline">
          {posts.map((post) => (
            <article key={post.id} className="post-card">
              {/* ... 既存の投稿カードの中身はそのまま ... */}
              <div className="post-header">
                <div className="avatar"></div>
                <div>
                  <div className="nickname">{post.nickname}</div>
                  <div className="date">{post.createdAt}</div>
                </div>
              </div>
              <p className="content">{post.content}</p>
              <div className="tags">
                {post.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
              <div className="actions">
                <span>♡ {post.likes}</span>
                <span>💬 {post.replies}</span>
              </div>
            </article>
          ))}
        </section>
      </div>

      {/* 投稿モーダル（showCompose が true のときだけ表示） */}
      {showCompose && (
        <PostComposeModal
          onClose={() => setShowCompose(false)}
          onPosted={() => {
            // TODO(F-107): タイムラインをAPIから取得する実装にしたら、ここで再読込する。
            //              今はモックデータ表示のため、投稿しても一覧には反映されない。
            alert("投稿しました");
          }}
        />
      )}
    </div>
  );
}

export default TimelinePage;