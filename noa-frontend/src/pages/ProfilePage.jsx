import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("posts");

    const [editingPostId, setEditingPostId] = useState(null);
    const [editText, setEditText] = useState("");

    const [profile, setProfile] = useState({
        name: "20260027",
        icon: "https://via.placeholder.com/150",
        bio: "フロントエンドエンジニアです。",
        techTags: ["React", "JavaScript", "HTML", "CSS"],
        hobbyTags: ["ゲーム", "読書", "旅行"],
        postCount: 3,
        likeCount: 5,
        posts: [
            { id: 1, content: "Reactを勉強中です。" },
            { id: 2, content: "JavaScriptの復習をしています。" },
            { id: 3, content: "プロフィール画面を作成しました。" },
        ],
        likedPosts: [
            { id: 101, content: "React Hooks便利ですね。" },
            { id: 102, content: "Tailwind CSSを試してみた。" },
        ],
    });

    const handleEditClick = () => {
        navigate("/profile/edit");
    };

    const handlePostsClick = () => {
        setActiveTab("posts");
    };

    const handleLikesClick = () => {
        setActiveTab("likes");
    };

    const handleEdit = (post) => {
        setEditingPostId(post.id);
        setEditText(post.content);
    };

    const handleSave = (postId) => {
        setProfile((prev) => ({
            ...prev,
            posts: prev.posts.map((post) =>
                post.id === postId
                    ? { ...post, content: editText }
                    : post
            ),
        }));

        setEditingPostId(null);
        setEditText("");
    };

    const handleCancel = () => {
        setEditingPostId(null);
        setEditText("");
    };

    const handleDelete = (postId) => {
        const isConfirmed = window.confirm(
            "この投稿を削除しますか？"
        );

        if (!isConfirmed) {
            return;
        }

        setProfile((prev) => ({
            ...prev,
            posts: prev.posts.filter(
                (post) => post.id !== postId
            ),
        }));
    };

    return (
        <div>
            <div>
                <img
                    src={profile.icon}
                    alt="プロフィール画像"
                />

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

                <button onClick={handleEditClick}>
                    プロフィールを編集
                </button>
            </div>

            <div>
                <button onClick={handlePostsClick}>
                    投稿
                </button>

                <button onClick={handleLikesClick}>
                    いいね
                </button>
            </div>

            <div>
                {activeTab === "posts" &&
                    profile.posts.map((post) => (
                        <div
                            key={post.id}
                            style={{
                                border: "1px solid #ccc",
                                padding: "10px",
                                marginBottom: "10px",
                            }}
                        >
                            {editingPostId === post.id ? (
                                <>
                                    <textarea
                                        value={editText}
                                        onChange={(e) =>
                                            setEditText(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <br />

                                    <button
                                        onClick={() =>
                                            handleSave(post.id)
                                        }
                                    >
                                        保存
                                    </button>

                                    <button
                                        onClick={handleCancel}
                                    >
                                        キャンセル
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div>
                                        {post.content}
                                    </div>

                                    <button
                                        onClick={() =>
                                            handleEdit(post)
                                        }
                                    >
                                        編集
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                post.id
                                            )
                                        }
                                    >
                                        削除
                                    </button>
                                </>
                            )}
                        </div>
                    ))}

                {activeTab === "likes" &&
                    profile.likedPosts.map((post) => (
                        <div key={post.id}>
                            {post.content}
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default ProfilePage;
