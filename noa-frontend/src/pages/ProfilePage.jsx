import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("posts");

    const [profile] = useState({
        name: "20260027",
        icon: "https://via.placeholder.com/150",
        bio: "フロントエンドエンジニアです。",
        skillTags: ["React", "JavaScript", "HTML", "CSS"],
        hobbyTags: ["ゲーム", "読書", "旅行"],
        certTags: ["基本情報技術者", "応用情報技術者"],
        postCount: 3,
        likeCount: 5,
        posts: [
            { id: 1, content: "Reactを勉強中です。", },
            { id: 2, content: "JavaScriptの復習をしています。", },
            { id: 3, content: "プロフィール画面を作成しました。", },
        ],
        likedPosts: [
            { id: 101, content: "React Hooks便利ですね。", },
            { id: 102, content: "Tailwind CSSを試してみた。", },
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

                    {profile.skillTags.map((tag) => (
                        <div key={tag}>{tag}</div>
                    ))}
                </div>

                <div>
                    <h3>趣味タグ</h3>

                    {profile.hobbyTags.map((tag) => (
                        <div key={tag}>{tag}</div>
                    ))}
                </div>

                <div>
                    <h3>資格タグ</h3>

                    {profile.certTags.map((tag) => (
                        <div key={tag}>{tag}</div>
                    ))}
                </div>

                <button onClick={handleEditClick}>プロフィールを編集</button>
            </div>
            <div>
                <button onClick={handlePostsClick}>投稿</button>
                <button onClick={handleLikesClick}>いいね</button>
            </div>

            <div>
                {activeTab === "posts" && profile.posts.map((post) => (
                    <div key={post.id}>
                        {post.content}
                    </div>
                ))}

                {activeTab === "likes" && profile.likedPosts.map((post) => (
                    <div key={post.id}>
                        {post.content}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProfilePage;