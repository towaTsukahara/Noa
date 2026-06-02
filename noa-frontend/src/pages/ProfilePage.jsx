function ProfilePage() {
    const profile = {
        name: "20260027",
        icon: "https://via.placeholder.com/150",
        bio: "フロントエンドエンジニアです。",
        techTags: ["React", "JavaScript", "HTML", "CSS"],
        hobbyTags: ["ゲーム", "読書", "旅行"],
    };

    return (
        <div>
            <div>
                <div>アイコン</div>
                <div>名前</div>
            </div>

            <div>
                <div>自己紹介</div>
                <div>技術タグ</div>
                <div>趣味タグ</div>

                <button>プロフィールを編集</button>
            </div>
        </div>
    );
}

export default ProfilePage;