import "./TimelinePage.css";

const posts = [
  {
    id: 1,
    userId: 101,
    nickname: "カフェラテ",
    createdAt: "10分前",
    content: "今日はクライアントとの打ち合わせがうまくいって一安心。",
    tags: ["ありがとう"],
    likes: 23,
    replies: 4,
  },
  
];

function TimelinePage() {
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
      </aside>

      {/* メイン */}
      <div className="main">
        {/* ヘッダー */}
        <header className="header">
          <input
            type="text"
            placeholder="検索..."
          />

          <button>🔔</button>
          <button>👤</button>
        </header>

        {/* 投稿一覧 */}
        <section className="timeline">
          {posts.map((post) => (
            <article
              key={post.id}
              className="post-card"
            >
              <div className="post-header">
                <div className="avatar"></div>

                <div>
                  <div className="nickname">
                    {post.nickname}
                  </div>

                  <div className="date">
                    {post.createdAt}
                  </div>
                </div>
              </div>

              <p className="content">
                {post.content}
              </p>

              <div className="tags">
                {post.tags.map((tag) => (
                  <span key={tag}>
                    #{tag}
                  </span>
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
    </div>
  );
}

export default TimelinePage;