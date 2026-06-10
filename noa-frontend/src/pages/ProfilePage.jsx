import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./ProfilePage.css";
import heart_filled from '/icons/heart_filled.svg';
import heart from '/icons/heart.svg';
import reply from '/icons/reply.svg';
import trashcan from '/icons/trashcan.svg';

function ProfilePage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("posts");

    // ===== 自分の投稿（APIから取得） =====
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(true);
    const [postsError, setPostsError] = useState(null);

    // ===== 自分がいいねした投稿（F-111） =====
    const [likedPosts, setLikedPosts] = useState([]);
    const [likesLoading, setLikesLoading] = useState(false);

    // ===== 自分のコメント（/comments/me） =====
    const [myComments, setMyComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(false);

    // ===== プロフィール表示部（F-104・別担当のためモックのまま） =====
    const [profile, setProfile] = useState(null);

    // 自分の投稿をAPIから取得
    const loadPosts = async () => {
        if (!user) return; // ログイン情報の復元前は何もしない
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

    // 自分がいいねした投稿を取得（F-111: GET /me/likes）
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

    // 自分のコメント一覧を取得（クリックで元投稿へ飛ぶ）
    const loadMyComments = async () => {
        setCommentsLoading(true);
        try {
            const data = await api("/comments/me"); // MyCommentResponse[]
            setMyComments(data);
        } catch (e) {
            // 失敗時は空のまま
        } finally {
            setCommentsLoading(false);
        }
    };

    // 投稿削除（F-108: 論理削除API。本人のみ204 / 他人は403）
    const handleDelete = async (postId) => {
        const isConfirmed = window.confirm("この投稿を削除しますか？");
        if (!isConfirmed) return;

        try {
            await api(`/posts/${postId}`, { method: "DELETE" });
            loadPosts(); // 削除後に一覧を再読込
            loadProfile(); //削除後にプロフィール情報再取得
        } catch (e) {
            alert("削除できませんでした。");
        }
    };

    //投稿・削除時、プロフィール情報再取得
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

    // いいねのトグル（投稿タブ用。likedByMe で POST/DELETE を出し分け）
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
            alert("いいねできませんでした。");
        }
    };

    const handleCommentsClick = () => {
        setActiveTab("comments");
        loadMyComments(); // タブを開いたタイミングで取得
    };

    // いいねタブの♥トグル（その場では一覧から消さず、押し直しできるようにする）
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
            alert("いいねできませんでした。");
        }
    };

    // ===== 画面遷移・タブ切替 =====
    const handleFollowClick = () => {
        navigate("/follow");
    };

    const handlePostsClick = () => {
        setActiveTab("posts");
    };

    const handleLikesClick = () => {
        setActiveTab("likes");
        loadLikes(); // タブを開いたタイミングで取得
    };

    const renderTags = (arr) =>
        (arr || []).map((t) => (
            <span key={t} className="tag">#{t}</span>
        ));

    const renderPostCard = (post, onLike) => (
        <div key={post.id} className="mini-post">
            <div className="mini-body">{post.body}</div>
            <div className="mini-meta">
                <button
                    className={`mini-like ${post.likedByMe ? "liked" : ""}`}
                    onClick={() => onLike(post)}
                >
                    <img
                        src={post.likedByMe ? heart_filled : heart}
                        alt="いいね"
                        className="icon-like"
                    />
                    <span>{post.likeCount}</span>
                </button>
                <span className="mini-reply">
                    <img
                        src={reply}
                        alt="返信"
                        className="icon-reply"
                    />
                    <span>{post.replyCount}</span>
                </span>
                {onLike === handleLikeToggle && (
                    <button className="mini-delete" onClick={() => handleDelete(post.id)}>
                        <img
                            src={trashcan}
                            alt="削除"
                            className="icon-delete"
                        />
                    </button>
                )};
            </div>
        </div>
    );


    return (
        <div className="profile page">
            {/* ===== プロフィール表示部（F-104・モックのまま） ===== */}
            <div className="profile-hero">
                <div className="profile-hero-top">
                    <div className="avatar is-lg"></div>
                    <div className="profile-id">
                        <div className="user-handle">{profile?.handle}</div>
                        <div className="profile-name">あなた</div>
                        <div className="profile-sub">
                            社員番号: {profile?.employeeNo} ・ {profile?.email}
                        </div>
                    </div>
                    <div className="profile-actions">
                        <button className="btn btn-ghost" onClick={() => navigate("/profile/edit")}>
                            プロフィールを編集
                        </button>
                        <button className="btn btn-ghost" onClick={handleFollowClick}>
                            フォロー
                        </button>
                    </div>
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

            {/* ===== タブ ===== */}
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

            {/* ===== 投稿タブ ===== */}
            {activeTab === "posts" && (
                <>
                    {postsLoading && <p className="empty-note">読み込み中...</p>}
                    {postsError && <p className="empty-note">{postsError}</p>}
                    {!postsLoading && !postsError && posts.length === 0 && (
                        <p className="empty-note">まだ投稿がありません。</p>
                    )}
                    {posts.map((post) => renderPostCard(post, handleLikeToggle))}
                </>
            )}

            {/* ===== いいねタブ（F-111: /me/likes） ===== */}
            {activeTab === "likes" && (
                <>
                    {likesLoading && <p className="empty-note">読み込み中...</p>}
                    {!likesLoading && likedPosts.length === 0 && (
                        <p className="empty-note">いいねした投稿はありません。</p>
                    )}
                    {likedPosts.map((post) => renderPostCard(post, handleLikedTabToggle))}
                </>
            )}

            {/* ===== コメントタブ（/comments/me。クリックで元投稿へ） ===== */}
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
                            onClick={() => navigate(`/post/${c.postId}`)}
                        >
                            <div className="mini-body">{c.commentBody}</div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

export default ProfilePage;
