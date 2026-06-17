import { useState } from "react";
import CommentDeleteButton from "./CommentDeleteButton";
import MoreMenu from "../common/MoreMenu";
import CommentForm from "./CommentForm";
import "./CommentList.css";

// コメント1件＝1ノード。再帰的に返信を描画する。
// childrenMap: 親id → 子コメント配列 のマップ
// depth: 階層の深さ（インデント用）
export default function CommentNode({
    comment,
    childrenMap,
    depth,
    onDeleteComment,
    onReportComment,
    replyingTo,
    setReplyingTo,
    onAddReply,
}) {
    const [expanded, setExpanded] = useState(false); // この返信群を開いているか
    const children = childrenMap[comment.id] || [];
    const isReplying = replyingTo === comment.id;

    return (
        <div className="comment" style={{ marginLeft: depth * 16 }}>
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

            {/* 返信する／キャンセル */}
            <button
                className="comment-reply-btn"
                onClick={() => setReplyingTo(isReplying ? null : comment.id)}
            >
                {isReplying ? "キャンセル" : "返信する"}
            </button>

            {/* 返信フォーム（このコメントに返信中のときだけ） */}
            {isReplying && (
                <CommentForm onAddComment={(text) => onAddReply(comment.id, text)} />
            )}

            {/* 子（返信）がいて未展開なら「返信を読む」 */}
            {children.length > 0 && !expanded && (
                <button className="comment-more" onClick={() => setExpanded(true)}>
                    返信を読む（{children.length}件）
                </button>
            )}

            {/* 展開後：子ノードを再帰描画 */}
            {expanded && children.map((child) => (
                <CommentNode
                    key={child.id}
                    comment={child}
                    childrenMap={childrenMap}
                    depth={depth + 1}
                    onDeleteComment={onDeleteComment}
                    onReportComment={onReportComment}
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                    onAddReply={onAddReply}
                />
            ))}
        </div>
    );
}