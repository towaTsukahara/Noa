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
        likedPosts: [
            { id: 101, content: "React Hooks便利ですね。" },
            { id: 102, content: "Tailwind CSSを試してみた。" },
        ],
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

    // ===== 画面遷移・タブ切替 =====
    // dev側で追加された /follow への導線（F-113 フォロー中一覧の画面を想定）。
    // ラベルや配置はフォロー画面の担当と調整可。
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
    };

    // ※投稿の「編集」（handleEdit/handleSave）はフェーズ1の機能一覧・API仕様に
    //   存在しないため外している。必要なら要件追加をチームで合意してから実装する。

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
                {/* ===== 投稿タブ（API取得・削除あり） ===== */}
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
                                    ♡ {post.likeCount}　💬 {post.replyCount}
                                </div>
                                <button onClick={() => handleDelete(post.id)}>削除</button>
                            </div>
                        ))}
                    </>
                )}

                {/* ===== いいねタブ（F-111 未実装のためモックのまま） ===== */}
                {/* TODO(F-111): GET /me/likes 実装後にAPI取得へ差し替え */}
                {activeTab === "likes" &&
                    profile.likedPosts.map((post) => (
                        <div key={post.id}>{post.content}</div>
                    ))}
            </div>
        </div>
    );
}

export default ProfilePage;