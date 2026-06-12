import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import "./PostDetailPanel.css";

import LikeButton from "./LikeButton";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import MoreMenu from "../common/MoreMenu";
import ReportModal from "../report/ReportModal";

export default function PostDetailPanel() {
    const [searchParams, setSearchParams] = useSearchParams();
    const postId = searchParams.get("post"); // ?post=123
    const { user } = useAuth();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [reportTarget, setReportTarget] = useState(null);

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
                mine: user && c.authorName === user.handle,
            }))
        );
    };

    // postId が変わるたびに読み込み直す（別の投稿を開いたとき）
    useEffect(() => {
        if (!postId) return;
        setLoading(true);
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

    const handleAddComment = async (text) => {
        try {
            await api(`/comments`, {
                method: "POST",
                body: JSON.stringify({ postId: Number(postId), body: text }),
            });
            await loadComments();
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

    return (
        <aside className="detail-panel">
            <div className="detail-panel-head">
                <button className="backbtn" onClick={close}>✕ 閉じる</button>
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
                                <span key={tag} className="tag">#{tag}</span>
                            ))}
                        </div>

                        <div className="detail-actions">
                            <LikeButton
                                postId={post.id}
                                initialCount={post.likeCount}
                                initialLiked={post.likedByMe}
                            />
                        </div>

                        <CommentList
                            comments={comments}
                            onDeleteComment={handleDeleteComment}
                            onReportComment={(commentId) => setReportTarget({ type: "COMMENT", id: commentId })}
                        />
                        <CommentForm ref={commentRef} onAddComment={handleAddComment} />
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