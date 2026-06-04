import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FollowPage() {

    const navigate = useNavigate();
    const [searchKeyword, setSearchKeyword] = useState("");

    // ダミーデータ
    const followedUsers = [
        { id: 1, name: "田中太郎" },
        { id: 2, name: "佐藤花子" },
        { id: 3, name: "鈴木一郎" },
        { id: 4, name: "山田次郎" },
    ];

    const followedTags = {
        technology: [
            { id: 1, name: "Java" },
            { id: 2, name: "Spring Boot" },
            { id: 3, name: "React" },
        ],
        hobby: [
            { id: 4, name: "映画鑑賞" },
            { id: 5, name: "旅行" },
        ],
        qualification: [
            { id: 6, name: "基本情報技術者" },
            { id: 7, name: "応用情報技術者" },
        ],
    };

    // DBから取得する想定（現在はダミー）
    const counts = {
        user: 23,
        tag: 30,
        technology: 12,
        hobby: 8,
        qualification: 10,
    };

    const filteredUsers = useMemo(() => {
        return followedUsers.filter((user) =>
            user.name.toLowerCase().includes(searchKeyword.toLowerCase())
        );
    }, [searchKeyword]);

    const filteredTags = useMemo(() => {
        return {
            technology: followedTags.technology.filter((tag) =>
                tag.name.toLowerCase().includes(searchKeyword.toLowerCase())
            ),
            hobby: followedTags.hobby.filter((tag) =>
                tag.name.toLowerCase().includes(searchKeyword.toLowerCase())
            ),
            qualification: followedTags.qualification.filter((tag) =>
                tag.name.toLowerCase().includes(searchKeyword.toLowerCase())
            ),
        };
    }, [searchKeyword]);

    const handleUnfollow = (userId) => {
        const result = window.confirm("フォローを解除しますか？");

        if (result) {
            console.log(`${userId} のフォローを解除`);
        }
    };

    const handleBackClick = () => {
        navigate("/profile")
    };

    const handleFollowTagEditClick = () => {
        navigate("/follow/tag")
    }

    return (
        <div>
            {/* 検索バー */}
            <input
                type="text"
                placeholder="検索"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
            />

            {/* タブ切替 */}
            <div>
                <button onClick={() => setActiveTab("user")}>
                    ユーザー（{counts.user}）
                </button>

                <button onClick={() => setActiveTab("tag")}>
                    タグ（{counts.tag}）
                </button>
            </div>

            <h3>フォロー中のユーザー</h3>
            <div>
                {filteredUsers.map((user) => (
                    <div key={user.id}>
                        {user.name}
                        <button onClick={() => handleUnfollow(user.id)}>
                            フォローをやめる
                        </button>
                    </div>
                ))}
            </div>

            <h3>フォロー中のタグ</h3>
            {activeTab === "tag" && (
                <div>
                    <h3>技術（{counts.technology}）</h3>
                    {filteredTags.technology.map((tag) => (
                        <div key={tag.id}>{tag.name}</div>
                    ))}

                    <h3>趣味（{counts.hobby}）</h3>
                    {filteredTags.hobby.map((tag) => (
                        <div key={tag.id}>{tag.name}</div>
                    ))}

                    <h3>資格（{counts.qualification}）</h3>
                    {filteredTags.qualification.map((tag) => (
                        <div key={tag.id}>{tag.name}</div>
                    ))}
                </div>
            )}

            <div>
                <button onClick={handleBackClick}>
                    戻る
                </button>
            </div>
        </div>
    );
}