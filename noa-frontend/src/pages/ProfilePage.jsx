import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

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

    // ===== プロフィール表示部（F-104・別担当のためモックのまま） =====
    // TODO(F-104): /me から bio・タグを取得して表示に差し替える（担当メンバーの範囲）
    // TODO(F-104/F-112): 投稿数・いいね数の実数表示も後で対応
    const [profile] = useState({
        name: "20260027",
        icon: "https://via.placeholder.com/150",
        bio: "フロントエンドエンジニアです。",
        techTags: ["React", "JavaScript", "HTML", "CSS"],
        hobbyTags: ["ゲーム", "読書", "旅行"],
        postCount: 3,
        likeCount: 5,
    });

    // 自分の投稿をAPIから取得
    const loadPosts = async () => {
        if (!user) return; // ログイン情報の復元前は何もしない
        setPostsLoading(true);
        setPostsError(null);
        try {
            const data = await api(`/users/${user.handle}/posts`);
            setPosts(data.items);
            // TODO(表示の仕上げ): data.nextCursor を使った「もっと見る」は後で実装
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
            // TODO(表示の仕上げ): nextCursor の「もっと見る」は後で
        } catch (e) {
            // 失敗時は空のまま
        } finally {
            setLikesLoading(false);
        }
    };

    // 投稿削除（F-108: 論理削除API。本人のみ204 / 他人は403）
    const handleDelete = async (postId) => {
        const isConfirmed = window.confirm("この投稿を削除しますか？");
        if (!isConfirmed) return;

        try {
            await api(`/posts/${postId}`, { method: "DELETE" });
            loadPosts(); // 削除後に一覧を再読込
        } catch (e) {
            alert("削除できませんでした。");
        }
    };

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
    // dev側で追加された /follow への導線（F-113 フォロー中一覧の画面を想定）
    const handleFollowClick = () => {
        navigate("/follow");
    };

    const handleEditClick = () => {
        navigate("/profile/edit");
    };

    const handlePostsClick = () => {
        setActiveTab("posts");
    };

    const handleLikesClick = () => {
        setActiveTab("likes");
        loadLikes(); // タブを開いたタイミングで取得
    };

    // ※投稿の「編集」はフェーズ1の機能一覧・API仕様に存在しないため未実装。
    //   必要なら要件追加をチームで合意してから実装する。

    return (
        <div>
            {/* ===== プロフィール表示部（F-104・モックのまま） ===== */}
            <div>
                <img src={profile.icon} alt="プロフィール画像" />
                <div>{profile.name}</div>
                <div>
                    <div>投稿数 {profile.postCount}</div>
                    <div>いいね数 {profile.likeCount}</div>
                </div>
            </div>

            <div>
                <div>{profile.bio}</div>
                <div>
                    <h3>技術タグ</h3>
                    {profile.techTags.map((tag) => (
                        <div key={tag}>{tag}</div>
                    ))}
                </div>
                <div>
                    <h3>趣味タグ</h3>
                    {profile.hobbyTags.map((tag) => (
                        <div key={tag}>{tag}</div>
                    ))}
                </div>

                <button onClick={handleFollowClick}>フォロー</button>
                <button onClick={handleEditClick}>プロフィールを編集</button>
            </div>

            <div>
                <button onClick={handlePostsClick}>投稿</button>
                <button onClick={handleLikesClick}>いいね</button>
            </div>

            <div>
                {/* ===== 投稿タブ（API取得・削除・いいねトグル） ===== */}
                {activeTab === "posts" && (
                    <>
                        {postsLoading && <p>読み込み中...</p>}
                        {postsError && <p style={{ color: "red" }}>{postsError}</p>}
                        {!postsLoading && !postsError && posts.length === 0 && (
                            <p>まだ投稿がありません。</p>
                        )}

                        {posts.map((post) => (
                            <div
                                key={post.id}
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "10px",
                                    marginBottom: "10px",
                                }}
                            >
                                <div>{post.body}</div>
                                <div style={{ color: "#666", fontSize: "13px", marginTop: "6px" }}>
                                    <button
                                        onClick={() => handleLikeToggle(post)}
                                        style={{
                                            border: "none",
                                            background: "none",
                                            cursor: "pointer",
                                            padding: 0,
                                            fontSize: "13px",
                                            color: post.likedByMe ? "#e0245e" : "#666",
                                            fontWeight: post.likedByMe ? "bold" : "normal",
                                        }}
                                    >
                                        {post.likedByMe ? "♥" : "♡"} {post.likeCount}
                                    </button>
                                    　💬 {post.replyCount}
                                </div>
                                <button onClick={() => handleDelete(post.id)}>削除</button>
                            </div>
                        ))}
                    </>
                )}

                {/* ===== いいねタブ（F-111: /me/likes） ===== */}
                {activeTab === "likes" && (
                    <>
                        {likesLoading && <p>読み込み中...</p>}
                        {!likesLoading && likedPosts.length === 0 && (
                            <p>いいねした投稿はありません。</p>
                        )}
                        {likedPosts.map((post) => (
                            <div
                                key={post.id}
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "10px",
                                    marginBottom: "10px",
                                }}
                            >
                                <div>{post.body}</div>
                                <div style={{ color: "#666", fontSize: "13px", marginTop: "6px" }}>
                                    <button
                                        onClick={() => handleLikedTabToggle(post)}
                                        style={{
                                            border: "none",
                                            background: "none",
                                            cursor: "pointer",
                                            padding: 0,
                                            fontSize: "13px",
                                            color: post.likedByMe ? "#e0245e" : "#666",
                                            fontWeight: post.likedByMe ? "bold" : "normal",
                                        }}
                                    >
                                        {post.likedByMe ? "♥" : "♡"} {post.likeCount}
                                    </button>
                                    　💬 {post.replyCount}
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;