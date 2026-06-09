import { useState, useEffect } from "react";
import "./TimelinePage.css";
import "../components/post/LikeButton.css"; // インラインの .like-button 用
import { api } from "../api/client";
import UserHandle from "../components/user/UserHandle";
import { relativeTime } from "../utils/relativeTime";
import { Link, useOutletContext } from "react-router-dom";

function TimelinePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const PAGE_SIZE = 10; // 1ページの件数。動作確認しやすいよう10に（後で20に戻してOK）

  // レイアウト（投稿モーダル）から「投稿があった」通知を受け取る
  const { lastPostedAt } = useOutletContext();

  // タイムライン取得（1ページ目）
  const loadTimeline = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api(`/timeline?limit=${PAGE_SIZE}`);
      setPosts(data.items);
      setNextCursor(data.nextCursor);
    } catch (e) {
      setError("タイムラインの取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  // 続きを読み込む（カーソルページング）
  const loadMore = async () => {
    if (!nextCursor) return;
    setLoadingMore(true);
    try {
      const data = await api(`/timeline?cursor=${nextCursor}&limit=${PAGE_SIZE}`);
      setPosts((prev) => [...prev, ...data.items]); // 既存の下に継ぎ足す
      setNextCursor(data.nextCursor);
    } catch (e) {
      alert("読み込みに失敗しました。");
    } finally {
      setLoadingMore(false);
    }
  };

  // いいねのトグル（likedByMe に応じて POST / DELETE を出し分け）
  const handleLikeToggle = async (post) => {
    try {
      await api(`/posts/${post.id}/like`, {
        method: post.likedByMe ? "DELETE" : "POST",
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? {
              ...p,
              likedByMe: !p.likedByMe,
              likeCount: p.likedByMe ? p.likeCount - 1 : p.likeCount + 1,
            }
            : p
        )
      );
    } catch (e) {
      alert("いいねできませんでした。");
    }
  };

  // 初回表示時＋投稿があったときに読み込む
  useEffect(() => {
    loadTimeline();
  }, [lastPostedAt]);

  return (
    <section className="timeline">
      {loading && <p>読み込み中...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && posts.length === 0 && <p>まだ投稿がありません。</p>}

      {posts.map((post) => (
        <article key={post.id} className="post-card">
          <div className="post-header">
            <div className="avatar"></div>
            <div>
              <div className="nickname">
                <Link to={`/users/${post.author.handle}`} className="author-link">
                  <UserHandle user={post.author} />
                </Link>
              </div>
              <div className="date">{relativeTime(post.createdAt)}</div>
            </div>
          </div>

          <p className="content">{post.body}</p>

          {/* 投稿詳細への導線（F-109: 詳細画面はdev側で作成中） */}
          <Link to={`/post/${post.id}`} className="post-detail-link">
            詳細...
          </Link>

          <div className="tags">
            {post.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>

          <div className="actions">
            <button
              className={`like-button ${post.likedByMe ? "liked" : ""}`}
              onClick={() => handleLikeToggle(post)}
            >
              {post.likedByMe ? "♥" : "♡"} {post.likeCount}
            </button>
            <Link to={`/post/${post.id}?reply=1`} className="reply-button">
              💬 {post.replyCount}
            </Link>
          </div>
        </article>
      ))}

      {nextCursor && !loading && (
        <button className="load-more" onClick={loadMore} disabled={loadingMore}>
          {loadingMore ? "読み込み中..." : "もっと見る"}
        </button>
      )}
      {!loading && !error && posts.length > 0 && !nextCursor && (
        <p className="timeline-end">これ以上の投稿はありません</p>
      )}
    </section>
  );
}

export default TimelinePage;
