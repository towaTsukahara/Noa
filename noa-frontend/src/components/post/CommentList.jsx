import CommentDeleteButton from "./CommentDeleteButton";

function CommentList({ comments, onDeleteComment }) {
  return (
    <div>
      <h3>コメント</h3>

      {comments.map((comment) => (
        <div
          key={comment.id}
          style={{
            borderBottom: "1px solid #ddd",
            padding: "8px 0",
          }}
        >
          <strong>{comment.author}</strong>

          <p>{comment.body}</p>

          {comment.mine && (
            <CommentDeleteButton
              onDelete={() =>
                onDeleteComment(comment.id)
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default CommentList;