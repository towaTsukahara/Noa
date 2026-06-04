import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PostDetailPage() {
  const navigate = useNavigate();

  const [liked, setLiked] = useState(false);

  const [comments, setComments] = useState([
    {
      id: 1,
      user: "山田",
      text: "お疲れさまです！",
    },
    {
      id: 2,
      user: "佐藤",
      text: "良かったですね！",
    },
  ]);

  const [newComment, setNewComment] =
    useState("");

  const handleComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      user: "自分",
      text: newComment,
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "30px auto",
        padding: "20px",
      }}
    >
      <button
        onClick={() => navigate("/")}
      >
        ← タイムラインへ戻る
      </button>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
          marginTop: "20px",
        }}
      >
        {/* 投稿者 */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#ccc",
            }}
          />

          <div>
            <div
              style={{
                fontWeight: "bold",
              }}
            >
              カフェラテ
            </div>

            <div
              style={{
                color: "#666",
                fontSize: "12px",
              }}
            >
              10分前
            </div>
          </div>
        </div>

        {/* 本文 */}
        <p
          style={{
            lineHeight: "1.8",
            marginBottom: "20px",
          }}
        >
          今日はクライアントとの打ち合わせがうまくいって一安心。
          今日はクライアントとの打ち合わせがうまくいって一安心。
          今日はクライアントとの打ち合わせがうまくいって一安心。
          今日はクライアントとの打ち合わせがうまくいって一安心。
        </p>

        {/* タグ */}
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <span
            style={{
              border: "1px solid #ddd",
              padding: "4px 8px",
              borderRadius: "999px",
            }}
          >
            #ありがとう
          </span>
        </div>

        {/* アクション */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() =>
              setLiked(!liked)
            }
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
          >
            {liked ? "❤️ 24" : "🤍 23"}
          </button>

          <span>
            💬 {comments.length}
          </span>
        </div>

        <hr />

        {/* コメント一覧 */}
        <h3
          style={{
            marginTop: "20px",
            marginBottom: "15px",
          }}
        >
          コメント
        </h3>

        {comments.map((comment) => (
          <div
            key={comment.id}
            style={{
              padding: "12px 0",
              borderBottom:
                "1px solid #eee",
            }}
          >
            <strong>
              {comment.user}
            </strong>

            <div>{comment.text}</div>
          </div>
        ))}

        {/* コメント入力 */}
        <div
          style={{
            marginTop: "20px",
          }}
        >
          <textarea
            rows="4"
            value={newComment}
            onChange={(e) =>
              setNewComment(
                e.target.value
              )
            }
            placeholder="返信を書く..."
            style={{
              width: "100%",
              padding: "10px",
            }}
          />

          <button
            onClick={handleComment}
            style={{
              marginTop: "10px",
              padding:
                "8px 16px",
              cursor: "pointer",
            }}
          >
            返信する
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostDetailPage;