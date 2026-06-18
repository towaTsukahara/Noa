import CommentDeleteButton from "./CommentDeleteButton";
import MoreMenu from "../common/MoreMenu";
import "./CommentList.css";

// ハンドルから決定論的にアバターのトーン(1-7)を選ぶ（顔写真を使わない原則）
function toneFor(handle = "") {
  let h = 0;
  for (const ch of handle) h = (h + ch.charCodeAt(0)) % 7;
  return h + 1;
}

function CommentList({ comments, onDeleteComment, onReportComment }) {
  return (
    <div className="comments">
      <h3>コメント</h3>

      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <span className={`avatar is-sm tone-${toneFor(comment.authorHandle)}`} />
          <div className="comment-main">
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
        </div>
      ))}
    </div>
  );
}

export default CommentList;
