import { useState } from "react";
import CommentDeleteButton from "./CommentDeleteButton";
import MoreMenu from "../common/MoreMenu";
import CommentForm from "./CommentForm";
import ExpandableText from "../common/ExpandableText";
import "./CommentList.css";

// ハンドルから決定論的にアバターのトーン(1-7)を選ぶ（顔写真を使わない原則）
function toneFor(handle = "") {
    let h = 0;
    for (const ch of handle) h = (h + ch.charCodeAt(0)) % 7;
    return h + 1;
}

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
    const [expanded, setExpanded] = useState(false);
    const children = childrenMap[comment.id] || [];
    const isReplying = replyingTo === comment.id;

    return (
        <div className="comment-node">
            <div className="comment">
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

                    <div className="comment-body">
                        <ExpandableText text={comment.body} clampLines={3} />
                    </div>

                    {/* 操作：返信する / 返信を読む（展開トグル）を flex+gap でまとめる */}
                    <div className="comment-actions">
                        {!isReplying && (
                            <button className="comment-reply-btn" onClick={() => setReplyingTo(comment.id)}>
                                返信
                            </button>
                        )}
                        {children.length > 0 && (
                            <button className="comment-more" onClick={() => setExpanded(!expanded)}>
                                {expanded ? "返信を閉じる" : `返信を読む（${children.length}）`}
                            </button>
                        )}
                    </div>

                    {/* 返信フォーム（このコメントに返信中のときだけ） */}
                    {isReplying && (
                        <CommentForm
                            onAddComment={(text) => onAddReply(comment.id, text)}
                            onCancel={() => setReplyingTo(null)}
                        />
                    )}
                </div>
            </div>

            {/* 展開後：子（返信）を左レール付きでインデント描画 */}
            {expanded && children.length > 0 && (
                <div className="comment-children">
                    {children.map((child) => (
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
            )}
        </div>
    );
}