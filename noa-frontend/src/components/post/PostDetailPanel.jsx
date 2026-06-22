import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

import LikeButton from "./LikeButton";
import CommentNode from "./CommentNode";
import CommentForm from "./CommentForm";
import MoreMenu from "../common/MoreMenu";
import ReportModal from "../report/ReportModal";

import reply from '/icons/reply.svg';

import "./PostDetailPanel.css";

export default function PostDetailPanel() {
    const [searchParams, setSearchParams] = useSearchParams();
    const postId = searchParams.get("post"); // ?post=123
    const navigate = useNavigate();
    const { user } = useAuth();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [reportTarget, setReportTarget] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null); // 返信中のコメントid
    const [composing, setComposing] = useState(false);  // コメント入力欄を開いているか

    const commentRef = useRef(null);

    // パネルを閉じる＝?post を消す
    const close = () => {
        const next = new URLSearchParams(searchParams);
        next.delete("post");
        setSearchParams(next);
    };

    const loadComments = async () => {
        const data = await api(`/comments?postId=${postId}`);
        setComments(
            data.map((c) => ({
                id: c.id,
                authorHandle: c.authorName,
                authorNickname: c.authorNickname,
                body: c.body,
                parentCommentId: c.parentCommentId, // 親コメントid（ツリー用）
                mine: user && c.authorName === user.handle,
            }))
        );
    };

    // postId が変わるたびに読み込み直す（別の投稿を開いたとき）
    useEffect(() => {
        if (!postId) return;
        setLoading(true);
        setReplyingTo(null); // 投稿を切り替えたら返信状態をリセット
        setComposing(false); // コメント入力欄も閉じる
        const fetchAll = async () => {
            try {
                const data = await api(`/posts/${postId}`);
                setPost(data);
                await loadComments();
            } catch (error) {
                console.error("投稿取得失敗", error);
                setPost(null);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [postId]);

    // トップレベルのコメント投稿
    const handleAddComment = async (text) => {
        try {
            await api(`/comments`, {
                method: "POST",
                body: JSON.stringify({ postId: Number(postId), body: text }),
            });
            setComposing(false); // 投稿したら入力欄を閉じる
            await loadComments();
        } catch (error) {
            alert("コメントできませんでした。");
        }
    };

    // 返信を送信（parentCommentId 付き）
    const handleAddReply = async (parentCommentId, text) => {
        try {
            await api(`/comments`, {
                method: "POST",
                body: JSON.stringify({
                    postId: Number(postId),
                    body: text,
                    parentCommentId: parentCommentId,
                }),
            });
            setReplyingTo(null); // フォームを閉じる
            await loadComments(); // 再読込してツリー更新
        } catch (error) {
            alert("返信できませんでした。");
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await api(`/comments/${commentId}`, { method: "DELETE" });
            await loadComments();
        } catch (e) {
            alert("削除できませんでした。");
        }
    };

    // ?post が無ければパネルごと非表示
    if (!postId) return null;

    // コメントを親子のツリーに組み立てる（parentCommentId で分類）
    const childrenMap = {};
    for (const c of comments) {
        const pid = c.parentCommentId ?? "root";
        (childrenMap[pid] ||= []).push(c);
    }
    const topLevel = childrenMap["root"] || [];

    return (
        <aside className="detail-panel">
            <div className="detail-panel-head">
                <button className="panel-close" onClick={close} aria-label="閉じる">
                    <span className="panel-close-x">✕</span>閉じる
                </button>
            </div>

            <div className="detail-panel-body">
                {loading && <p className="empty-note">読み込み中...</p>}
                {!loading && !post && <p className="empty-note">投稿が見つかりません</p>}

                {!loading && post && (
                    <>
                        <div className="detail-author">
                            <span className="user-handle">{post.author.nickname || post.author.handle}</span>
                            <MoreMenu items={[
                                { label: "通報する", danger: true, onClick: () => setReportTarget({ type: "POST", id: post.id }) },
                            ]} />
                        </div>

                        <p className="detail-body">{post.body}</p>

                        <div className="detail-tags">
                            {post.tags?.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="tag"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => navigate(`/tag/${tag.id}`)}
                                >
                                    #{tag.name}
                                </span>
                            ))}
                        </div>

                        <div className="detail-actions">
                            <LikeButton
                                postId={post.id}
                                initialCount={post.likeCount}
                                initialLiked={post.likedByMe}
                            />
                            <span className="detail-comment-count">
                                <img src={reply} alt="返信" className="icon-reply" />
                                <span>{comments.length}</span>
                            </span>
                        </div>

                        {/* コメント入力（投稿本文の直下） */}
                        <div className="comment-compose">
                            {composing ? (
                                <CommentForm
                                    ref={commentRef}
                                    onAddComment={handleAddComment}
                                    onCancel={() => setComposing(false)}
                                    placeholder="コメントを書く"
                                    submitLabel="コメントする"
                                />
                            ) : (
                                <button className="comment-compose-open" onClick={() => setComposing(true)}>
                                    コメントする
                                </button>
                            )}
                        </div>

                        <div className="comments">
                            <h3>コメント</h3>
                            {topLevel.map((c) => (
                                <CommentNode
                                    key={c.id}
                                    comment={c}
                                    childrenMap={childrenMap}
                                    depth={0}
                                    onDeleteComment={handleDeleteComment}
                                    onReportComment={(commentId) => setReportTarget({ type: "COMMENT", id: commentId })}
                                    replyingTo={replyingTo}
                                    setReplyingTo={setReplyingTo}
                                    onAddReply={handleAddReply}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {reportTarget && (
                <ReportModal
                    targetType={reportTarget.type}
                    targetId={reportTarget.id}
                    onClose={() => setReportTarget(null)}
                />
            )}
        </aside>
    );
}