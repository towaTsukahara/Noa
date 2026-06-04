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
    <button onClick={handleDelete}>
      削除
    </button>
  );
}

export default CommentDeleteButton;