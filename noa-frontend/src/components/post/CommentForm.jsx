import { useState, forwardRef } from "react";
import CharCount from "../common/CharCount";

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
      <div className="comment-form-footer">
        <CharCount current={text.length} max={500} />
        <button onClick={handleSubmit} disabled={submitting || text.trim() === ""}>
          {submitting ? "送信中..." : "返信する"}
        </button>
      </div>
    </div>
  );
});

export default CommentForm;