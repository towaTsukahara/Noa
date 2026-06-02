function ProfileEditPage() {
    const bio = "フロントエンジニアです。";
    const techTags = ["React", "JavaScript", "HTML", "CSS",];
    const hobbyTags = ["ゲーム", "読書", "旅行",];

    return (
        <div>
            <h1>プロフィール編集</h1>

            <div>
                <h3>自己紹介</h3>
                <textarea defaultValue={bio} />
            </div>

            <div>
                <h3>技術タグ</h3>
                {techTags.map((tag) => (
                    <div key={tag}>{tag}</div>
                ))}

                <button>さらに表示</button>
            </div>

            <div>
                <h3>興味タグ</h3>
                {hobbyTags.map((tag) => (
                    <div key={tag}>{tag}</div>
                ))}

                <button>さらに表示</button>
            </div>

            <div>
                <button>キャンセル</button>
                <button>保存</button>
            </div>
        </div>
    );
}

export default ProfileEditPage;