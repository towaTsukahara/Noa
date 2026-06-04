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

    const filteredUsers = useMemo(() => {
        return followedUsers.filter((user) =>
            user.name.toLowerCase().includes(searchKeyword.toLowerCase())
        );
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

    return (
        <div>
            {/* 検索バー */}
            <input
                type="text"
                placeholder="検索"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
            />

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

            <div>
                <button onClick={handleBackClick}>
                    戻る
                </button>
            </div>
        </div>
    );
}