import { useState } from "react";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

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
    try {
      await api(`/users/${handle}/follow`, {
        method: following ? "DELETE" : "POST",
      });
      const next = !following;
      setFollowing(next);
      if (onChanged) onChanged(next);
    } catch (e) {
      alert("操作に失敗しました。");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={busy}
      style={{
        padding: "8px 20px",
        borderRadius: 999,
        cursor: "pointer",
        border: following ? "1px solid #ccc" : "none",
        background: following ? "#fff" : "#1a1a1a",
        color: following ? "#333" : "#fff",
        fontWeight: "bold",
      }}
    >
      {following ? "フォロー中" : "フォローする"}
    </button>
  );
}

export default FollowButton;