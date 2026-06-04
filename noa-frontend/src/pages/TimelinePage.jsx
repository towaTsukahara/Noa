import { useState, useEffect } from "react";
import "./TimelinePage.css";
import { api } from "../api/client";
import PostComposePage from "../components/post/PostComposeModal";
import UserHandle from "../components/user/UserHandle";
import { Link } from "react-router-dom";


function TimelinePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCompose, setShowCompose] = useState(false);

  // タイムライン取得（1ページ目）
  const loadTimeline = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api("/timeline");
      console.log(data.items);
      setPosts(data.items);
      // TODO(ページング): data.nextCursor を使った「もっと見る」は後で実装。
    } catch (e) {
      setError("タイムラインの取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  // 画面表示時に読み込む
  useEffect(() => {
    loadTimeline();
  }, []);

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
          {loading && <p>読み込み中...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && posts.length === 0 && <p>まだ投稿がありません。</p>}

          {posts.map((post) => (
            <article key={post.id} className="post-card">
              <div className="post-header">
                <div className="avatar"></div>
                <div>
                  <div className="nickname">
                    <UserHandle user={post.author} />
                  </div>
                  <div className="date">{post.createdAt}</div>
                </div>
              </div>

              <p className="content">{post.body}</p>
              <Link
                to={`/post/${post.id}`}
                className="post-detail-link"
              >
                詳細...
              </Link>

              <div className="tags">
                {post.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>

              <div className="actions">
                <span>♡ {post.likeCount}</span>
                <span>💬 {post.replyCount}</span>
              </div>
            </article>
          ))}
        </section>
      </div>

      {/* 投稿モーダル */}
      {showCompose && (
        <PostComposePage
          onClose={() => setShowCompose(false)}
          onPosted={() => {
            loadTimeline(); // 投稿後にタイムラインを再読込 → 自分の投稿が出る
          }}
        />
      )}
    </div>
  );
}

export default TimelinePage;