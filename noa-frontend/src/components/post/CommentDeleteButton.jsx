import "./CommentList.css";

function CommentDeleteButton({ onDelete }) {
  const handleDelete = () => {
    const result = window.confirm(
      "本当に削除しますか？"
    );

    if (result) {
      onDelete();
    }
  };

  return (
    <button className="comment-delete" onClick={handleDelete}>
      削除
    </button>
  );
}

export default CommentDeleteButton;
