import "./CommentList.css";
import trashcan from '/icons/trashcan.svg';

// コメント削除ボタン。確認ダイアログを挟んで onDelete を呼ぶだけ。
function CommentDeleteButton({ onDelete }) {
  const handleDelete = () => {
    if (window.confirm("このコメントを削除しますか？")) {
      onDelete();
    }
  };

  return (
    <button className="comment-del" onClick={handleDelete} aria-label="削除">
      <img src={trashcan} alt="削除" className="icon-delete" />
    </button>
  );
}

export default CommentDeleteButton;