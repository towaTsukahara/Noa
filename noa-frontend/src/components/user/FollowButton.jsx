import { useState } from "react";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import "./FollowButton.css";

/**
 * フォロー/解除のトグルボタン（F-113）。
 * props:
 *   handle           … 相手の handle
 *   initialFollowing … 初期のフォロー状態（/users/{handle} の isFollowing を渡す）
 *   onChanged        … 状態が変わったとき親へ通知（任意）
 * 自分自身に対しては何も表示しない（自己フォロー防止はサーバ側でも400で弾く）。
 */
function FollowButton({ handle, initialFollowing, onChanged }) {
  const { user } = useAuth();
  const [following, setFollowing] = useState(initialFollowing);
  const [busy, setBusy] = useState(false);

  if (user && user.handle === handle) return null;

  const toggle = async () => {
    setBusy(true);
    const next = !following;
    // 先に画面を更新（楽観的更新）
    setFollowing(next);
    if (onChanged) onChanged(next);
    try {
      await api(`/users/${handle}/follow`, {
        method: next ? "POST" : "DELETE",
      });
    } catch (e) {
      // 失敗したら元に戻す
      setFollowing(!next);
      if (onChanged) onChanged(!next);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      className={`follow-button ${following ? "is-following" : ""}`}
      onClick={toggle}
      disabled={busy}
    >
      {following ? "フォロー中" : "フォローする"}
    </button>
  );
}

export default FollowButton;