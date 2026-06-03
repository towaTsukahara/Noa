import { useState } from "react";
import { api } from "../../api/client";
import "../../pages/TimelinePage.css"; // モーダル用のクラスはここに定義

function PostComposePage({ onClose, onPosted }) {
  const [body, setBody] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const created = await api("/posts", {
        method: "POST",
        body: JSON.stringify({ body }),
      });
      if (onPosted) onPosted(created);
      if (onClose) onClose();
    } catch (e) {
      setError("投稿できませんでした。本文を確認してください（1〜1000文字）。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2 style={{ margin: 0 }}>呼称ほしい</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <textarea
          className="modal-textarea"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="いまどうしてる？"
          maxLength={1000}
        />
        <div className="modal-counter">{body.length}/1000</div>

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-actions">
          {/* TODO(フェーズ2): 画像・動画・コード・ファイルの添付はフェーズ2 */}
          <button
            className="modal-submit"
            onClick={handleSubmit}
            disabled={submitting || body.trim() === ""}
          >
            {submitting ? "投稿中..." : "投稿"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostComposePage;