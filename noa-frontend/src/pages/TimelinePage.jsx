import "./TimelinePage.css";
import { Link } from "react-router-dom";
import { useState } from "react";

const posts = [
  {
    id: 1,
    userId: 101,
    nickname: "カフェラテ",
    createdAt: "10分前",
    content:
      "今日はクライアントとの打ち合わせがうまくいって一安心。今日はクライアントとの打ち合わせがうまくいって一安心。今日はクライアントとの打ち合わせがうまくいって一安心。今日はクライアントとの打ち合わせがうまくいって一安心。",
    tags: ["ありがとう"],
    likes: 23,
    replies: 4,
  },
  {
    id: 2,
    userId: 102,
    nickname: "ひつじ",
    createdAt: "25分前",
    content:
      "この業務フロー、もっとシンプルにできないかな？みんなの意見を聞いて改善案を考えたいです。",
    tags: ["アイデア"],
    likes: 15,
    replies: 6,
  },
];

function TimelinePage() {
  const [likedPosts, setLikedPosts] = useState([]);

  const handleLike = (postId) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(
        likedPosts.filter((id) => id !== postId)
      );
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  };

  return (
    <div className="layout">
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

      <div className="main">
        <header className="header">
          <input
            type="text"
            placeholder="検索..."
          />

          <button>🔔</button>
          <button>👤</button>
        </header>

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

              <Link
                to={`/post/${post.id}`}
                className="detail-link"
              >
                詳細...
              </Link>

              <div className="tags">
                {post.tags.map((tag) => (
                  <span key={tag}>
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="actions">
                <button
                  className="like-button"
                  onClick={() =>
                    handleLike(post.id)
                  }
                >
                  {likedPosts.includes(post.id)
                    ? "❤️"
                    : "🤍"}

                  {" "}

                  {likedPosts.includes(post.id)
                    ? post.likes + 1
                    : post.likes}
                </button>

                <Link
                  to={`/post/${post.id}`}
                  className="comment-link"
                >
                  💬 {post.replies}
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

export default TimelinePage;