import { useState, forwardRef } from "react";

// 返信フォーム。スタイルは CommentList.css の .comment-form を利用。
// ref は textarea に転送（?reply=1 で自動フォーカスするため）。
const CommentForm = forwardRef(function CommentForm({ onAddComment }, ref) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await onAddComment(text);
      setText("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="comment-form">
      <textarea
        ref={ref}
        placeholder="返信を書く"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={500}
      />
      <button onClick={handleSubmit} disabled={submitting || text.trim() === ""}>
        {submitting ? "送信中..." : "返信する"}
      </button>
    </div>
  );
});

export default CommentForm;