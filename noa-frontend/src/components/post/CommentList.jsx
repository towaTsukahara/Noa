import CommentDeleteButton from "./CommentDeleteButton";
import MoreMenu from "../common/MoreMenu";
import "./CommentList.css";

function CommentList({ comments, onDeleteComment, onReportComment }) {
  return (
    <div className="comments">
      <h3>コメント</h3>

      {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="comment-head-row">
              <strong className="comment-author">{comment.authorNickname || comment.authorHandle}</strong>
              {comment.mine ? (
                <CommentDeleteButton onDelete={() => onDeleteComment(comment.id)} />
              ) : (
                <MoreMenu items={[
                  { label: "通報する", danger: true, onClick: () => onReportComment(comment.id) },
                ]} />
              )}
            </div>
            <p className="comment-body">{comment.body}</p>
          </div>
        ))}
    </div>
  );
}

export default CommentList;
