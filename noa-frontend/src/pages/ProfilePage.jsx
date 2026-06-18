import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { relativeTime } from "../utils/relativeTime";
import "./ProfilePage.css";
import ExpandableText from "../components/common/ExpandableText";
import ConfirmModal from "../components/common/ConfirmModal";
import MiniPostCard from "../components/post/MiniPostCard";
import trashcan from '/icons/trashcan.svg';

function ProfilePage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("posts");

    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(true);
    const [postsError, setPostsError] = useState(null);

    const [likedPosts, setLikedPosts] = useState([]);
    const [likesLoading, setLikesLoading] = useState(false);

    const [myComments, setMyComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(false);

    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    // 確認モーダル（message と、OKしたら実行する関数を持つ）
    const [confirm, setConfirm] = useState(null);

    const loadPosts = async () => {
        if (!user) return;
        setPostsLoading(true);
        setPostsError(null);
        try {
            const data = await api(`/users/${user.handle}/posts`);
            setPosts(data.items);
        } catch (e) {
            setPostsError("投稿の取得に失敗しました。");
        } finally {
            setPostsLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, [user]);

    const loadLikes = async () => {
        setLikesLoading(true);
        try {
            const data = await api("/me/likes");
            setLikedPosts(data.items);
        } catch (e) {
            // 失敗時は空のまま
        } finally {
            setLikesLoading(false);
        }
    };

    const loadMyComments = async () => {
        setCommentsLoading(true);
        try {
            const data = await api("/comments/me");
            setMyComments(data);
        } catch (e) {
            // 失敗時は空のまま
        } finally {
            setCommentsLoading(false);
        }
    };

    // 投稿削除：確認モーダルを開く
    const handleDelete = (postId) => {
        setConfirm({
            message: "この投稿を削除しますか？この操作は取り消せません。",
            onConfirm: async () => {
                try {
                    await api(`/posts/${postId}`, { method: "DELETE" });
                    loadPosts();
                    loadProfile();
                } catch (e) {
                    setError("削除できませんでした。");
                }
            },
        });
    };

    // プロフィールのタグ（文字列）から、そのタグの投稿一覧へ
    const goToTag = async (tagName) => {
        try {
            const data = await api(`/tags/by-name/${encodeURIComponent(tagName)}`);
            navigate(`/tag/${data.id}`);
        } catch (e) {
            setError("タグを開けませんでした。");
        }
    };

    const loadProfile = async () => {
        try {
            const me = await api("/me");
            setProfile(me);
        } catch {
            setProfile(null);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleLikeToggle = async (post) => {
        try {
            await api(`/posts/${post.id}/like`, {
                method: post.likedByMe ? "DELETE" : "POST",
            });
            setPosts((prev) =>
                prev.map((p) =>
                    p.id === post.id
                        ? {
                            ...p,
                            likedByMe: !p.likedByMe,
                            likeCount: p.likedByMe ? p.likeCount - 1 : p.likeCount + 1,
                        }
                        : p
                )
            );
        } catch (e) {
            setError("いいねできませんでした。");
        }
    };

    const handleCommentsClick = () => {
        setActiveTab("comments");
        loadMyComments();
    };

    const handleLikedTabToggle = async (post) => {
        try {
            await api(`/posts/${post.id}/like`, {
                method: post.likedByMe ? "DELETE" : "POST",
            });
            setLikedPosts((prev) =>
                prev.map((p) =>
                    p.id === post.id
                        ? {
                            ...p,
                            likedByMe: !p.likedByMe,
                            likeCount: p.likedByMe ? p.likeCount - 1 : p.likeCount + 1,
                        }
                        : p
                )
            );
        } catch (e) {
            setError("いいねできませんでした。");
        }
    };

    const handleFollowClick = () => {
        navigate("/follow");
    };

    const handlePostsClick = () => {
        setActiveTab("posts");
    };

    const handleLikesClick = () => {
        setActiveTab("likes");
        loadLikes();
    };

    const renderTags = (arr) =>
        (arr || []).map((t) => (
            <span
                key={t}
                className="tag"
                style={{ cursor: "pointer" }}
                onClick={() => goToTag(t)}
            >
                #{t}
            </span>
        ));

    // コメント削除：確認モーダルを開く
    const handleDeleteComment = (commentId) => {
        setConfirm({
            message: "このコメントを削除しますか？",
            onConfirm: async () => {
                try {
                    await api(`/comments/${commentId}`, { method: "DELETE" });
                    loadMyComments();
                } catch (e) {
                    setError("削除できませんでした。");
                }
            },
        });
    };

    return (
        <div className="profile page">
            <div className="profile-hero">
                <div className="profile-hero-top">
                    <div className="avatar is-lg"></div>
                    <div className="profile-id">
                        <div className="user-handle">{profile?.handle}</div>
                        <div className="profile-name">あなた</div>
                        <div className="profile-sub">
                            社員番号: {profile?.employeeNo}<br />
                            メールアドレス: {profile?.email}
                        </div>
                    </div>
                </div>
                <div className="profile-actions">
                    <button className="btn btn-ghost" onClick={() => navigate("/profile/edit")}>
                        プロフィールを編集
                    </button>
                    <button className="btn btn-ghost" onClick={handleFollowClick}>
                        フォロー一覧
                    </button>
                </div>

                <div className="profile-stats">
                    <span>投稿 <b>{profile?.postCount ?? 0}</b></span>
                    <span>いいね <b>{profile?.likeCount ?? 0}</b></span>
                </div>

                {profile?.bio && <p className="profile-bio">{profile.bio}</p>}

                <div className="profile-tagset">
                    <div className="tag-group">
                        <div className="tag-group-label">技術スタック</div>
                        <div className="tag-row">{renderTags(profile?.tags?.tech)}</div>
                    </div>
                    <div className="tag-group">
                        <div className="tag-group-label">興味</div>
                        <div className="tag-row">{renderTags(profile?.tags?.hobby)}</div>
                    </div>
                    <div className="tag-group">
                        <div className="tag-group-label">趣味</div>
                        <div className="tag-row">{renderTags(profile?.tags?.cert)}</div>
                    </div>
                </div>
            </div>

            <div className="tabs">
                <button
                    className={`tab ${activeTab === "posts" ? "active" : ""}`}
                    onClick={handlePostsClick}
                >
                    投稿
                </button>
                <button
                    className={`tab ${activeTab === "likes" ? "active" : ""}`}
                    onClick={handleLikesClick}
                >
                    いいね
                </button>
                <button
                    className={`tab ${activeTab === "comments" ? "active" : ""}`}
                    onClick={handleCommentsClick}
                >
                    コメント
                </button>
            </div>

            {activeTab === "posts" && (
                <>
                    {postsLoading && <p className="empty-note">読み込み中...</p>}
                    {postsError && <p className="empty-note">{postsError}</p>}
                    {!postsLoading && !postsError && posts.length === 0 && (
                        <p className="empty-note">まだ投稿がありません。</p>
                    )}
                    {posts.map((post) => (
                        <MiniPostCard
                            key={post.id}
                            post={post}
                            onLike={handleLikeToggle}
                            onDelete={(p) => handleDelete(p.id)}
                            showAuthor={false}
                        />
                    ))}
                </>
            )}

            {activeTab === "likes" && (
                <>
                    {likesLoading && <p className="empty-note">読み込み中...</p>}
                    {!likesLoading && likedPosts.length === 0 && (
                        <p className="empty-note">いいねした投稿はありません。</p>
                    )}
                    {likedPosts.map((post) => (
                        <MiniPostCard
                            key={post.id}
                            post={post}
                            onLike={handleLikedTabToggle}
                            showAuthor={false}
                        />
                    ))}
                </>
            )}

            {activeTab === "comments" && (
                <>
                    {commentsLoading && <p className="empty-note">読み込み中...</p>}
                    {!commentsLoading && myComments.length === 0 && (
                        <p className="empty-note">コメントした投稿はありません。</p>
                    )}
                    {myComments.map((c) => (
                        <div
                            key={c.commentId}
                            className="mini-post profile-comment"
                            onClick={() => navigate(`?post=${c.postId}`)}
                            style={{ cursor: "pointer" }}
                        >
                            <div className="mini-body">
                                <ExpandableText text={c.commentBody} clampLines={5} />
                            </div>
                            <div className="mini-meta">
                                <span className="mini-time">{relativeTime(c.commentedAt)}</span>
                                <button
                                    className="mini-delete"
                                    onClick={(e) => { e.stopPropagation(); handleDeleteComment(c.commentId); }}
                                >
                                    <img src={trashcan} alt="削除" className="icon-delete" />
                                </button>
                            </div>
                        </div>
                    ))}
                </>
            )}

            <ConfirmModal
                open={confirm !== null}
                title="確認"
                message={confirm?.message}
                confirmLabel="削除する"
                onConfirm={() => { confirm.onConfirm(); setConfirm(null); }}
                onCancel={() => setConfirm(null)}
            />
        </div>
    );
}

export default ProfilePage;