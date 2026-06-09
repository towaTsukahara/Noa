import CommentDeleteButton from "./CommentDeleteButton";
import "./CommentList.css";

function CommentList({ comments, onDeleteComment }) {
  return (
    <div className="comments">
      <h3>コメント</h3>

      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <strong className="comment-author">{comment.author}</strong>

          <p className="comment-body">{comment.body}</p>

          {comment.mine && (
            <CommentDeleteButton
              onDelete={() => onDeleteComment(comment.id)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default CommentList;
