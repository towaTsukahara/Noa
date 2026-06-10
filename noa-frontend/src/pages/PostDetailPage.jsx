import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import "./PostDetailPage.css";

import LikeButton from "../components/post/LikeButton";
import CommentList from "../components/post/CommentList";
import CommentForm from "../components/post/CommentForm";

function PostDetailPage() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);

    const commentRef = useRef(null); // 返信欄への参照（フォーカス用）
    const { user } = useAuth();

    const loadComments = async () => {
        const data = await api(`/comments?postId=${id}`);
        setComments(
            data.map((c) => ({
                id: c.id,
                authorHandle: c.authorName,
                body: c.body,
                mine: user && c.authorName === user.handle, // 自分のコメントか（handleで判定）
            }))
        );
    };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const data = await api(`/posts/${id}`);
                setPost(data);
                await loadComments();
            } catch (error) {
                console.error("投稿取得失敗", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [id]);

    // ?reply=1 で来たら返信欄にフォーカス＋スクロール
    useEffect(() => {
        if (!loading && searchParams.get("reply") === "1" && commentRef.current) {
            commentRef.current.focus();
            commentRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [loading, searchParams]);

    const handleAddComment = async (text) => {
        try {
            await api(`/comments`, {
                method: "POST",
                body: JSON.stringify({ postId: Number(id), body: text }),
            });
            await loadComments(); // 投稿後に再読込
        } catch (error) {
            console.error("コメント投稿失敗", error);
            alert("返信できませんでした。");
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await api(`/comments/${commentId}`, { method: "DELETE" });
            await loadComments(); // 削除後に再読込
        } catch (e) {
            alert("削除できませんでした。");
        }
    };

    if (loading) {
        return <div className="post-detail page"><p className="empty-note">読み込み中...</p></div>;
    }
    if (!post) {
        return <div className="post-detail page"><p className="empty-note">投稿が見つかりません</p></div>;
    }

    return (
        <div className="post-detail page">
            <div className="page-pad detail-main">
                <div className="detail-author">
                    <span className="user-handle">{post.author.handle}</span>
                </div>

                <p className="detail-body">{post.body}</p>

                <div className="detail-tags">
                    {post.tags.map((tag) => (
                        <span key={tag} className="tag">#{tag}</span>
                    ))}
                </div>

                <div className="detail-tags">
                    {post.tags?.map((tag) => (
                        <span key={tag.id} className="tag">
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
                </div>
            </div>

            <CommentList comments={comments} onDeleteComment={handleDeleteComment} />
            <CommentForm ref={commentRef} onAddComment={handleAddComment} />
        </div>
    );
}

export default PostDetailPage;