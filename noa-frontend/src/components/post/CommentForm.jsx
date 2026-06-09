import { useState } from "react";
import "./CommentList.css";

function CommentForm({ onAddComment }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;

    onAddComment(text);

    setText("");
  };

  return (
    <div className="comment-form">
      <textarea
        placeholder="コメントを書く"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
      />

      <button onClick={handleSubmit}>
        返信する
      </button>
    </div>
  );
}

export default CommentForm;
