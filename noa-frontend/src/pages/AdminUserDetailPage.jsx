import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { relativeTime } from "../utils/relativeTime";
import "./AdminDashboardPage.css";

export default function AdminUserDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [tab, setTab] = useState("posts");
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.role !== "ADMIN") navigate("/", { replace: true });
    }, [user]);

    const loadPosts = async () => {
        setLoading(true);
        try {
            const data = await api(`/admin/users/${id}/posts`);
            setPosts(data);
        } catch (e) { /* 空 */ } finally { setLoading(false); }
    };

    const loadComments = async () => {
        setLoading(true);
        try {
            const data = await api(`/admin/users/${id}/comments`);
            setComments(data);
        } catch (e) { /* 空 */ } finally { setLoading(false); }
    };

    // タブに応じて読み込み
    useEffect(() => {
        if (tab === "posts") loadPosts();
        else loadComments();
    }, [id, tab]);

    const handleDeletePost = async (postId) => {
        if (!window.confirm("この投稿を削除しますか？（管理者削除）")) return;
        try {
            await api(`/admin/posts/${postId}`, { method: "DELETE" });
            await loadPosts();
        } catch (e) { ErrorBanner("削除に失敗しました。"); }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("このコメントを削除しますか？（管理者削除）")) return;
        try {
            await api(`/admin/comments/${commentId}`, { method: "DELETE" });
            await loadComments();
        } catch (e) { ErrorBanner("削除に失敗しました。"); }
    };

    return (
        <div className="admin page">
            <button className="backbtn" onClick={() => navigate("/admin")}>← 一覧へ戻る</button>
            <h2 className="page-title">ユーザーの言動（管理）</h2>

            <div className="tabs">
                <button className={`tab ${tab === "posts" ? "active" : ""}`} onClick={() => setTab("posts")}>
                    投稿
                </button>
                <button className={`tab ${tab === "comments" ? "active" : ""}`} onClick={() => setTab("comments")}>
                    コメント
                </button>
            </div>

            {loading && <p className="empty-note">読み込み中...</p>}

            {/* 投稿タブ */}
            {!loading && tab === "posts" && (
                <>
                    {posts.length === 0 && <p className="empty-note">生きている投稿はありません。</p>}
                    {posts.map((p) => (
                        <div
                            key={p.id}
                            className="mini-post"
                            onClick={() => navigate(`?post=${p.id}`)}
                            style={{ cursor: "pointer" }}
                        >
                            <div className="admin-post-head">
                                <span className="user-handle">{p.authorHandle}</span>
                                <button className="btn-danger admin-btn-sm" onClick={(e) => { e.stopPropagation(); handleDeletePost(p.id); }}>削除</button>
                            </div>
                            <div className="mini-body">{p.body}</div>
                            <div className="mini-meta">
                                <span>♡ {p.likeCount}</span>
                                <span>💬 {p.replyCount}</span>
                                <span>{relativeTime(p.createdAt)}</span>
                            </div>
                        </div>
                    ))}
                </>
            )}

            {/* コメントタブ */}
            {!loading && tab === "comments" && (
                <>
                    {comments.length === 0 && <p className="empty-note">コメントはありません。</p>}
                    {comments.map((c) => (
                        <div key={c.id} className="mini-post">
                            <div className="admin-post-head">
                                <span className="user-handle">{c.authorHandle}</span>
                                <button className="btn-danger admin-btn-sm" onClick={() => handleDeleteComment(c.id)}>削除</button>
                            </div>
                            <div className="mini-body">{c.body}</div>
                            <div className="mini-meta">
                                <span
                                    style={{ cursor: "pointer", color: "var(--accent)" }}
                                    onClick={() => navigate(`?post=${c.postId}`)}
                                >
                                    元の投稿を見る →
                                </span>
                                <span>{relativeTime(c.createdAt)}</span>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}