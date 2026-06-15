import { useState } from "react";
import { api } from "../../api/client";
import "./LikeButton.css";

// 投稿のいいねトグル（サーバに保存）。
// props: postId（対象）, initialCount（初期数）, initialLiked（自分が押し済みか）
function LikeButton({ postId, initialCount = 0, initialLiked = false }) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    setBusy(true);
    const nextLiked = !liked;
    // 先に画面を更新（楽観的更新）
    setLiked(nextLiked);
    setCount((c) => (nextLiked ? c + 1 : c - 1));
    try {
      await api(`/posts/${postId}/like`, {
        method: nextLiked ? "POST" : "DELETE",
      });
    } catch (e) {
      // 失敗したら元に戻す
      setLiked(!nextLiked);
      setCount((c) => (nextLiked ? c - 1 : c + 1));
      setError("いいねできませんでした。");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      className={`like-button ${liked ? "liked" : ""}`}
      onClick={handleClick}
      disabled={busy}
    >
      {liked ? "♥" : "♡"} {count}
    </button>
  );
}

export default LikeButton;