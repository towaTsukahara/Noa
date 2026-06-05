import { useState } from "react";

function CommentForm({ onAddComment }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;

    onAddComment(text);

    setText("");
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <textarea
        placeholder="コメントを書く"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        style={{
          width: "100%",
          padding: "8px",
        }}
      />

      <button
        onClick={handleSubmit}
        style={{
          marginTop: "8px",
        }}
      >
        返信する
      </button>
    </div>
  );
}

export default CommentForm;
