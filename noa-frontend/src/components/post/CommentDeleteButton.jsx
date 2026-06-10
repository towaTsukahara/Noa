import "./CommentList.css"; // 削除ボタンのスタイルも一覧CSSにまとめる

// コメント削除ボタン。確認ダイアログを挟んで onDelete を呼ぶだけ。
function CommentDeleteButton({ onDelete }) {
  const handleDelete = () => {
    if (window.confirm("このコメントを削除しますか？")) {
      onDelete();
    }
  };

  return (
    <button className="btn-danger comment-del" onClick={handleDelete}>
      削除
    </button>
  );
}

export default CommentDeleteButton;